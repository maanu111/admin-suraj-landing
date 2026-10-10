"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS, defaultContent, type SiteContent } from "@/lib/content";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import FieldInput from "./field-input";

/** Remembers which section was open, so a refresh does not reset to the top. */
const OPEN_SECTION_KEY = "studio-admin-section";

type Live = "connecting" | "live" | "off";

export default function AdminPanel() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [active, setActive] = useState(SECTIONS[0].key);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [live, setLive] = useState<Live>("connecting");
  const [remote, setRemote] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const mainRef = useRef<HTMLElement>(null);

  // Held in refs so the realtime handler and the save shortcut always see
  // current state without re-subscribing or re-binding on every keystroke.
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const activeRef = useRef(active);
  activeRef.current = active;

  const applyRow = useCallback((section: string, incoming: Record<string, unknown>) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...(defaultContent[section] ?? {}), ...incoming },
    }));
  }, []);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and _ANON_KEY to .env.");
      setLoading(false);
      return;
    }
    const { data, error: err } = await supabase.from("site_content").select("section, content");
    if (err) {
      setError(
        /relation|does not exist|site_content/i.test(err.message)
          ? "Table not found — run supabase/schema.sql in the Supabase SQL editor, then press Reload."
          : err.message,
      );
      setLoading(false);
      return;
    }
    const merged: SiteContent = {};
    for (const [key, value] of Object.entries(defaultContent)) merged[key] = { ...value };
    for (const row of (data ?? []) as { section: string; content: Record<string, unknown> }[]) {
      if (row.content) merged[row.section] = { ...(merged[row.section] ?? {}), ...row.content };
    }
    setContent(merged);
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Reopen whatever section was being edited before the refresh.
  useEffect(() => {
    const saved = localStorage.getItem(OPEN_SECTION_KEY);
    if (saved && SECTIONS.some((item) => item.key === saved)) setActive(saved);
  }, []);

  // Realtime: pick up edits from another browser or device. A section being
  // edited right now is never overwritten — it is flagged instead.
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("site_content_admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, (payload) => {
        const row = payload.new as { section?: string; content?: Record<string, unknown> } | null;
        if (!row?.section || !row.content) return;
        const key = row.section;
        if (dirtyRef.current[key]) {
          setRemote((prev) => (prev.includes(key) ? prev : [...prev, key]));
          return;
        }
        applyRow(key, row.content);
      })
      .subscribe((state) => {
        if (state === "SUBSCRIBED") setLive("live");
        else if (state === "CHANNEL_ERROR" || state === "TIMED_OUT" || state === "CLOSED") setLive("off");
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [applyRow]);

  function setField(sectionKey: string, fieldKey: string, value: unknown) {
    setContent((prev) => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [fieldKey]: value } }));
    setDirty((prev) => ({ ...prev, [sectionKey]: true }));
    setStatus("");
  }

  const save = useCallback(
    async (sectionKey: string) => {
      if (!isSupabaseConfigured) return;
      setSaving(true);
      setError("");
      const { error: err } = await supabase
        .from("site_content")
        .upsert({ section: sectionKey, content: content[sectionKey] }, { onConflict: "section" });

      if (err) {
        setError(`Could not save: ${err.message}`);
      } else {
        setDirty((prev) => ({ ...prev, [sectionKey]: false }));
        setRemote((prev) => prev.filter((s) => s !== sectionKey));
        setStatus("Saved — the live site updates within a second.");
      }
      setSaving(false);
    },
    [content],
  );

  /** One button for everything outstanding — there is no per-section save. */
  async function saveAll() {
    const pending = Object.keys(dirty).filter((key) => dirty[key]);
    if (!pending.length) return;
    for (const key of pending) await save(key);
    setStatus(`Saved ${pending.length} section${pending.length > 1 ? "s" : ""}. The live site updates within a second.`);
  }

  /**
   * Switching section always lands at the top of the new form.
   * Written synchronously and again on the next task — rAF is suspended in
   * hidden or occluded tabs, so scheduling the reset there can skip it.
   */
  function selectSection(key: string) {
    try {
      localStorage.setItem(OPEN_SECTION_KEY, key);
    } catch {
      /* private mode — the section just will not persist */
    }
    const toTop = () => {
      if (mainRef.current) mainRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    };
    setActive(key);
    setMenuOpen(false);
    setStatus("");
    toTop();
    setTimeout(toTop, 0);
  }

  // Cmd/Ctrl+S saves the open section.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveAll();
      }
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  // Warn before losing unsaved edits.
  useEffect(() => {
    const anyDirty = Object.values(dirty).some(Boolean);
    if (!anyDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  /* ---------------------------------------------------------------- */

  const section = SECTIONS.find((item) => item.key === active) ?? SECTIONS[0];
  const dirtyCount = Object.values(dirty).filter(Boolean).length;

  return (
    <div className="a-shell" data-menu={menuOpen || undefined}>
      {menuOpen ? <button type="button" className="a-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} /> : null}

      <aside className="a-side" data-open={menuOpen || undefined}>
        <div className="a-brand">
          <span className="a-dot" aria-hidden="true" />
          <div>
            <strong>CameraCraft</strong>
            <span>Content admin</span>
          </div>
        </div>

        <div className={`a-live a-live-${live}`} title="Supabase realtime connection">
          <i aria-hidden="true" />
          {live === "live" ? "Realtime connected" : live === "connecting" ? "Connecting…" : "Realtime offline"}
        </div>

        <nav className="a-nav" aria-label="Sections">
          {SECTIONS.map((item) => (
            <button
              key={item.key}
              type="button"
              className="a-nav-item"
              aria-current={item.key === active ? "page" : undefined}
              onClick={() => selectSection(item.key)}
            >
              {item.title}
              {dirty[item.key] ? <i className="a-badge" title="Unsaved changes" /> : null}
            </button>
          ))}
        </nav>

      </aside>

      <main className="a-main" ref={mainRef}>
        <header className="a-head">
          <div className="a-head-title">
            <button
              type="button"
              className="a-burger"
              aria-label="Open sections menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" />
            </button>
            <div>
              <h1>{section.title}</h1>
              <p>{section.description}</p>
            </div>
          </div>
          <div className="a-head-actions">
            <button type="button" className="a-btn a-btn-ghost" onClick={() => void load()} disabled={loading || saving}>
              Reload
            </button>
            <button
              type="button"
              className="a-btn a-btn-solid"
              onClick={() => void saveAll()}
              disabled={saving || loading || dirtyCount === 0}
              title="Ctrl/Cmd + S"
            >
              {saving ? "Saving…" : dirtyCount > 1 ? `Save ${dirtyCount} sections` : dirtyCount === 1 ? "Save changes" : "Saved"}
            </button>
          </div>
        </header>

        <div className="a-body">
          {error ? <p className="a-banner a-banner-error">{error}</p> : null}
          {status ? <p className="a-banner a-banner-ok">{status}</p> : null}
          {remote.includes(section.key) ? (
            <p className="a-banner a-banner-warn">
              Someone else changed this section while you were editing. Saving will overwrite theirs — or press Reload
              to take their version and lose yours.
            </p>
          ) : null}

          {loading ? (
            <div className="a-loading">
              <span className="a-spinner" aria-hidden="true" />
              <p>Loading content…</p>
            </div>
          ) : (
            <div className="a-card">
              {section.fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={content[section.key]?.[field.key]}
                  onChange={(next) => setField(section.key, field.key, next)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

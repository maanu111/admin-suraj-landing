"use client";

import { useRef, useState } from "react";
import type { Field } from "@/lib/content";
import { uploadMedia } from "@/lib/supabase";

type Row = Record<string, unknown>;

/* ------------------------------------------------------------------ */
/*  Media input — URL or upload, switchable                            */
/* ------------------------------------------------------------------ */

function MediaInput({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "image" }>;
  value: string;
  onChange: (next: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function send(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadMedia(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="a-media">
      {value ? (
        <div className="a-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" />
          <div className="a-preview-actions">
            <button type="button" className="a-btn a-btn-ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
              {busy ? "Uploading…" : "Replace"}
            </button>
            <button type="button" className="a-link" onClick={() => onChange("")}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Upload only — no URL box. Everything lives in Supabase storage, so
           there is one place a file can come from and nothing to paste wrong. */
        <button
          type="button"
          className="a-drop"
          data-dragging={dragging || undefined}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            void send(e.dataTransfer.files?.[0]);
          }}
          disabled={busy}
        >
          <strong>{busy ? "Uploading…" : "Choose an image"}</strong>
          <span>or drag it here</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => void send(e.target.files?.[0])}
        hidden
      />

      {error ? <p className="a-error">{error}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Repeating list of sub-records                                      */
/* ------------------------------------------------------------------ */

function ListInput({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Row[];
  onChange: (next: Row[]) => void;
}) {
  const rows = Array.isArray(value) ? value : [];
  // Delete used to fire on the first click, destroying a whole block with no
  // undo. It now arms on the first click and disarms itself after 3s.
  const [confirming, setConfirming] = useState<number | null>(null);

  const update = (index: number, key: string, next: unknown) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: next } : row)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="a-list">
      {rows.map((row, index) => (
        <div className="a-item" key={index}>
          <div className="a-item-bar">
            <span>
              {field.singular} {index + 1}
            </span>
            <div className="a-item-actions">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === rows.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="a-del"
                data-armed={confirming === index || undefined}
                onClick={() => {
                  if (confirming === index) {
                    onChange(rows.filter((_, i) => i !== index));
                    setConfirming(null);
                  } else {
                    setConfirming(index);
                    setTimeout(() => setConfirming((current) => (current === index ? null : current)), 3000);
                  }
                }}
                aria-label={
                  confirming === index ? `Confirm delete ${field.singular}` : `Delete ${field.singular}`
                }
              >
                {confirming === index ? "Confirm?" : "Delete"}
              </button>
            </div>
          </div>
          <div className="a-item-body">
            {field.fields.map((sub) => (
              <FieldInput
                key={sub.key}
                field={sub}
                value={row[sub.key]}
                onChange={(next) => update(index, sub.key, next)}
              />
            ))}
          </div>
        </div>
      ))}

      <button type="button" className="a-btn a-btn-ghost" onClick={() => onChange([...rows, {}])}>
        + Add {field.singular}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  if (field.type === "list") {
    return (
      <div className="a-field">
        <label className="a-label">{field.label}</label>
        <ListInput field={field} value={(value as Row[]) ?? []} onChange={onChange} />
      </div>
    );
  }

  const text = typeof value === "string" ? value : value == null ? "" : String(value);

  return (
    <div className="a-field">
      <label className="a-label" htmlFor={`f-${field.key}`}>
        {field.label}
      </label>

      {field.type === "image" ? (
        <MediaInput field={field} value={text} onChange={onChange} />
      ) : field.type === "textarea" ? (
        <textarea id={`f-${field.key}`} className="a-input" rows={3} value={text} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          id={`f-${field.key}`}
          className="a-input"
          type={field.type === "url" ? "text" : "text"}
          value={text}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.help ? <p className="a-hint">{field.help}</p> : null}
    </div>
  );
}

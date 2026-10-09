/**
 * Single source of truth for landing-page content.
 *
 * `defaultContent` is what ships in the bundle — the site renders from it when
 * Supabase is unreachable or a section has never been saved. `SECTIONS` is the
 * schema the admin panel reads to build its forms, so adding a field here adds
 * it to the admin UI automatically.
 */

/** One member per `type` so `Extract<Field, { type: "image" }>` narrows properly. */
export type Field =
  | { key: string; label: string; type: "text"; help?: string }
  | { key: string; label: string; type: "textarea"; help?: string }
  | { key: string; label: string; type: "url"; help?: string }
  | { key: string; label: string; type: "image"; help?: string }
  | { key: string; label: string; type: "video"; help?: string }
  | { key: string; label: string; type: "list"; singular: string; fields: Field[] };

export type SectionDef = {
  key: string;
  title: string;
  description: string;
  fields: Field[];
};

/* ------------------------------------------------------------------ */
/*  Reusable field groups                                              */
/* ------------------------------------------------------------------ */

const linkFields: Field[] = [
  { key: "label", label: "Label", type: "text" },
  { key: "href", label: "Link", type: "url", help: "#section, /page, or https://…" },
];

/* ------------------------------------------------------------------ */
/*  Section schema — drives the admin forms                            */
/* ------------------------------------------------------------------ */

export const SECTIONS: SectionDef[] = [
  {
    key: "brand",
    title: "Brand & navigation",
    description: "Wordmark, nav links, and the header call to action.",
    fields: [
      { key: "wordmark", label: "Wordmark", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "navLinks", label: "Navigation links", type: "list", singular: "link", fields: linkFields },
      { key: "ctaLabel", label: "Header button label", type: "text" },
      { key: "ctaHref", label: "Header button link", type: "url" },
      { key: "whatsappLabel", label: "Floating WhatsApp label", type: "text" },
    ],
  },
  {
    key: "hero",
    title: "Hero",
    description:
      "The dark opening screen — background film still, headline, buttons, the video mosaic and the Recent projects bar.",
    fields: [
      { key: "bgImage", label: "Background still", type: "image", help: "Darkened behind the headline. Landscape works best." },
      { key: "bgAlt", label: "Background alt text", type: "text" },
      { key: "line1", label: "Headline line 1", type: "text" },
      { key: "line2", label: "Headline line 2", type: "text" },
      { key: "sub1", label: "Sub-line 1", type: "text" },
      { key: "sub2", label: "Sub-line 2", type: "text" },
      { key: "primaryLabel", label: "Gold button label", type: "text" },
      { key: "primaryHref", label: "Gold button link", type: "url" },
      { key: "secondaryLabel", label: "Outline button label", type: "text" },
      { key: "secondaryHref", label: "Outline button link", type: "url" },
      {
        key: "tiles",
        label: "Video mosaic",
        type: "list",
        singular: "tile",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "category", label: "Category", type: "text", help: "Shown after the title, e.g. LUXURY AUTO" },
          { key: "image", label: "Thumbnail", type: "image" },
          { key: "video", label: "Video", type: "video", help: "Optional. Plays in a lightbox when clicked." },
          { key: "alt", label: "Alt text", type: "text" },
        ],
      },
      { key: "recentHeading", label: "Recent projects heading", type: "text" },
      { key: "recentLabel", label: "Recent projects button", type: "text" },
      { key: "recentHref", label: "Recent projects link", type: "url" },
    ],
  },
  {
    key: "marquee",
    title: "Marquee",
    description: "The scrolling capability strip under the hero.",
    fields: [
      {
        key: "items",
        label: "Items",
        type: "list",
        singular: "item",
        fields: [{ key: "text", label: "Text", type: "text" }],
      },
    ],
  },
  {
    key: "services",
    title: "Services",
    description: "Pastel capability tiles. Colours cycle automatically in order.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "note", label: "Side note", type: "textarea" },
      {
        key: "items",
        label: "Tiles",
        type: "list",
        singular: "tile",
        fields: [
          { key: "num", label: "Number", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "copy", label: "Description", type: "textarea" },
          { key: "tags", label: "Tags", type: "text", help: "Comma separated" },
          {
            key: "image",
            label: "Photo",
            type: "image",
            help: "Optional. Sits at the top of the tile. Leave empty for a flat colour tile.",
          },
          { key: "alt", label: "Photo alt text", type: "text", help: "Describes the photo for screen readers" },
        ],
      },
    ],
  },
  {
    key: "work",
    title: "Selected work",
    description: "The horizontal case-study rail.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "note", label: "Side note", type: "textarea" },
      {
        key: "items",
        label: "Projects",
        type: "list",
        singular: "project",
        fields: [
          { key: "chip", label: "Chip", type: "text" },
          { key: "client", label: "Client line", type: "text" },
          { key: "year", label: "Year", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "copy", label: "Description", type: "textarea" },
          { key: "metric", label: "Metric", type: "text", help: "Counts up — e.g. 4.1×, +218%, 9.2M" },
          { key: "metricLabel", label: "Metric label", type: "text" },
          { key: "image", label: "Poster image", type: "image" },
          { key: "video", label: "Video", type: "video", help: "Leave empty to show the image only" },
          { key: "alt", label: "Alt text", type: "text" },
          { key: "href", label: "Case study link", type: "url", help: "Optional" },
        ],
      },
    ],
  },
  {
    key: "process",
    title: "Process",
    description: "The four-step how-it-runs cards.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "note", label: "Side note", type: "textarea" },
      {
        key: "steps",
        label: "Steps",
        type: "list",
        singular: "step",
        fields: [
          { key: "label", label: "Step label", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "copy", label: "Description", type: "textarea" },
          {
            key: "image",
            label: "Photo",
            type: "image",
            help: "Optional. Bleeds to the top edge of the card. Leave empty for a plain white card.",
          },
          { key: "alt", label: "Photo alt text", type: "text" },
        ],
      },
    ],
  },
  {
    key: "numbers",
    title: "Numbers",
    description: "The dark statistics band. Each value animates upward on scroll.",
    fields: [
      {
        key: "items",
        label: "Stats",
        type: "list",
        singular: "stat",
        fields: [
          { key: "value", label: "Value", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
    ],
  },
  {
    key: "reviews",
    title: "Reviews",
    description: "Client quotes on the dark panel. Avatar tints cycle automatically.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "note", label: "Side note", type: "textarea" },
      {
        key: "items",
        label: "Reviews",
        type: "list",
        singular: "review",
        fields: [
          { key: "quote", label: "Quote", type: "textarea" },
          { key: "name", label: "Name", type: "text" },
          { key: "role", label: "Role and location", type: "text" },
          { key: "avatar", label: "Avatar image", type: "image", help: "Optional — falls back to the initial" },
        ],
      },
    ],
  },
  {
    key: "blogs",
    title: "Blogs",
    description: "Journal cards. Tile colours cycle automatically.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "note", label: "Side note", type: "textarea" },
      {
        key: "items",
        label: "Posts",
        type: "list",
        singular: "post",
        fields: [
          { key: "art", label: "Tile type", type: "text", help: "The big text on the tile — e.g. 0:03" },
          { key: "kicker", label: "Kicker", type: "text" },
          { key: "category", label: "Category", type: "text" },
          { key: "read", label: "Read time", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "copy", label: "Excerpt", type: "textarea" },
          { key: "image", label: "Cover image", type: "image", help: "Optional — replaces the pastel tile" },
          { key: "href", label: "Article link", type: "url" },
        ],
      },
    ],
  },
  {
    key: "about",
    title: "About page",
    description: "The /about page — intro, studio story, and what the studio stands for.",
    fields: [
      { key: "metaTitle", label: "Browser / search title", type: "text" },
      { key: "metaDescription", label: "Meta description", type: "textarea" },
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "headingAccent", label: "Heading accent (red)", type: "text" },
      { key: "lead", label: "Lead paragraph", type: "textarea" },
      { key: "storyEyebrow", label: "Story eyebrow", type: "text" },
      { key: "storyHeading", label: "Story heading", type: "text" },
      { key: "storyBody", label: "Story body", type: "textarea", help: "Blank line between paragraphs" },
      { key: "storyImage", label: "Story photo", type: "image" },
      { key: "storyAlt", label: "Story photo alt text", type: "text" },
      {
        key: "stats",
        label: "Stats strip",
        type: "list",
        singular: "stat",
        fields: [
          { key: "value", label: "Value", type: "text", help: "Counts up on screen" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
      { key: "valuesEyebrow", label: "Values eyebrow", type: "text" },
      { key: "valuesHeading", label: "Values heading", type: "text" },
      {
        key: "values",
        label: "Values",
        type: "list",
        singular: "value",
        fields: [
          { key: "num", label: "Number", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "copy", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "team",
    title: "Team page",
    description: "The /team page. Each member card takes a photo, role, short bio and a profile link.",
    fields: [
      { key: "metaTitle", label: "Browser / search title", type: "text" },
      { key: "metaDescription", label: "Meta description", type: "textarea" },
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "headingAccent", label: "Heading accent (red)", type: "text" },
      { key: "note", label: "Intro paragraph", type: "textarea" },
      {
        key: "members",
        label: "Members",
        type: "list",
        singular: "member",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "role", label: "Role", type: "text" },
          { key: "bio", label: "Short bio", type: "textarea" },
          { key: "image", label: "Photo", type: "image", help: "Portrait crops best — roughly 4:5" },
          { key: "alt", label: "Photo alt text", type: "text" },
          { key: "linkLabel", label: "Link label", type: "text", help: "e.g. LinkedIn" },
          { key: "linkHref", label: "Link", type: "url" },
        ],
      },
    ],
  },
  {
    key: "contact",
    title: "Enquiry form",
    description: "Copy around the WhatsApp enquiry form, and its dropdown options.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "lead", label: "Lead paragraph", type: "textarea" },
      {
        key: "points",
        label: "Reassurance points",
        type: "list",
        singular: "point",
        fields: [{ key: "text", label: "Text", type: "text" }],
      },
      { key: "whatsapp", label: "WhatsApp number", type: "text", help: "Digits with country code, e.g. 919876543210" },
      { key: "services", label: "Service options", type: "text", help: "Comma separated" },
      { key: "budgets", label: "Budget options", type: "text", help: "Comma separated" },
    ],
  },
  {
    key: "cta",
    title: "Closing CTA",
    description: "The full-width indigo band above the footer.",
    fields: [
      { key: "heading", label: "Heading", type: "text" },
      { key: "headingAccent", label: "Heading accent", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "primaryLabel", label: "Primary button label", type: "text" },
      { key: "primaryHref", label: "Primary button link", type: "url" },
      { key: "secondaryLabel", label: "Secondary button label", type: "text" },
      { key: "secondaryHref", label: "Secondary button link", type: "url" },
    ],
  },
  {
    key: "footer",
    title: "Footer",
    description: "Footer blurb, link columns and the legal line.",
    fields: [
      { key: "about", label: "About blurb", type: "textarea" },
      {
        key: "columns",
        label: "Link columns",
        type: "list",
        singular: "column",
        fields: [
          { key: "title", label: "Column title", type: "text" },
          { key: "links", label: "Links", type: "list", singular: "link", fields: linkFields },
        ],
      },
      {
        key: "socials",
        label: "Social links",
        type: "list",
        singular: "social",
        fields: linkFields,
      },
      { key: "ctaTitle", label: "Sign-off heading", type: "text" },
      { key: "ctaBody", label: "Sign-off body", type: "textarea" },
      { key: "ctaLabel", label: "Sign-off button label", type: "text" },
      { key: "ctaHref", label: "Sign-off button link", type: "url" },
      { key: "statusText", label: "Status line", type: "text", help: "Shown beside the green dot" },
      { key: "bigMark", label: "Oversized wordmark", type: "text", help: "The giant word across the footer base" },
      { key: "legal", label: "Legal line", type: "text" },
      { key: "note", label: "Secondary note", type: "text" },
    ],
  },
  {
    key: "seo",
    title: "SEO & metadata",
    description:
      "Search and social metadata. Feeds the page title, meta description, Open Graph and Twitter cards, sitemap, robots.txt and the JSON-LD business listing.",
    fields: [
      {
        key: "canonicalDomain",
        label: "Canonical domain",
        type: "url",
        help: "Leave empty — the site detects its own address. Only set this if it answers on several domains and one should be the indexed one, e.g. https://studio.com.",
      },
      { key: "siteName", label: "Site name", type: "text", help: "Brand name shown in search results and OG cards" },
      { key: "title", label: "Page title", type: "text", help: "50–60 characters. Shown as the blue link in Google." },
      {
        key: "description",
        label: "Meta description",
        type: "textarea",
        help: "150–160 characters. The grey snippet under the title.",
      },
      { key: "keywords", label: "Keywords", type: "text", help: "Comma separated. Minor ranking value; useful for your own records." },
      { key: "ogImage", label: "Social share image", type: "image", help: "1200×630. Leave empty to auto-generate one." },
      { key: "twitterHandle", label: "X / Twitter handle", type: "text", help: "Including the @" },
      { key: "locale", label: "Locale", type: "text", help: "e.g. en_IN" },
      { key: "noindex", label: "Hide from search engines", type: "text", help: 'Type "yes" to block indexing. Leave empty to stay indexed.' },

      { key: "businessName", label: "Legal business name", type: "text" },
      { key: "businessType", label: "Business category", type: "text", help: "e.g. Video production and marketing studio" },
      { key: "phone", label: "Public phone", type: "text", help: "+91…" },
      { key: "email", label: "Public email", type: "text" },
      { key: "streetAddress", label: "Street address", type: "text" },
      { key: "addressLocality", label: "City", type: "text" },
      { key: "addressRegion", label: "State", type: "text" },
      { key: "postalCode", label: "Postal code", type: "text" },
      { key: "addressCountry", label: "Country code", type: "text", help: "Two letters, e.g. IN" },
      { key: "areaServed", label: "Areas served", type: "text", help: "Comma separated" },
      { key: "priceRange", label: "Price range", type: "text", help: "e.g. ₹₹ or ₹50,000+" },
      { key: "foundingDate", label: "Founded", type: "text", help: "YYYY or YYYY-MM-DD" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Defaults — what renders before anything is saved                   */
/* ------------------------------------------------------------------ */

export type SiteContent = Record<string, Record<string, unknown>>;

export const defaultContent: SiteContent = {
  seo: {
    canonicalDomain: "",
    siteName: "Studio",
    title: "Studio — Marketing & Video Editing That People Finish Watching",
    description:
      "An independent marketing and video editing studio. Paid social, brand films, product video, motion graphics, colour and sound — strategy and the edit under one roof.",
    keywords:
      "video editing studio, marketing agency, paid social ads, brand films, product video, motion graphics, colour grading, sound design, performance creative, India",
    ogImage: "",
    twitterHandle: "",
    locale: "en_IN",
    noindex: "",
    businessName: "Studio",
    businessType: "Video production and marketing studio",
    phone: "",
    email: "",
    streetAddress: "",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    postalCode: "",
    addressCountry: "IN",
    areaServed: "India, Worldwide",
    priceRange: "₹₹",
    foundingDate: "",
  },
  brand: {
    wordmark: "Studio",
    tagline: "Marketing × Motion",
    navLinks: [
      { label: "Services", href: "/#services" },
      { label: "Work", href: "/#work" },
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Process", href: "/#process" },
      { label: "Reviews", href: "/#reviews" },
      { label: "Blogs", href: "/#blogs" },
    ],
    ctaLabel: "Start a project",
    ctaHref: "#contact",
    whatsappLabel: "WhatsApp us",
  },
  hero: {
    bgImage: "/campaign-fashion.png",
    bgAlt: "Film crew lighting a set behind the camera",
    line1: "We craft visual",
    line2: "stories that inspire.",
    sub1: "Premium video production & post-production",
    sub2: "for brands & films.",
    primaryLabel: "Explore our reel",
    primaryHref: "/#work",
    secondaryLabel: "Latest work",
    secondaryHref: "/#work",
    tiles: [
      { title: "Global brand campaign", category: "Luxury auto", image: "/ad-reel-hero.png", video: "", alt: "Red-lit fragrance bottle wrapped in smoke" },
      { title: "Crafting the unseen", category: "Documentary", image: "/campaign-fashion.png", video: "", alt: "Model in a cobalt coat in a sunlit colonnade" },
      { title: "Urban beat", category: "Music video", image: "/campaign-beverage.png", video: "", alt: "Citrus soda poured over ice" },
      { title: "Story of creation", category: "Fashion", image: "/campaign-fashion.png", video: "", alt: "Model in a cobalt coat in a sunlit colonnade" },
      { title: "Urban of beat", category: "Video", image: "/campaign-beverage.png", video: "", alt: "Citrus soda poured over ice" },
      { title: "Tech innovation", category: "Corporate", image: "/ad-reel-hero.png", video: "", alt: "Red-lit fragrance bottle wrapped in smoke" },
    ],
    recentHeading: "Recent projects",
    recentLabel: "View all work",
    recentHref: "/#work",
  },
  marquee: {
    items: [
      { text: "Paid social" },
      { text: "Brand films" },
      { text: "Product video" },
      { text: "Motion graphics" },
      { text: "Colour grade" },
      { text: "Sound design" },
      { text: "Performance creative" },
    ],
  },
  services: {
    eyebrow: "What we do",
    heading: "Everything between the idea and the upload.",
    note: "Five pillars, one team. Bring a brief, a folder of raw footage, or nothing but a deadline — we can start from any of them.",
    items: [
      {
        num: "01",
        title: "Paid social that pays",
        copy: "Hook-first vertical edits built for the feed, shipped in volume and iterated on real performance data.",
        tags: "Meta, YouTube, Reels",
      },
      {
        num: "02",
        title: "Brand films",
        copy: "Campaign stories with a point of view — scripted, shot, and finished to a standard that travels.",
        tags: "Script, Direction, Post",
      },
      {
        num: "03",
        title: "Product video",
        copy: "Make the detail, the benefit, and the feeling impossible to miss in under thirty seconds.",
        tags: "Demo, Launch, UGC",
      },
      {
        num: "04",
        title: "Motion & graphics",
        copy: "Titles, supers, transitions, and animated systems that carry the brand rather than decorate it.",
        tags: "2D, 3D, Design system",
      },
      {
        num: "05",
        title: "Colour & sound",
        copy: "The grade and the mix — the last ten percent that separates a decent cut from a finished film.",
        tags: "Grade, Mix, Sound design",
      },
    ],
  },
  work: {
    eyebrow: "Selected work",
    heading: "Made to move the number that matters.",
    note: "A glimpse at the kind of visual worlds we like to build. Campaign visuals shown as creative direction examples.",
    items: [
      {
        chip: "Product film",
        client: "Fragrance · D2C",
        year: "2025",
        title: "Cut from red light",
        copy: "A 20-second launch film built on one beam of light, atmospheric haze, and a single hero hold.",
        metric: "4.1×",
        metricLabel: "return on ad spend",
        image: "/ad-reel-hero.png",
        video: "",
        alt: "Red-lit fragrance bottle wrapped in smoke on a wet reflective surface",
        href: "",
      },
      {
        chip: "Brand campaign",
        client: "Fashion · Retail",
        year: "2025",
        title: "Made to move",
        copy: "Outerwear shot in motion — hard light, long shadows, and a coat that does the acting.",
        metric: "+218%",
        metricLabel: "qualified traffic",
        image: "/campaign-fashion.png",
        video: "",
        alt: "Model in a cobalt wool coat walking through a sunlit concrete colonnade",
        href: "",
      },
      {
        chip: "Social cutdown",
        client: "Beverage · FMCG",
        year: "2024",
        title: "A little more sparkle",
        copy: "One high-speed pour, re-cut into nine vertical variants for a summer always-on push.",
        metric: "9.2M",
        metricLabel: "organic views",
        image: "/campaign-beverage.png",
        video: "",
        alt: "Citrus soda poured over ice with orange and lime slices and flying droplets",
        href: "",
      },
    ],
  },
  process: {
    eyebrow: "How it runs",
    heading: "Easy to work with. Hard to scroll past.",
    note: "A short, visible process. You always know what is happening, what is next, and what it costs.",
    steps: [
      { label: "01 — Align", title: "Get the brief right", copy: "Audience, platform, objective, and the one thing a viewer should walk away with." },
      { label: "02 — Build", title: "Shape the story", copy: "Scripting, boards, and a first cut fast enough to react to before the budget moves." },
      { label: "03 — Finish", title: "Grade and mix", copy: "Colour, sound, graphics, and every platform-ready aspect ratio you need." },
      { label: "04 — Scale", title: "Learn and repeat", copy: "We read the numbers, cut new variants, and compound what already works." },
    ],
  },
  numbers: {
    items: [
      { value: "340+", label: "campaigns shipped" },
      { value: "62M", label: "views driven" },
      { value: "4.3", label: "average ROAS" },
      { value: "48h", label: "first-cut turnaround" },
    ],
  },
  reviews: {
    eyebrow: "Client reviews",
    heading: "Good work. Better together.",
    note: "Sample reviews shown as placeholders — swap in approved client quotes before launch.",
    items: [
      {
        quote:
          "We were struggling with our creatives since quite some time. They understood the brief in the first call itself and reverted with a cut within two days — honestly it was already better than what we had been going back and forth on for a month.",
        name: "Ananya Mehta",
        role: "Head of Growth, D2C skincare · Mumbai",
        avatar: "",
      },
      {
        quote:
          "Most agencies will just hand over the files and tell you to do the needful. These people actually sit with the media plan and the edit together. That is the real value, no?",
        name: "Ritwik Banerjee",
        role: "Founder, beverage startup · Kolkata",
        avatar: "",
      },
      {
        quote:
          "Earlier we were managing one hero film per quarter. Now we are running close to forty variants a month and the brand is still looking premium. Our CAC has come down by almost one-third.",
        name: "Priya Nair",
        role: "Marketing Director, fashion retail · Bengaluru",
        avatar: "",
      },
      {
        quote:
          "Timelines were followed strictly, no follow-up required from our side even once. The grade on our launch film is still the best in our category — our distributors also said the same.",
        name: "Harpreet Singh Gill",
        role: "Brand Manager, FMCG · Ludhiana",
        avatar: "",
      },
      {
        quote:
          "Briefed on Monday, live by Thursday. During festive season this kind of speed matters a lot. Whenever we asked them to prepone a delivery, they managed it without compromising on the output.",
        name: "Sneha Iyer",
        role: "Performance Lead, agency · Chennai",
        avatar: "",
      },
      {
        quote:
          "We are a small team and were a bit worried about the budget. They were very transparent about the scope from day one, and whatever was committed, the same was delivered.",
        name: "Meghna Borthakur",
        role: "Co-founder, home décor · Guwahati",
        avatar: "",
      },
    ],
  },
  blogs: {
    eyebrow: "Blogs",
    heading: "Think like an editor.",
    note: "Notes from post — what we learn cutting hundreds of ads a year, written down before we forget it.",
    items: [
      {
        art: "0:03",
        kicker: "Field note / 01",
        category: "Editing",
        read: "6 min read",
        title: "The first three seconds decide the whole campaign",
        copy: "The hook is the costliest real estate in any edit. Four patterns we keep coming back to, and how to test them properly before you put media spend behind the ad.",
        image: "",
        href: "#blogs",
      },
      {
        art: "9:16",
        kicker: "Field note / 02",
        category: "Strategy",
        read: "8 min read",
        title: "One shoot, every aspect ratio — planning Reels and TVC together",
        copy: "How to plan a single shoot so the same campaign travels from a 16:9 TVC to a 9:16 Reel, without the vertical cut looking like an afterthought.",
        image: "",
        href: "#blogs",
      },
      {
        art: "SFX",
        kicker: "Field note / 03",
        category: "Craft",
        read: "5 min read",
        title: "Sound is half the picture, and most of us get it wrong",
        copy: "Small sound-design choices that make a product feel premium on screen — and why so many Indian D2C ads are still being mixed far too loud.",
        image: "",
        href: "#blogs",
      },
    ],
  },
  about: {
    metaTitle: "About the studio",
    metaDescription:
      "An independent marketing and video editing studio — who we are, how we work, and the people behind the edit.",
    eyebrow: "About us",
    heading: "A small studio built around",
    headingAccent: "the edit.",
    lead: "We started because the best footage in the world still dies in a bad cut. Strategy, the edit and the media plan sit in one room here, so nothing gets lost being handed between three agencies.",
    storyEyebrow: "The studio",
    storyHeading: "Built in the cutting room, not the boardroom.",
    storyBody:
      "Every one of us came up editing. That shapes how we scope work: we know what a brief costs in hours, which ideas survive the timeline, and where a campaign quietly loses its audience.\n\nWe keep the team deliberately small. The person you brief is the person cutting your film, and the first version lands in days rather than weeks — early enough that changing your mind is still cheap.\n\nWe work with founders, brand teams and agencies, from single product films to always-on social programmes.",
    storyImage: "/campaign-fashion.png",
    storyAlt: "Model in a cobalt wool coat walking through a sunlit colonnade",
    stats: [
      { value: "340+", label: "campaigns shipped" },
      { value: "62M", label: "views driven" },
      { value: "9", label: "years cutting" },
      { value: "48h", label: "first-cut turnaround" },
    ],
    valuesEyebrow: "How we think",
    valuesHeading: "Four things we will not trade away.",
    values: [
      { num: "01", title: "The hook is the brief", copy: "If the first three seconds do not earn attention, nothing after them matters. We build backwards from that." },
      { num: "02", title: "Small team, no handoffs", copy: "The person in the room is the person on the timeline. Nothing gets lost in translation between agencies." },
      { num: "03", title: "Fast first, perfect second", copy: "An early rough cut you can react to beats a polished one you cannot afford to change." },
      { num: "04", title: "Numbers decide, not taste", copy: "We read the performance data and let it settle arguments that opinion cannot." },
    ],
  },
  team: {
    metaTitle: "The team",
    metaDescription:
      "The editors, strategists and colourists behind the studio — small by design, so you work with the people who actually cut the film.",
    eyebrow: "The team",
    heading: "The people behind",
    headingAccent: "the edit.",
    note: "Small by design — you work with the people who actually cut the film, not an account layer in front of them.",
    members: [
      {
        name: "Ananya Mehta",
        role: "Founder & Creative Director",
        bio: "Fifteen years across brand films and performance creative. Sets the direction on every campaign and still grades the hero cuts herself.",
        image: "",
        alt: "",
        linkLabel: "LinkedIn",
        linkHref: "",
      },
      {
        name: "Ritwik Banerjee",
        role: "Head of Post",
        bio: "Runs the timeline. Obsessive about pacing, and the reason first cuts leave here in forty-eight hours rather than two weeks.",
        image: "",
        alt: "",
        linkLabel: "LinkedIn",
        linkHref: "",
      },
      {
        name: "Priya Nair",
        role: "Strategy Lead",
        bio: "Writes the brief before anyone touches a camera. Reads the media plan and the edit as one document, which is rarer than it should be.",
        image: "",
        alt: "",
        linkLabel: "LinkedIn",
        linkHref: "",
      },
      {
        name: "Harpreet Singh Gill",
        role: "Colourist & Finishing",
        bio: "The last pair of eyes on everything that ships. Grade, mix and delivery across every aspect ratio a platform can ask for.",
        image: "",
        alt: "",
        linkLabel: "LinkedIn",
        linkHref: "",
      },
    ],
  },
  contact: {
    eyebrow: "Enquiry form",
    heading: "Tell us what you’re making.",
    lead: "Fill this in and it opens a pre-filled WhatsApp message to our studio. No forms lost in an inbox, no three-day wait for a reply.",
    points: [
      { text: "Reply within one working day" },
      { text: "Fixed-scope quotes, no hourly surprises" },
      { text: "First cut inside 48 hours on most briefs" },
    ],
    whatsapp: "",
    services:
      "Paid social ads, Brand film, Product video, Social cutdowns, Motion graphics, Colour and sound, Full campaign, Not sure yet",
    budgets: "Under ₹50k, ₹50k – ₹2L, ₹2L – ₹5L, ₹5L+, Still deciding",
  },
  cta: {
    heading: "Let’s make",
    headingAccent: "it land.",
    body: "Brand films, performance creative, and everything in between. Bring the brief — we will bring the plan, the edit, and the numbers that follow.",
    primaryLabel: "Start a project",
    primaryHref: "#contact",
    secondaryLabel: "See the work",
    secondaryHref: "#work",
  },
  footer: {
    about: "An independent marketing and video editing studio. Working studio identity — replace with your brand.",
    columns: [
      {
        title: "Services",
        links: [
          { label: "Paid social", href: "#services" },
          { label: "Brand films", href: "#services" },
          { label: "Product video", href: "#services" },
          { label: "Motion graphics", href: "#services" },
        ],
      },
      {
        title: "Studio",
        links: [
          { label: "Work", href: "/#work" },
      { label: "About", href: "/about" },
      { label: "Team", href: "/team" },
          { label: "Process", href: "#process" },
          { label: "Reviews", href: "#reviews" },
          { label: "Blogs", href: "#blogs" },
        ],
      },
      {
        title: "Contact",
        links: [
          { label: "Start a project", href: "#contact" },
          { label: "WhatsApp enquiry", href: "#contact" },
        ],
      },
    ],
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Behance", href: "https://behance.net" },
    ],
    ctaTitle: "Got a brief?",
    ctaBody: "Tell us what you are making and we will come back within one working day.",
    ctaLabel: "Start a project",
    ctaHref: "#contact",
    statusText: "Taking on work for Q1",
    bigMark: "STUDIO",
    legal: "© 2026 Studio",
    note: "Campaign frames are concept visuals",
  },
};

/** Splits a comma-separated admin field into a trimmed array. */
export function toList(value: unknown): string[] {
  return String(value ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

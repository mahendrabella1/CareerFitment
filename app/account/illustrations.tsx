"use client";

/**
 * illustrations — professional flat-vector illustrations from Popsy
 * (illustrations.popsy.co), a free library. Served in the brand "red" colour
 * variant straight from their CDN, so they look professionally designed and
 * stay on-brand without us hand-drawing anything. Each falls back to a neutral
 * panel if the network is unavailable, so a missing image never looks broken.
 */

/* eslint-disable @next/next/no-img-element */

const POPSY = (slug: string) => `https://illustrations.popsy.co/red/${slug}.svg`;

function Art({ slug, alt, className }: { slug: string; alt: string; className?: string }) {
  return (
    <img
      className={className}
      src={POPSY(slug)}
      alt={alt}
      loading="lazy"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
      style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
    />
  );
}

/** The hero character — a student with a laptop, exploring careers. */
export function StudentHero({ className }: { className?: string }) {
  return <Art slug="man-with-a-laptop" alt="A student exploring career paths" className={className} />;
}

const SCENE_SLUG: Record<string, string> = {
  careers: "keynote-presentation",
  education: "taking-notes",
  future: "app-launch",
  roadmap: "man-riding-a-rocket",
  growth: "achievement",
  resources: "remote-work",
};

/** Themed section-band illustration. */
export function Scene({ kind, className }: { kind: keyof typeof SCENE_SLUG | string; className?: string }) {
  return <Art slug={SCENE_SLUG[kind] ?? "achievement"} alt={`${kind} illustration`} className={className} />;
}

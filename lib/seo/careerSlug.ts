/**
 * The address of a public career page (/careers/<slug>) from a career's name.
 * Light on purpose - no roadmap data - so dashboard code can link straight to
 * a career page (lib/seo/careers.ts has the pages themselves, server-only).
 */
export const careerSlug = (name: string) =>
  name.toLowerCase().replace(/&/g, " and ").replace(/\+/g, " plus ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

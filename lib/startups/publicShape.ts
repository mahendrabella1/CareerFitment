import type { Track, Module, Lesson } from "@/data/startups/content";

// Nav/listing pages never need quiz content at all, let alone its secrets -
// but importing data/startups/content.ts from ANY "use client" component
// bundles the WHOLE module (quiz answers included) into client JS regardless
// of which fields actually get rendered, since bundlers can't tree-shake
// fields out of one exported object literal. So even these metadata-only
// shapes get built server-side and passed down as props, never imported
// directly by a client component.
export interface PublicLesson {
  slug: string; title: string; order: number; durationMin: number; questionCount: number; passMark: number;
}
export interface PublicModule {
  slug: string; title: string; order: number; missionText: string; portfolioItem: string;
  passMark: number; lessons: PublicLesson[];
}
export interface PublicTrack {
  slug: string; title: string; level: string; description: string; modules: PublicModule[];
}

export function toPublicLesson(l: Lesson): PublicLesson {
  return { slug: l.slug, title: l.title, order: l.order, durationMin: l.durationMin, questionCount: l.quiz.length, passMark: l.passMark };
}
export function toPublicModule(m: Module): PublicModule {
  return { slug: m.slug, title: m.title, order: m.order, missionText: m.missionText, portfolioItem: m.portfolioItem, passMark: m.passMark, lessons: m.lessons.map(toPublicLesson) };
}
export function toPublicTrack(t: Track): PublicTrack {
  return { slug: t.slug, title: t.title, level: t.level, description: t.description, modules: t.modules.map(toPublicModule) };
}

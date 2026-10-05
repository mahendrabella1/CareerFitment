export interface LessonContent {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  body: string[];
  points?: string[];
  videoId?: string;
  tool?: { href: string; label: string };
  source?: { label: string; url: string };
}

export interface ModuleContent {
  id: string;
  title: string;
  summary: string;
  lessons: LessonContent[];
}

export interface CourseContent {
  key: string;
  accent: string;
  kicker: string;
  title: string;
  subtitle: string;
  outcomes: string[];
  modules: ModuleContent[];
}

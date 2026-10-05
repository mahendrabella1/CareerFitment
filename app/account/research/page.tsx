import { CourseLanding } from "@/components/course/CourseLanding";
import { ResearchActiveCard } from "@/components/course/ResearchActiveCard";
import { RESEARCH_COURSE } from "@/data/courses/research";

export default function ResearchHomePage() {
  return <CourseLanding content={RESEARCH_COURSE} topSlot={<ResearchActiveCard accent={RESEARCH_COURSE.accent} />} />;
}

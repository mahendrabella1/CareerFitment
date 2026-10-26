import { FeatureLanding } from "@/components/feature/FeatureLanding";
import { ResearchActiveCard } from "@/components/course/ResearchActiveCard";
import { RESEARCH_COURSE } from "@/data/courses/research";

export default function ResearchHomePage() {
  return <FeatureLanding content={RESEARCH_COURSE} topSlot={<ResearchActiveCard accent={RESEARCH_COURSE.accent} />} />;
}

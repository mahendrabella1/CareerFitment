import { LikertAverageStrategy } from "./likertAverageStrategy";
import { RiasecTopCodeStrategy } from "./riasecStrategy";
import { ScoringStrategy } from "./types";

const likertAverage = new LikertAverageStrategy();
const riasecTopCode = new RiasecTopCodeStrategy();

/**
 * Parameter name -> strategy. Add an entry here when a parameter needs
 * instrument-specific scoring; everything else falls through to the
 * generic normalized average.
 */
const REGISTRY: Record<string, ScoringStrategy> = {
  "Career Interests": riasecTopCode,
};

export function getScoringStrategy(parameterName: string): ScoringStrategy {
  return REGISTRY[parameterName] ?? likertAverage;
}

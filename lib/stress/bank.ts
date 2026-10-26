import raw from "@/data/professionals/stress-bank.json";
import type { Band, Bank, BankItem, ScaleKey, Step } from "./types";

export const BANK = raw as unknown as Bank;

const sectionOf = (id: string) => BANK.sections.find((s) => s.id === id)!;
export const scaleOf = (item: BankItem): ScaleKey => item.scale ?? sectionOf(item.section).scale;

/** The scored questions for one experience band: the shared core plus that band's own. */
export function itemsFor(band: Band): BankItem[] {
  return BANK.items.filter((i) => !i.band || i.band === band);
}

/** Every screen of the test, in order: scored questions section by section, then the work-week facts. */
export function stepsFor(band: Band): Step[] {
  const steps: Step[] = [];
  for (const section of BANK.sections) {
    for (const item of itemsFor(band).filter((i) => i.section === section.id)) {
      steps.push({ kind: "item", item, section, scale: scaleOf(item) });
    }
  }
  const checkin = sectionOf("checkin");
  for (const fact of BANK.facts) steps.push({ kind: "fact", fact, section: checkin });
  return steps;
}

export const isBand = (v: unknown): v is Band => v === "0-5" || v === "5-15" || v === "15+";

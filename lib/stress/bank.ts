import raw from "@/data/professionals/stress-bank.json";
import type { AreaKey, Band, Bank, BankArea, BankItem } from "./types";

export const BANK = raw as unknown as Bank;

export const areaOf = (id: AreaKey): BankArea => BANK.areas.find((a) => a.id === id)!;
export const itemById = (id: string): BankItem | undefined => BANK.items.find((i) => i.id === id);
export const itemsIn = (area: AreaKey): BankItem[] => BANK.items.filter((i) => i.area === area);

/** Every question in the order asked: area by area, then the closing question. */
export const QUESTION_COUNT = BANK.items.length + 1;

export const isBand = (v: unknown): v is Band => v === "0-5" || v === "5-15" || v === "15+";

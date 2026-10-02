/**
 * India's NMC requirements for a foreign MBBS degree to be usable for
 * practice in India - real, sourced requirements from the spec's own
 * section 11 (citing a Careers360 summary of the NMC advisory), not
 * invented. This is safety-critical content: a wrong or missing checklist
 * item could mean 5-6 years and a large sum of money producing a degree a
 * graduate can't actually use in India.
 */
export const NMC_CHECKLIST: { label: string; detail: string }[] = [
  { label: "At least 54 months of study", detail: "Plus a 12-month internship at the SAME foreign institution, all completed within 10 years." },
  { label: "Taught in English", detail: "With a syllabus and clinical training matching Indian MBBS subjects." },
  { label: "Equal local practice rights", detail: "The degree must allow the graduate to practise in that country on the same basis as its own citizens - not a restricted or foreign-only licence." },
  { label: "12-month supervised internship in India after returning", detail: "Required regardless of the foreign internship already completed." },
  { label: "Pass the licensing exit test", detail: "The national licensing exam is mandatory before practising in India." },
];
export const NMC_SOURCE_URL = "https://www.careers360.com/";
export const NMC_CHECKED_AT = "2026-10-02";

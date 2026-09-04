#!/usr/bin/env node

/**
 * Script to validate that Class 6 and Class 7 assessments have exactly 60 questions
 * and match the blueprint specifications provided.
 */

import fs from "fs";
import path from "path";

interface AssessmentFile {
  metadata: {
    version: string;
    targetGrade: string;
    totalQuestions: number;
    assessmentType: string;
    description: string;
  };
  dimensions: Array<{
    id: string;
    name: string;
    questions: number[];
    type: string;
    options: number;
    scoring: string;
  }>;
  questions: Array<{
    id: number;
    section: string;
    text: string;
    options: string[];
  }>;
}

const EXPECTED_STRUCTURE = {
  personality: { count: 10, min: 1, max: 10 },
  riasec: { count: 10, min: 11, max: 20 },
  aptitude: { count: 10, min: 21, max: 30 },
  strengths: { count: 8, min: 31, max: 38 },
  motivators: { count: 7, min: 39, max: 45 },
  learning: { count: 5, min: 46, max: 50 },
  emotional: { count: 5, min: 51, max: 55 },
  creativity: { count: 5, min: 56, max: 60 },
};

function validateAssessment(filePath: string, grade: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data: AssessmentFile = JSON.parse(content);

    // Check metadata
    if (data.metadata.totalQuestions !== 60) {
      errors.push(
        `metadata.totalQuestions is ${data.metadata.totalQuestions}, expected 60`
      );
    }

    // Check actual question count
    if (data.questions.length !== 60) {
      errors.push(
        `questions array has ${data.questions.length} items, expected 60`
      );
    }

    // Check dimensions
    let totalDimensionQuestions = 0;
    for (const dim of data.dimensions) {
      totalDimensionQuestions += dim.questions.length;
    }

    if (totalDimensionQuestions !== 60) {
      errors.push(
        `dimensions reference ${totalDimensionQuestions} questions total, expected 60`
      );
    }

    // Validate each dimension
    for (const [dimKey, dimSpec] of Object.entries(EXPECTED_STRUCTURE)) {
      const dim = data.dimensions.find((d) => d.id === dimKey);
      if (!dim) {
        errors.push(`Missing dimension: ${dimKey}`);
        continue;
      }

      if (dim.questions.length !== dimSpec.count) {
        errors.push(
          `Dimension "${dimKey}" has ${dim.questions.length} questions, expected ${dimSpec.count}`
        );
      }

      // Check question ID ranges
      const questionIds = dim.questions.sort((a, b) => a - b);
      const minId = questionIds[0];
      const maxId = questionIds[questionIds.length - 1];

      if (minId < dimSpec.min || maxId > dimSpec.max) {
        errors.push(
          `Dimension "${dimKey}" question IDs [${minId}-${maxId}] outside expected range [${dimSpec.min}-${dimSpec.max}]`
        );
      }
    }

    // Check for duplicate question IDs
    const idCounts: Record<number, number> = {};
    for (const q of data.questions) {
      idCounts[q.id] = (idCounts[q.id] || 0) + 1;
    }

    for (const [id, count] of Object.entries(idCounts)) {
      if (count > 1) {
        errors.push(`Question ID ${id} appears ${count} times (duplicates)`);
      }
    }

    // Check for missing question IDs
    const presentIds = new Set(data.questions.map((q) => q.id));
    for (let i = 1; i <= 60; i++) {
      if (!presentIds.has(i)) {
        errors.push(`Missing question ID: ${i}`);
      }
    }

    // Warnings
    if (data.metadata.targetGrade !== grade) {
      warnings.push(
        `Metadata targetGrade is "${data.metadata.targetGrade}", expected "${grade}"`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (err) {
    return {
      valid: false,
      errors: [
        `Failed to read/parse file: ${err instanceof Error ? err.message : "Unknown error"}`,
      ],
      warnings: [],
    };
  }
}

function main() {
  const files = [
    { path: "data/class6-assessment-questions.json", grade: "6" },
    { path: "data/class7-assessment-questions.json", grade: "7" },
  ];

  let allValid = true;

  for (const file of files) {
    const filePath = path.join(process.cwd(), file.path);
    console.log(`\n📋 Validating ${file.path}...`);

    const result = validateAssessment(filePath, file.grade);

    if (result.valid) {
      console.log(`✅ Class ${file.grade} Assessment: VALID`);
      console.log(
        `   ✓ 60 questions found`,
        `\n   ✓ All dimensions present`,
        `\n   ✓ No duplicates`,
        `\n   ✓ All question IDs (1-60) present`
      );
    } else {
      console.log(`❌ Class ${file.grade} Assessment: INVALID`);
      allValid = false;
    }

    if (result.errors.length > 0) {
      console.log(`\n  Errors:`);
      result.errors.forEach((e) => console.log(`    ✗ ${e}`));
    }

    if (result.warnings.length > 0) {
      console.log(`\n  Warnings:`);
      result.warnings.forEach((w) => console.log(`    ⚠ ${w}`));
    }
  }

  console.log(
    `\n${"=".repeat(50)}`
  );
  if (allValid) {
    console.log(
      "✅ All assessments are valid and ready for deployment!\n"
    );
    process.exit(0);
  } else {
    console.log("❌ Issues found. Please fix before deploying.\n");
    process.exit(1);
  }
}

main();

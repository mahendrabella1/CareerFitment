import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

interface ProgrammeRecommendation {
  programmeId: string;
  programmeName: string;
  family: string;
  streamCode: string;
  eligibilityStatus: "GREEN" | "YELLOW" | "RED" | "GREEN_YELLOW" | "RED_YELLOW";
  statusDescription: string | null;
}

interface ProgrammesResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    stream?: string;
    recommendations: {
      green: ProgrammeRecommendation[];
      yellow: ProgrammeRecommendation[];
      red: ProgrammeRecommendation[];
    };
    summary: {
      totalProgrammesMatched: number;
      idealFitCount: number;
      goodFitCount: number;
      notRecommendedCount: number;
    };
  } | null;
}

/**
 * Get programme recommendations based on student's academic stream.
 * Uses FuturePath consolidated mapping data to show:
 * - GREEN: Perfect fit for the stream
 * - YELLOW: Good fit, compatible
 * - RED: Not recommended for the stream
 */
export async function GET(
  _req: Request,
  { params }: { params: { sessionId: string } }
): Promise<NextResponse<ProgrammesResponse>> {
  try {
    const admin = getSupabaseAdmin();

    // For now, we'll return a placeholder that shows the structure
    // In a full implementation, stream would come from the assessment results
    const streamCode = "PCM"; // This would come from the session data

    // Get programmes for the given stream
    const { data: mappings, error: mappingError } = await admin
      .from("programme_stream_eligibility")
      .select(
        `
        eligibility_status,
        status_description,
        programmes (
          id,
          name,
          degree_families (
            name
          )
        ),
        stream_groups (
          code,
          name
        )
      `
      )
      .eq("stream_groups.code", streamCode)
      .order("eligibility_status", { ascending: false });

    if (mappingError) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to fetch programme mappings: ${mappingError.message}`,
          statusCode: 500,
          data: null,
        },
        { status: 500 }
      );
    }

    // Organize by eligibility status
    const green: ProgrammeRecommendation[] = [];
    const yellow: ProgrammeRecommendation[] = [];
    const red: ProgrammeRecommendation[] = [];

    for (const mapping of mappings ?? []) {
      const prog = (mapping as any).programmes;
      const stream = (mapping as any).stream_groups;
      const family = prog?.degree_families?.name ?? "Unknown";

      const rec: ProgrammeRecommendation = {
        programmeId: prog?.id ?? "",
        programmeName: prog?.name ?? "Unknown",
        family,
        streamCode: stream?.code ?? "",
        eligibilityStatus: mapping.eligibility_status,
        statusDescription: mapping.status_description,
      };

      const status = mapping.eligibility_status as string;
      if (status.includes("GREEN")) {
        green.push(rec);
      } else if (status.includes("YELLOW")) {
        yellow.push(rec);
      } else if (status.includes("RED")) {
        red.push(rec);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Found ${green.length + yellow.length + red.length} programme recommendations for ${streamCode}`,
        statusCode: 200,
        data: {
          stream: streamCode,
          recommendations: { green, yellow, red },
          summary: {
            totalProgrammesMatched: green.length + yellow.length + red.length,
            idealFitCount: green.length,
            goodFitCount: yellow.length,
            notRecommendedCount: red.length,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        success: false,
        message: `Error fetching programme recommendations: ${message}`,
        statusCode: 500,
        data: null,
      },
      { status: 500 }
    );
  }
}

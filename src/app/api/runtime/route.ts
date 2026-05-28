import { NextResponse } from "next/server";
import {
  runCompanionRuntime,
  validateCompanionRuntimeRequest,
} from "@/lib/companionRuntime";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON body.",
        details: ["Request body must be valid JSON."],
      },
      { status: 400 },
    );
  }

  const validation = validateCompanionRuntimeRequest(body);

  if (!validation.ok) {
    return NextResponse.json(
      {
        error: "Invalid companion runtime request.",
        details: validation.errors,
      },
      { status: 400 },
    );
  }

  try {
    const response = await runCompanionRuntime(validation.request);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Runtime request failed.";
    return NextResponse.json(
      {
        error: "Runtime request failed.",
        details: [message],
      },
      { status: 500 },
    );
  }
}

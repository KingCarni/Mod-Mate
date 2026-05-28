import { NextResponse } from "next/server";
import {
  runMockCompanionRuntime,
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

  const response = runMockCompanionRuntime(validation.request);
  return NextResponse.json(response);
}

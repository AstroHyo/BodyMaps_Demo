import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const {
    jobs: { inQueue },
  } = await fetch(`${process.env.RUNPOD_ENDPOINT}/runsync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RUNPOD_ENDPOINT_KEY}`,
    },
  }).then((r) => r.json());

  return NextResponse.json({ inQueue });
}

import { NextResponse } from "next/server";
import { getContentLibrary, getRandomLot } from "@/lib/content";

export async function GET() {
  const lot = getRandomLot();
  const library = getContentLibrary();

  if (!lot) {
    return NextResponse.json(
      { ok: false, error: library.fallbackMessages.empty },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, lot });
}

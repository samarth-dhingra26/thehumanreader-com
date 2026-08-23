import { NextRequest, NextResponse } from "next/server";
import outputs from "../../../../amplify_outputs.json";

export async function POST(request: NextRequest) {
  const { tier, email } = await request.json();
  if (!tier || !email) {
    return NextResponse.json({ error: "Missing tier or email" }, { status: 400 });
  }

  const functionUrl = (outputs as { custom?: { quickCheckoutFunctionUrl?: string } }).custom
    ?.quickCheckoutFunctionUrl;
  if (!functionUrl) {
    return NextResponse.json({ error: "Checkout not configured" }, { status: 500 });
  }

  const origin = request.nextUrl.origin;
  const response = await fetch(functionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier, email, origin }),
  });
  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.error ?? "Something went wrong" },
      { status: response.status || 500 }
    );
  }

  return NextResponse.json(data);
}

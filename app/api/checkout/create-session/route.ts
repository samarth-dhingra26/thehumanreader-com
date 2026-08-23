import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "../../../../lib/amplify/session";
import { serverDataClient } from "../../../../lib/amplify/server-data";
import { getTier } from "../../../../lib/stripe/tiers";
import outputs from "../../../../amplify_outputs.json";

export async function POST(request: NextRequest) {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { tier: tierKey } = await request.json();
  const tier = getTier(tierKey);
  if (!tier) {
    return NextResponse.json({ error: "Unknown tier" }, { status: 400 });
  }

  const { data: profiles } = await serverDataClient.models.UserProfile.list();
  const profile =
    profiles[0] ??
    (
      await serverDataClient.models.UserProfile.create({
        consentGivenAt: new Date().toISOString(),
      })
    ).data;
  if (!profile || !profile.owner) {
    return NextResponse.json({ error: "Could not set up your account" }, { status: 400 });
  }
  const owner = profile.owner;

  const userEmail = user.signInDetails?.loginId ?? "";
  const origin = request.nextUrl.origin;

  const functionUrl = (outputs as { custom?: { checkoutFunctionUrl?: string } }).custom
    ?.checkoutFunctionUrl;
  if (!functionUrl) {
    return NextResponse.json({ error: "Checkout not configured" }, { status: 500 });
  }

  const response = await fetch(functionUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier: tier.key, owner, email: userEmail, origin }),
  });
  const data = await response.json();

  if (!response.ok || !data.url) {
    return NextResponse.json(
      { error: data.error ?? "Could not create checkout session" },
      { status: response.status || 500 }
    );
  }

  return NextResponse.json({ url: data.url });
}

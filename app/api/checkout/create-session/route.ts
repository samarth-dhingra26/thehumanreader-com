import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "../../../../lib/amplify/session";
import { serverDataClient } from "../../../../lib/amplify/server-data";
import { getStripeClient } from "../../../../lib/stripe/server";
import { getTier } from "../../../../lib/stripe/tiers";

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

  const priceId = process.env[tier.priceEnvVar];
  if (!priceId) {
    return NextResponse.json({ error: "Tier not configured" }, { status: 500 });
  }

  const { data: profiles } = await serverDataClient.models.UserProfile.list();
  const profile = profiles[0];
  if (!profile || !profile.owner) {
    return NextResponse.json({ error: "No profile found for this account" }, { status: 400 });
  }
  const owner = profile.owner;

  const userEmail = user.signInDetails?.loginId ?? "";
  const origin = request.nextUrl.origin;

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?purchase=success`,
    cancel_url: `${origin}/dashboard?purchase=cancelled`,
    client_reference_id: owner,
    customer_email: userEmail || undefined,
    metadata: {
      owner,
      tier: tier.key,
      userEmail,
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}

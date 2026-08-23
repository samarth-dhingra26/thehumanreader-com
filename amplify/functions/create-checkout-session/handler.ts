import type { LambdaFunctionURLHandler } from "aws-lambda";
import Stripe from "stripe";

const PRICE_IDS: Record<string, string | undefined> = {
  SINGLE_ESSAY: process.env.STRIPE_PRICE_SINGLE_ESSAY,
  ONE_SCHOOL: process.env.STRIPE_PRICE_ONE_SCHOOL,
  THREE_SCHOOL: process.env.STRIPE_PRICE_THREE_SCHOOL,
  SIX_SCHOOL: process.env.STRIPE_PRICE_SIX_SCHOOL,
  UNLIMITED: process.env.STRIPE_PRICE_UNLIMITED,
};

function json(statusCode: number, body: Record<string, unknown>) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler: LambdaFunctionURLHandler = async (event) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json(500, { error: "Server misconfigured" });
  }

  let payload: { tier?: string; owner?: string; email?: string; origin?: string };
  try {
    payload = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "Invalid request body" });
  }

  const { tier, owner, email, origin } = payload;
  const priceId = tier ? PRICE_IDS[tier] : undefined;

  if (!tier || !priceId) {
    return json(400, { error: "Tier not configured" });
  }
  if (!owner || !origin) {
    return json(400, { error: "Missing owner or origin" });
  }

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?purchase=success`,
    cancel_url: `${origin}/dashboard?purchase=cancelled`,
    client_reference_id: owner,
    customer_email: email || undefined,
    metadata: { owner, tier, userEmail: email ?? "" },
  });

  if (!session.url) {
    return json(500, { error: "Could not create checkout session" });
  }

  return json(200, { url: session.url });
};

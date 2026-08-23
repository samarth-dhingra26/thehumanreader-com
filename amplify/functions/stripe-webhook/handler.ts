import type { LambdaFunctionURLHandler } from "aws-lambda";
import Stripe from "stripe";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

// constructEvent only verifies the HMAC signature locally and never calls
// Stripe's API, so the client here never needs a real secret key.
const stripe = new Stripe("sk_test_placeholder_not_used_for_api_calls");
const ddb = new DynamoDBClient();

export const handler: LambdaFunctionURLHandler = async (event) => {
  const signature = event.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const tableName = process.env.PURCHASE_TABLE_NAME;

  if (!signature || !secret || !tableName) {
    return { statusCode: 500, body: "Server misconfigured" };
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body ?? "", "base64")
    : (event.body ?? "");

  let stripeEvent: Stripe.Event;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("Signature verification failed:", err);
    return { statusCode: 400, body: "Invalid signature" };
  }

  if (
    stripeEvent.type !== "checkout.session.completed" &&
    stripeEvent.type !== "checkout.session.async_payment_succeeded"
  ) {
    return { statusCode: 200, body: "Ignored" };
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session;

  if (session.payment_status === "unpaid") {
    return { statusCode: 200, body: "Not yet paid" };
  }

  const owner = session.metadata?.owner;
  const tier = session.metadata?.tier;
  const userEmail = session.metadata?.userEmail ?? session.customer_details?.email ?? "";

  if (!owner || !tier) {
    console.error("Missing owner/tier metadata on session", session.id);
    return { statusCode: 200, body: "Missing metadata, skipped" };
  }

  await ddb.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall({
        id: session.id,
        owner,
        userEmail,
        tier,
        amountCents: session.amount_total ?? 0,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : "",
        status: "COMPLETED",
        completedAt: new Date().toISOString(),
        __typename: "Purchase",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    })
  );

  return { statusCode: 200, body: "OK" };
};

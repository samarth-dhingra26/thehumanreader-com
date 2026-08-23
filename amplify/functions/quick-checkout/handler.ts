import type { LambdaFunctionURLHandler } from "aws-lambda";
import Stripe from "stripe";
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminCreateUserCommand,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

const cognito = new CognitoIdentityProviderClient();
const ddb = new DynamoDBClient();

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

// Creates the account and lets Cognito generate + email its own temporary
// password (its built-in invitation email, independent of our SES setup).
// The visitor never sees a password here — they set one the first time they
// actually log in to view their dashboard, well after checkout is done.
export const handler: LambdaFunctionURLHandler = async (event) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const userPoolId = process.env.USER_POOL_ID;
  const profileTableName = process.env.USERPROFILE_TABLE_NAME;
  if (!secretKey || !userPoolId || !profileTableName) {
    return json(500, { error: "Server misconfigured" });
  }

  let payload: { tier?: string; email?: string; origin?: string };
  try {
    payload = JSON.parse(event.body ?? "{}");
  } catch {
    return json(400, { error: "Invalid request body" });
  }

  const { tier, origin } = payload;
  const email = payload.email?.trim().toLowerCase();
  const priceId = tier ? PRICE_IDS[tier] : undefined;

  if (!tier || !priceId) {
    return json(400, { error: "Tier not configured" });
  }
  if (!email || !origin) {
    return json(400, { error: "Missing email or origin" });
  }

  try {
    await cognito.send(new AdminGetUserCommand({ UserPoolId: userPoolId, Username: email }));
    return json(200, { status: "existing_account" });
  } catch (err) {
    if (!(err instanceof UserNotFoundException)) {
      console.error("AdminGetUser failed", err);
      return json(500, { error: "Could not check account" });
    }
  }

  let sub: string | undefined;
  try {
    const created = await cognito.send(
      new AdminCreateUserCommand({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "email_verified", Value: "true" },
        ],
      })
    );
    sub = created.User?.Username;
  } catch (err) {
    console.error("Account creation failed", err);
    return json(500, { error: "Could not create your account" });
  }

  if (!sub) {
    return json(500, { error: "Could not create your account" });
  }

  const owner = `${sub}::${sub}`;
  const now = new Date().toISOString();

  await ddb.send(
    new PutItemCommand({
      TableName: profileTableName,
      Item: marshall({
        id: randomUUID(),
        owner,
        consentGivenAt: now,
        __typename: "UserProfile",
        createdAt: now,
        updatedAt: now,
      }),
    })
  );

  const stripe = new Stripe(secretKey);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/purchase-complete?email=${encodeURIComponent(email)}`,
    cancel_url: `${origin}/dashboard?purchase=cancelled`,
    client_reference_id: owner,
    customer_email: email,
    metadata: { owner, tier, userEmail: email },
  });

  if (!session.url) {
    return json(500, { error: "Could not create checkout session" });
  }

  return json(200, { status: "new_account", checkoutUrl: session.url });
};

import { defineFunction, secret } from "@aws-amplify/backend";

export const stripeWebhook = defineFunction({
  name: "stripe-webhook",
  entry: "./handler.ts",
  environment: {
    STRIPE_WEBHOOK_SECRET: secret("STRIPE_WEBHOOK_SECRET"),
  },
  timeoutSeconds: 15,
});

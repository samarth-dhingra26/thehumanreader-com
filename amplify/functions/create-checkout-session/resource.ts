import { defineFunction, secret } from "@aws-amplify/backend";

export const createCheckoutSession = defineFunction({
  name: "create-checkout-session",
  entry: "./handler.ts",
  environment: {
    STRIPE_SECRET_KEY: secret("STRIPE_SECRET_KEY"),
    STRIPE_PRICE_SINGLE_ESSAY: process.env.STRIPE_PRICE_SINGLE_ESSAY ?? "",
    STRIPE_PRICE_ONE_SCHOOL: process.env.STRIPE_PRICE_ONE_SCHOOL ?? "",
    STRIPE_PRICE_THREE_SCHOOL: process.env.STRIPE_PRICE_THREE_SCHOOL ?? "",
    STRIPE_PRICE_SIX_SCHOOL: process.env.STRIPE_PRICE_SIX_SCHOOL ?? "",
    STRIPE_PRICE_UNLIMITED: process.env.STRIPE_PRICE_UNLIMITED ?? "",
  },
  timeoutSeconds: 15,
});

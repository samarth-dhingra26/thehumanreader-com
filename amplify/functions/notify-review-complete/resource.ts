import { defineFunction } from "@aws-amplify/backend";

export const notifyReviewComplete = defineFunction({
  name: "notify-review-complete",
  entry: "./handler.ts",
});

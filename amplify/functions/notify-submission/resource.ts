import { defineFunction } from "@aws-amplify/backend";

export const notifySubmission = defineFunction({
  name: "notify-submission",
  entry: "./handler.ts",
});

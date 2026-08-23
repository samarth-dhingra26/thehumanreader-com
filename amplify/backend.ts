import { defineBackend } from "@aws-amplify/backend";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition, FunctionUrlAuthType, Function as LambdaFunction } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { notifySubmission } from "./functions/notify-submission/resource";
import { notifyReviewComplete } from "./functions/notify-review-complete/resource";
import { stripeWebhook } from "./functions/stripe-webhook/resource";

const backend = defineBackend({
  auth,
  data,
  notifySubmission,
  notifyReviewComplete,
  stripeWebhook,
});

const submissionTable = backend.data.resources.tables["Submission"];
const reviewTable = backend.data.resources.tables["Review"];
const purchaseTable = backend.data.resources.tables["Purchase"];

// Notify the founder on every new paragraph submission.
backend.notifySubmission.resources.lambda.addEventSource(
  new DynamoEventSource(submissionTable, {
    startingPosition: StartingPosition.LATEST,
  })
);

backend.notifySubmission.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["ses:SendEmail"],
    resources: ["*"],
  })
);

// Notify the student the first time their submission is reviewed.
backend.notifyReviewComplete.resources.lambda.addEventSource(
  new DynamoEventSource(reviewTable, {
    startingPosition: StartingPosition.LATEST,
  })
);

backend.notifyReviewComplete.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["ses:SendEmail"],
    resources: ["*"],
  })
);

submissionTable.grantReadData(backend.notifyReviewComplete.resources.lambda);

(backend.notifyReviewComplete.resources.lambda as LambdaFunction).addEnvironment(
  "SUBMISSION_TABLE_NAME",
  submissionTable.tableName
);

// Stripe webhook: verify signature, record completed purchases.
purchaseTable.grantWriteData(backend.stripeWebhook.resources.lambda);

(backend.stripeWebhook.resources.lambda as LambdaFunction).addEnvironment(
  "PURCHASE_TABLE_NAME",
  purchaseTable.tableName
);

backend.stripeWebhook.resources.lambda.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
});

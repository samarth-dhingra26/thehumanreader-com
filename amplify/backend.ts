import { defineBackend } from "@aws-amplify/backend";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { notifySubmission } from "./functions/notify-submission/resource";

const backend = defineBackend({
  auth,
  data,
  notifySubmission,
});

const submissionTable = backend.data.resources.tables["Submission"];

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

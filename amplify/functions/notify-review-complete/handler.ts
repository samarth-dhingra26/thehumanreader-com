import type { DynamoDBStreamHandler } from "aws-lambda";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ses = new SESv2Client();
const ddb = new DynamoDBClient();
const FROM_ADDRESS = "review@thehumanreader.com";

export const handler: DynamoDBStreamHandler = async (event) => {
  const submissionTable = process.env.SUBMISSION_TABLE_NAME;
  if (!submissionTable) throw new Error("SUBMISSION_TABLE_NAME is not set");

  for (const record of event.Records) {
    if (record.eventName !== "INSERT" || !record.dynamodb?.NewImage) continue;

    const review = unmarshall(
      record.dynamodb.NewImage as Record<string, import("@aws-sdk/client-dynamodb").AttributeValue>
    );

    const { Item } = await ddb.send(
      new GetItemCommand({
        TableName: submissionTable,
        Key: { id: { S: review.submissionId } },
      })
    );

    if (!Item) {
      console.error("No submission found for id", review.submissionId);
      continue;
    }

    const submission = unmarshall(Item);

    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: FROM_ADDRESS,
        Destination: { ToAddresses: [submission.submitterEmail] },
        Content: {
          Simple: {
            Subject: { Data: "Your free paragraph review is ready" },
            Body: {
              Text: {
                Data: [
                  `Hi ${submission.submitterName},`,
                  "",
                  "A matched human reader just finished reviewing your paragraph.",
                  "Log in to your dashboard to read it:",
                  "",
                  "https://thehumanreader.com/dashboard",
                ].join("\n"),
              },
            },
          },
        },
      })
    );
  }
};

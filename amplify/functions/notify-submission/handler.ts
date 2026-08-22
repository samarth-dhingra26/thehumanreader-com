import type { DynamoDBStreamHandler } from "aws-lambda";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const ses = new SESv2Client();
const NOTIFY_ADDRESS = "review@thehumanreader.com";

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    if (record.eventName !== "INSERT" || !record.dynamodb?.NewImage) continue;

    const item = unmarshall(
      record.dynamodb.NewImage as Record<string, import("@aws-sdk/client-dynamodb").AttributeValue>
    );

    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: NOTIFY_ADDRESS,
        Destination: { ToAddresses: [NOTIFY_ADDRESS] },
        Content: {
          Simple: {
            Subject: { Data: "New free paragraph review submission" },
            Body: {
              Text: {
                Data: [
                  `From: ${item.submitterName} <${item.submitterEmail}>`,
                  "",
                  item.paragraphText,
                  "",
                  "Review it at https://thehumanreader.com/admin",
                ].join("\n"),
              },
            },
          },
        },
      })
    );
  }
};

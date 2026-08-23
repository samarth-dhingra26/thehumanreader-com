import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  UserProfile: a
    .model({
      consentGivenAt: a.datetime().required(),
    })
    .authorization((allow) => [allow.owner().to(["read", "create"])]),

  Submission: a
    .model({
      paragraphText: a.string().required(),
      submitterName: a.string().required(),
      submitterEmail: a.email().required(),
      status: a.enum(["PENDING", "REVIEWED"]),
      submittedAt: a.datetime().required(),
      review: a.hasOne("Review", "submissionId"),
    })
    .authorization((allow) => [
      allow.owner().to(["read", "create"]),
      allow.group("Admins").to(["read", "update"]),
    ]),

  Review: a
    .model({
      submissionId: a.id().required(),
      submission: a.belongsTo("Submission", "submissionId"),
      reviewText: a.string().required(),
      reviewedAt: a.datetime().required(),
      reviewedBy: a.string(),
      owner: a.string(),
    })
    .authorization((allow) => [
      allow.owner().to(["read"]),
      allow.group("Admins").to(["create", "read", "update"]),
    ]),

  Purchase: a
    .model({
      owner: a.string().required(),
      userEmail: a.string().required(),
      tier: a.enum(["SINGLE_ESSAY", "ONE_SCHOOL", "THREE_SCHOOL", "SIX_SCHOOL", "UNLIMITED"]),
      amountCents: a.integer().required(),
      stripeCheckoutSessionId: a.string().required(),
      stripePaymentIntentId: a.string(),
      status: a.enum(["PENDING", "COMPLETED"]),
      completedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(["read"]),
      allow.group("Admins").to(["read"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

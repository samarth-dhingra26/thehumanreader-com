import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "../../../lib/amplify/server-utils";

export async function GET() {
  const user = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) =>
      getCurrentUser(contextSpec)
        .then((u) => ({ ok: true, u }))
        .catch((e) => ({ ok: false, error: String(e) })),
  });

  const session = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) =>
      fetchAuthSession(contextSpec)
        .then((s) => ({ ok: true, groups: s.tokens?.idToken?.payload["cognito:groups"] }))
        .catch((e) => ({ ok: false, error: String(e) })),
  });

  return NextResponse.json({ user, session });
}

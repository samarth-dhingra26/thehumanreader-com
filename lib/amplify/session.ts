import { cookies } from "next/headers";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "./server-utils";

export async function getServerUser() {
  return runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => getCurrentUser(contextSpec).catch(() => null),
  });
}

export async function isServerUserAdmin() {
  const session = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: (contextSpec) => fetchAuthSession(contextSpec).catch(() => null),
  });

  const groups = session?.tokens?.idToken?.payload["cognito:groups"];
  return Array.isArray(groups) && groups.includes("Admins");
}

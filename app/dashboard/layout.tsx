import { redirect } from "next/navigation";
import { getServerUser } from "../../lib/amplify/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login?redirect=/dashboard");
  return <>{children}</>;
}

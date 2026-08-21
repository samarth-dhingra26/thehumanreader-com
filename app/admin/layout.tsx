import { redirect } from "next/navigation";
import { getServerUser, isServerUserAdmin } from "../../lib/amplify/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) redirect("/login?redirect=/admin");

  const isAdmin = await isServerUserAdmin();
  if (!isAdmin) redirect("/dashboard");

  return <>{children}</>;
}

import { Suspense } from "react";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Suspense>
          <LoginForm />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

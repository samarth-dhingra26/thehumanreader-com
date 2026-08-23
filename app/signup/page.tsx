import { Suspense } from "react";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import SignupForm from "../../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Suspense>
          <SignupForm />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

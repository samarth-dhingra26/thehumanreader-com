import { Suspense } from "react";
import SiteHeader from "../../components/layout/SiteHeader";
import SiteFooter from "../../components/layout/SiteFooter";
import QuickBuyForm from "../../components/auth/QuickBuyForm";

export default function BuyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Suspense>
          <QuickBuyForm />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

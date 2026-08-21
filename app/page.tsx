import SiteHeader from "../components/layout/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter";
import Hero from "../components/sections/Hero";
import Differentiation from "../components/sections/Differentiation";
import FreeScoreCta from "../components/sections/FreeScoreCta";
import FreeReviewCta from "../components/sections/FreeReviewCta";
import ServicesOverview from "../components/sections/ServicesOverview";
import HowMatchingWorks from "../components/sections/HowMatchingWorks";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Differentiation />
        <FreeReviewCta />
        <FreeScoreCta />
        <ServicesOverview />
        <HowMatchingWorks />
      </main>
      <SiteFooter />
    </>
  );
}

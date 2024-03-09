import HeroText from "@/src/app/(marketing)/hero-text";
import Analyze from "@/src/app/(marketing)/analyze";
import Pricing from "@/src/app/(marketing)/components/plans";
import FAQ from "@/src/app/(marketing)/pricing/faq";
import Features from "@/src/app/(marketing)/features";
import Stats from "@/src/app/(marketing)/stats";

export default async function IndexPage() {
  return (
    <div className="pb-10">
      <div className="container">
        <section className="  pt-6 md:container  ">
          <HeroText />
        </section>
      </div>
    </div>
  );
}

import HeroText from "@/src/app/(marketing)/hero-text";
import {constructMetadata} from "@/lib/utils";
import Credibility from "@/src/app/(marketing)/credibility";
import Steps from "./steps";
import Footer from "@/src/app/(marketing)/components/footer";
export const metadata = constructMetadata({
  title: "Moltar",
  description: "Upload and ask away, Moltar will do the rest!",
  image: "image/favicon.ico",
});

export default async function IndexPage() {
  return (
    <div className="">
      <div className="container">
        <div className="  pt-6 md:container  md:mt-10  ">
          <HeroText />
        </div>
      </div>
      <Credibility />
      <Steps />
      <Footer />
    </div>
  );
}

import HeroText from "@/src/app/(marketing)/hero-text";
import {constructMetadata} from "@/lib/utils";
import Credibility from "@/src/app/(marketing)/credibility";
export const metadata = constructMetadata({
  title: "Moltar",
  description: "Upload and ask away, Moltar will do the rest!",
  image: "image/favicon.ico",
});

export default async function IndexPage() {
  return (
    <div className="pb-10  ">
      <div className="container">
        <div className="  pt-6 md:container  md:mt-10  ">
          <HeroText />
        </div>
      </div>
      <Credibility />
    </div>
  );
}

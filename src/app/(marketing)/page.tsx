import HeroText from "@/src/app/(marketing)/hero-text";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Moltar",
  description: "Upload and ask away, Moltar will do the rest!",
  image: "image/favicon.ico",
});

export default async function IndexPage() {
  return (
    <div className="pb-10">
      <div className="container">
        <section className="  pt-6 md:container  md:mt-10  ">
          <HeroText />
        </section>
      </div>
    </div>
  );
}

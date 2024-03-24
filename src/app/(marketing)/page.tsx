import HeroText from "@/src/app/(marketing)/hero-text";

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

import React from "react";
import { constructMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import Pricing from "@/components/plans";
import FAQ from "./faq";

export const metadata = constructMetadata({
  title: `Pricing - ${siteConfig.name}`,
});

const page = () => {
  return (
    <div className="pb-10">
      <div className="mx-auto sm:max-w-lg ">
        <h2 className="font-display text-center text-2xl md:text-4xl font-extrabold text-primary sm:text-5xl">
          Simple,{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            transparent
          </span>{" "}
          <br className="md:hidden block" />
          pricing.
        </h2>
      </div>
      <div className="z-10 flex items-center flex-col container">
        <div className="mt-4 md:mt-8 mb-10 md:mb-0 mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-md border-theme-blue border px-7 py-2 transition-all ">
          <p className="text-[12px] font-semibold text-theme-blue">
            7 Day Free Trial. Cancel Anytime!
          </p>
        </div>
        <Pricing />
      </div>
      <FAQ />
    </div>
  );
};

export default page;

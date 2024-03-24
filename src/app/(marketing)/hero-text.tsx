import React, {useEffect, useState} from "react";
import {LinkButton} from "@/components/ui/link";
import {Icons} from "@/components/icons";

type HeaderProps = {
  text: string;
  gradientClass: string;
};

const HeroText: React.FC = () => {
  return (
    <div className=" flex z-10 flex-col items-center gap-2 text-center ">
      <div className="mx-auto mb-10  px-2.5 text-center flex items-center flex-col max-w-md sm:px-0">
        <h1 className=" mt-5 font-display capitalize text-3xl font-extrabold leading-[1.15] text-primary sm:text-5xl sm:leading-[1.15]">
          {/* <span className="mx-4 text-theme-blue">Never</span> */}
          With <span className="mx-2 text-theme-blue">Moltar</span> <br />
          You&apos;ll Never have to read again
        </h1>
        <h2 className="mt-5 text-muted-foreground sm:text-xl">
          Need a 10 page document analyzed? An article read? Our AI model can do
          it all and more!! Try it out for free below 👇
        </h2>

        <div className="mx-auto mt-6 flex w-full flex-col md:flex-row md:max-w-fit gap-4 ">
          <div className="p-[2px] rounded-lg bg-gradient-to-r from-theme-purple via-theme-blue to-theme-green shadow-lg">
            <LinkButton
              size="lg"
              href="/upload"
              className="w-full md:w-fit whitespace-nowrap   bg-background/70 dark:bg-background/50 hover:bg-background/60  justify-center md:justify-start"
            >
              <span className="flex items-center  md:justify-between md:w-full gap-3 font-bold text-primary">
                Start Using Moltar
                <Icons.arrowRight className="w-5 h-5 inline-block text-primary group-hover:ml-6" />
              </span>
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroText;

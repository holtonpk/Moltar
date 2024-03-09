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
        {/* <a
          href="/onboarding/register"
          target="_blank"
          rel="noreferrer"
          className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-md border-theme-blue border px-7 py-2 transition-all z-10"
        >
          <p className="text-[12px] font-semibold text-theme-blue">
            Start now for free!
          </p>
        </a> */}

        <h1 className=" mt-5 font-display capitalize text-3xl font-extrabold leading-[1.15] text-primary sm:text-5xl sm:leading-[1.15]">
          <span className="mr-4 text-theme-blue">Upload</span>&
          <span className=" mx-4 text-theme-blue">Ask</span>
          Moltar will do the rest!
        </h1>
        <h2 className="mt-5 text-muted-foreground sm:text-xl">
          Moltar.ai is an AI tool that analyzes uploaded documents, files, and
          URLs, allowing users to ask questions or prompts about the content for
          immediate answers.
        </h2>

        <div className="mx-auto mt-10 flex w-full flex-col md:flex-row md:max-w-fit gap-4 ">
          <div className="p-[2px] rounded-lg bg-gradient-to-r from-theme-purple via-theme-blue to-theme-green shadow-lg">
            <LinkButton
              size="lg"
              href="/onboarding/register"
              className="w-full md:w-fit whitespace-nowrap   bg-card  hover:bg-card/80"
            >
              <span className="flex items-center justify-between w-full gap-3 font-bold bg-gradient-to-r from-theme-purple via-theme-blue to-theme-green bg-clip-text text-transparent">
                Start leveraging Moltar
                <Icons.arrowRight className="w-5 h-5 inline-block text-theme-green" />
              </span>
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroText;

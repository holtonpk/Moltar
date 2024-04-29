import React from "react";
import {Icons} from "@/components/icons";

const Footer = () => {
  return (
    <div className="w-full h-fit bg-primary/20 blurBack flex flex-col items-center justify-center pt-6 pb-2 mt-10">
      <div className="grid grid-cols-[32px_1fr]  gap-2 ">
        <Icons.logo className="h-8 w-8 " />

        <span className="font-bold  text-3xl  leading-[32px] fade-in text-primary">
          Moltar.ai
        </span>
      </div>
      <span className="w-fit whitespace-nowrap mt-2">
        © 2024 Moltar Ai - All rights reserved
      </span>
    </div>
  );
};

export default Footer;

"use client";
import React from "react";
import { cn } from "@/lib/utils";
type HeroHeaderProps = {
  gradient: string;
  lineColor: string;
  lineHeight?: string;
  number?: string;
  title: string;
  subtitle: string;
  description: string;
};

const HeroHeader: React.FC<HeroHeaderProps> = ({
  gradient,
  lineColor,
  lineHeight,
  number,
  title,
  subtitle,
  description,
}) => {
  return (
    <section className="flex flex-col items-center container gap-3">
      <div className="flex items-center flex-col">
        <div
          className={cn(
            "h-[150px] w-[1px] bg-gradient-to-t",
            lineColor,
            lineHeight
          )}
        />
        {/* <div
          className={`p-2 h-10 w-10 text-xl flex justify-center items-center text-background rounded-full aspect-square ${gradient}`}
        >
          {number}
        </div> */}
      </div>
      <h1
        className={`bg-clip-text md:max-w-[60%] text-transparent font-bold text-5xl ${gradient}`}
      >
        {title}
      </h1>
      <h2 className="font-heading text-3xl md:max-w-[50%] leading-[1.1] sm:text-3xl md:text-6xl font-bold text-center">
        {subtitle}
      </h2>
      <p className="md:max-w-[65%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 text-center">
        {description}
      </p>
    </section>
  );
};

export default HeroHeader;

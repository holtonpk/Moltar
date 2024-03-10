"use client";
import * as React from "react";
import {LinkButton} from "@/components/ui/link";
import {Icons} from "@/components/icons";
import {useParams, useSelectedLayoutSegment} from "next/navigation";

export const Navigation = ({collapsed}: {collapsed: boolean}) => {
  type Tabs = "chat" | "upload" | "settings";

  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex flex-col w-full gap-3 ">
      <LinkButton
        href="/upload"
        className={`hover:bg-white/15 relative text-lg  items-center font-bold text-white  px-4 leading-[24px]
          ${segment === "chat" ? "bg-white/15" : "bg-transparent"}
  
          ${
            collapsed
              ? "px-0  "
              : "gap-2 grid-cols-[24px_1fr] grid justify-start"
          }
          `}
      >
        <Icons.chat className="h-6 w-6 aspect-square text-theme-blue" />
        {!collapsed && <span className="fade-in"> Chat </span>}
      </LinkButton>
      <LinkButton
        href="/settings"
        className={`hover:bg-white/15 relative text-lg  items-center font-bold text-white  px-4 leading-[24px]
  
          ${segment === "settings" ? "bg-white/15" : "bg-transparent"}
          ${
            collapsed
              ? "px-0  "
              : "gap-2 grid-cols-[24px_1fr] grid justify-start"
          }
          `}
      >
        <Icons.settings className="h-6 w-6 text-theme-green" />
        {!collapsed && <span className="fade-in"> Settings </span>}
      </LinkButton>
    </div>
  );
};

"use client";
import * as React from "react";
import {LinkButton} from "@/components/ui/link";
import {Icons} from "@/components/icons";
import {useParams, useSelectedLayoutSegment} from "next/navigation";
import {useNavbar} from "@/context/navbar-context";
export const Navigation = () => {
  type Tabs = "chat" | "upload" | "settings";
  const {collapsed} = useNavbar()!;

  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex flex-col w-full gap-3 ">
      <LinkButton
        href="/upload"
        className={`hover:bg-primary/10 relative text-lg  items-center font-bold text-primary  px-4 leading-[24px]
          ${segment === "upload" ? "bg-primary/5" : "bg-transparent"}
  
          ${
            collapsed
              ? "px-0  "
              : "gap-2 grid-cols-[24px_1fr] grid justify-start"
          }
          `}
      >
        <Icons.upload className="h-6 w-6 aspect-square text-theme-blue" />
        {!collapsed && (
          <span className="fade-in poppins-regular "> Upload </span>
        )}
      </LinkButton>
      <LinkButton
        href="/settings"
        className={`hover:bg-primary/10 relative text-lg  items-center font-bold text-primary  px-4 leading-[24px]
  
          ${segment === "settings" ? "bg-primary/5" : "bg-transparent"}
          ${
            collapsed
              ? "px-0  "
              : "gap-2 grid-cols-[24px_1fr] grid justify-start"
          }
          `}
      >
        <Icons.settings className="h-6 w-6 text-theme-green" />
        {!collapsed && (
          <span className="fade-in poppins-regular"> Settings </span>
        )}
      </LinkButton>
    </div>
  );
};

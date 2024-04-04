"use client";
import * as React from "react";
import {Icons} from "@/components/icons";
import {Navigation} from "@/src/app/(tool)/components/navbar/navigation";
import {UploadList} from "@/src/app/(tool)/components/navbar/upload-list";
import {UserInfo} from "@/src/app/(tool)/components/navbar/user-info";
import {ModeToggle} from "@/src/app/(tool)/components/navbar/mode-toggle";
import {useNavbar} from "@/context/navbar-context";
import NavBackground from "@/components/nav-background";

export const Navbar = () => {
  const {collapsed, setCollapsed} = useNavbar()!;

  return (
    <div
      className={`h-full  flex-col  p-4 relative md:flex hidden   z-[50] transition-all duration-300 ease-in-out 
    ${collapsed ? "w-[50px] min-w-[70px]" : "w-[225px] min-w-[225px]"} 
    `}
    >
      <div className="grid grid-cols-[32px_1fr]  gap-2 mb-6 ">
        <Icons.logo className="h-8 w-8" />
        {!collapsed && (
          <span className="font-bold text-primary text-3xl  leading-[32px] fade-in  ">
            moltar.ai
          </span>
        )}
      </div>
      <Navigation />
      <div className="w-full h-[1px] bg-border my-2"></div>
      <UploadList />

      <div className="h-[100px] mt-auto relative flex flex-col justify-between ">
        <UserInfo />
        <div className="flex flex-row justify-between mt-auto">
          {!collapsed && <ModeToggle />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`z-20 group ${
              collapsed ? "mx-auto rotate-180 " : "ml-auto fade-in"
            }`}
          >
            <Icons.chevronLeft className="h-6 w-6 opacity-30 group-hover:opacity-100 text-primary" />
          </button>
        </div>
      </div>
      <NavBackground />
    </div>
  );
};

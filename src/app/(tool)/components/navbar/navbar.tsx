"use client";
import * as React from "react";
import {Icons} from "@/components/icons";
import {Navigation} from "@/src/app/(tool)/components/navbar/navigation";
import {UploadList} from "@/src/app/(tool)/components/navbar/upload-list";
import {UserInfo} from "@/src/app/(tool)/components/navbar/user-info";
import {ModeToggle} from "@/src/app/(tool)/components/navbar/mode-toggle";
export const Navbar = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div
      style={{width: collapsed ? "50px" : "30%"}}
      className={`max-w-[250px] h-full flex flex-col pr-4  relative z-40 transition-all duration-300 ease-in-out 
    
    `}
    >
      <div className="grid grid-cols-[32px_1fr]  gap-2 mb-6 ">
        <Icons.logo className="h-8 w-8" />
        {!collapsed && (
          <span className="font-bold text-white text-3xl  leading-[32px] fade-in  ">
            moltar.ai
          </span>
        )}
      </div>
      <Navigation collapsed={collapsed} />
      <div className="w-full h-[1px] bg-white/20 my-2"></div>
      <UploadList collapsed={collapsed} />

      <div className="h-[100px] mt-auto relative flex flex-col justify-between">
        <UserInfo collapsed={collapsed} />
        <div className="flex flex-row justify-between">
          {!collapsed && <ModeToggle />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`z-20 group ${
              collapsed ? "mx-auto rotate-180" : "ml-auto"
            }`}
          >
            <Icons.chevronLeft
              className="h-6 w-6 opacity-30 group-hover:opacity-100 text-white
        "
            />
          </button>
        </div>
      </div>
    </div>
  );
};

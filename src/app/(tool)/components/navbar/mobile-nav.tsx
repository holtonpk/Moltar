"use client";
import React from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {MobileUploadList} from "./upload-list";
import {UserInfo} from "./user-info";
const MobileNav = () => {
  const [openMenu, setOpenMenu] = React.useState(false);

  const Instuction = "Select an upload to start a chat";

  return (
    <div className="md:hidden w-full h-fit px-4 py-2  bg-card dark:bg-[#3A3D3E] flex justify-between items-center">
      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetTrigger asChild>
          <Button
            // onClick={() => setOpenMenu(!openMenu)}
            className="h-fit aspect-square z-30 p-0 bg-transparent text-primary"
          >
            <Icons.menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[70vw] flex flex-col" side="left">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-6 mx-auto ">
              <Icons.logoSolid className="h-8 w-8" />
              <span className="font-bold text-primary text-3xl  leading-[32px] fade-in  ">
                moltar.ai
              </span>
            </div>
          </SheetHeader>
          <MobileUploadList />
          <SheetFooter className="mt-auto">
            <UserInfo />
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <span className="text-xl font-bold ">{Instuction}</span>

      <Button className="aspect-square h-fit bg-transparent text-primary">
        <Icons.upload className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default MobileNav;

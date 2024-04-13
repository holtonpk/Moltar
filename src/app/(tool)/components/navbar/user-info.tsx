"use client";

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {LinkButton} from "@/components/ui/link";
import {useAuth} from "@/context/user-auth";
import Image from "next/image";
import {useNavbar} from "@/context/navbar-context";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export const UserInfo = () => {
  const {collapsed} = useNavbar()!;
  const {currentUser} = useAuth()!;

  return (
    console.log("fetching project", currentUser),
    (
      <>
        {currentUser && currentUser?.uid ? (
          <div className="flex flex-col gap-4 items-center border-y border-border  relative  py-4 px-2 ">
            {!collapsed ? (
              <LinkButton
                href={"/settings"}
                className="grid grid-cols-[36px_1fr] gap-2 w-full items-center  group p-0 bg-background  hover:bg-background fade-in"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={currentUser?.photoURL}
                    alt={currentUser.displayName || "User"}
                  />
                  <AvatarFallback>
                    {currentUser?.displayName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col  cursor-pointer">
                  <p className="text-[12px] font-bold text-primary group-hover:opacity-70 ">
                    {currentUser?.displayName || "User"}
                  </p>
                  <p className="text-primary/60 text-[12px] group-hover:opacity-70">
                    {currentUser?.email || ""}
                  </p>
                </div>
              </LinkButton>
            ) : (
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={currentUser?.photoURL}
                  alt={currentUser.displayName || "User"}
                />
                <AvatarFallback>
                  {currentUser?.displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ) : (
          <>
            {!collapsed && (
              <div className="flex flex-col gap-4 items-center border-b border-border  relative mt-auto" />
            )}
          </>
        )}
      </>
    )
  );
};

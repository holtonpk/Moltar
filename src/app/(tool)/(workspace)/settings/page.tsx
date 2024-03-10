"use client";
import React, {useState} from "react";
import Profile from "@/src/app/(tool)/(workspace)/settings/profile-settings";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";

import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";
// import { manageSubscription } from "@/stripe/createCheckoutSession";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {logOut} = useAuth()!;

  // const ManageSub = async () => {
  //   if (!currentUser) return;
  //   setIsLoading(true);
  //   const manageLink = await manageSubscription(
  //     currentUser.stripeId,
  //     "settings"
  //   );
  //   router.push(manageLink);
  //   setIsLoading(false);
  // };

  return (
    <>
      <div className="w-full h-full overflow-scroll pb-10">
        <div className="w-full container pt-8 gap-8 flex flex-col min-h-screen items-center  ">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-4xl font-bold ">Settings</h1>
            <Button onClick={logOut}>Log out</Button>
          </div>
          <Profile />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;

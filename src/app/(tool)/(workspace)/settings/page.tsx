"use client";
import React, {useState} from "react";
import Profile from "@/src/app/(tool)/(workspace)/settings/profile-settings";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";

import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
// import { manageSubscription } from "@/stripe/createCheckoutSession";

const SettingsPage = () => {
  const router = useRouter();

  const {logOut} = useAuth()!;

  const [openLogout, setOpenLogout] = useState(false);

  const handleLogout = async () => {
    await logOut();
    setOpenLogout(false);
    router.push("/upload");
  };

  return (
    <>
      <div className="w-full h-full overflow-scroll pb-10">
        <div className="w-full container pt-8 gap-8 flex flex-col min-h-screen items-center  ">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-4xl font-bold ">Settings</h1>
            <AlertDialog open={openLogout} onOpenChange={setOpenLogout}>
              <AlertDialogTrigger>
                <Button>Log out</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout of your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout of your account?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <Button variant="secondary">Cancel</Button>
                  <Button variant={"destructive"} onClick={handleLogout}>
                    Logout
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <Profile />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;

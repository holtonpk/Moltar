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
import {
  Dialog,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

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
            <Dialog open={openLogout} onOpenChange={setOpenLogout}>
              <DialogTrigger asChild>
                <Button>Log out</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Logout of your account?</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to logout of your account?
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      className="mt-2 md:mt-0"
                      type="button"
                      variant="secondary"
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button variant={"destructive"} onClick={handleLogout}>
                    Logout
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Profile />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;

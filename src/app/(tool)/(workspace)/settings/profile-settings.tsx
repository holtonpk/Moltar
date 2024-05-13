"use client";
import React, {useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useAuth} from "@/context/user-auth";
import {Icons} from "@/components/icons";
import {toast} from "@/components/ui/use-toast";
import {PasswordInput} from "@/components/ui/password-input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {useDeleteAccountModal} from "@/src/app/(tool)/(workspace)/settings/delete-account-modal";

import Image from "next/image";
const Profile = () => {
  const {currentUser} = useAuth()!;

  const googleProvider =
    currentUser?.providerData[0]?.providerId === "google.com";

  return (
    <div className="h-full w-full relative flex flex-col  gap-8 ">
      <AvatarChange />
      <Name />
      {!googleProvider && (
        <>
          <Email />
          <ChangePassword />
        </>
      )}
      <DeleteAccount />
    </div>
  );
};

export default Profile;

const Email = () => {
  const {currentUser, changeUserEmail} = useAuth()!;
  const [isLoading, setIsLoading] = useState(false);

  const [emailValue, setEmailValue] = useState<string>(
    currentUser?.email || ""
  );

  const handleSave = async () => {
    setIsLoading(true);
    if (emailValue !== currentUser?.email) {
      await changeUserEmail(emailValue);
      toast({
        title: "Check your email",
        description:
          "We sent you a verify link. Be sure to check your spam too.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full border border-border rounded-md p-4 gap-2 relative pb-[72px]">
      <label className="text-xl font-bold text-primary  ">Email</label>
      <p className="text-sm text-muted-foreground mb-3  ">
        This is the email you use to login
      </p>
      <Input
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        type={"email"}
        className="bg-transparent border border-border w-[300px]"
      />
      <div className="w-full absolute bottom-0 left-0 h-14  border-t border-t-border bg-primary/5 flex px-6 justify-between items-center ">
        <p className="text-muted-foreground text-sm">
          We will email you to verify the change.
        </p>
        <Button onClick={handleSave} size="sm" className="py-1">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
};

const Name = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {currentUser, changeUserDisplayName} = useAuth()!;

  const handleSave = async () => {
    setIsLoading(true);
    if (
      nameRef.current?.value !== currentUser?.displayName &&
      nameRef.current?.value !== undefined
    ) {
      await changeUserDisplayName(nameRef.current?.value);
      toast({
        title: "Success",
        description: "Your name has been updated",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col w-full border border-border rounded-md p-4  gap-2 relative pb-[72px]">
      <label className="text-xl font-bold text-primary  ">Name</label>
      <p className="text-sm text-muted-foreground mb-3  ">
        Please enter your full name, or a display name you are comfortable with.
      </p>
      <Input
        ref={nameRef}
        defaultValue={currentUser?.displayName || ""}
        type="text"
        className="bg-transparent border border-border w-[300px]"
      />
      <div className="w-full absolute bottom-0 left-0 h-14 border-t-border bg-primary/5 border-t flex px-6 justify-between items-center ">
        <p className="text-muted-foreground text-sm">
          Please use 32 characters at maximum.
        </p>
        <Button onClick={handleSave} size="sm" className="py-1">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
};

const AvatarChange = () => {
  const {currentUser, uploadProfilePicture, changeProfilePicture} = useAuth()!;

  const [profilePic, setProfilePic] = useState<string>(
    currentUser?.photoURL || ""
  );

  const fileInput = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const handleFileChange = async (event: any) => {
    const imageURl = await uploadProfilePicture(event.target.files[0]);
    await changeProfilePicture(imageURl);
    setProfilePic(imageURl);
    toast({
      title: "Avatar Updated",
      description: "refresh the page to see the changes",
    });
  };

  return (
    <div className="grid grid-cols-[1fr_96px] border-border justify-between w-full border rounded-md p-4 gap-2 relative pb-[72px]">
      <div className="grid">
        <label className="text-xl font-bold text-primary  ">Avatar</label>
        <p className="text-sm text-muted-foreground mb-3  ">
          This is your avatar. <br /> Click on the avatar to upload a custom one
          from your files.
        </p>
      </div>
      <div>
        <input
          type="file"
          ref={fileInput}
          style={{display: "none"}}
          onChange={handleFileChange}
        />
        <Button
          onClick={handleButtonClick}
          className="h-24 w-24 border  rounded-full bg-muted hover:opacity-70 relative overflow-hidden"
        >
          <Avatar className="h-24 w-24">
            <AvatarImage src={profilePic} alt={"profile picture"} />
            <AvatarFallback>
              {currentUser &&
                currentUser?.firstName?.charAt(0).toUpperCase() +
                  currentUser?.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
      <div className="w-full absolute bottom-0 left-0 h-14 border-t-border bg-primary/5 border-t flex px-6 justify-between items-center ">
        <p className="text-muted-foreground text-sm">
          An avatar is optional but strongly recommended.
        </p>
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const newPass = useRef<HTMLInputElement>(null);
  const newPassConfirm = useRef<HTMLInputElement>(null);
  const currentPass = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {changeUserPassword, resetPassword, currentUser} = useAuth()!;
  const handleUpdatePassword = async () => {
    setIsLoading(true);
    if (
      newPass.current?.value !== newPassConfirm.current?.value ||
      newPass.current?.value === undefined ||
      newPassConfirm.current?.value === undefined
    ) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      setIsLoading(false);

      return;
    }
    if (currentPass.current?.value === undefined) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive",
      });
      setIsLoading(false);

      return;
    }
    const res = await changeUserPassword(
      currentPass.current?.value,
      newPass.current?.value
    );
    setIsLoading(false);

    if (res?.error) {
      console.log(res);
      toast({
        title: "Error",
        description: "there was an problem updating your password",
        variant: "destructive",
      });
    } else {
      newPass.current.value = "";
      newPassConfirm.current.value = "";
      currentPass.current.value = "";
      toast({
        title: "Success",
        description: "Your password has been updated",
      });
    }
  };

  const handleResetPassword = async () => {
    const res = await resetPassword();
    if (res?.error) {
      toast({
        title: "Error",
        description: "there was an problem resetting your password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description:
          "We sent you a reset link. Be sure to check your spam too.",
      });
    }
  };

  console.log("cu", currentUser);

  return (
    <div className="flex flex-col w-full border border-border rounded-md p-4 relative pb-[72px]">
      <label className="text-xl font-bold text-primary  ">Password</label>
      <p className="text-sm text-muted-foreground mb-3  ">
        Reset or change your password.
      </p>
      <div className="flex flex-col gap-2  rounded-md relative">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 w-full gap-4 justify-between">
            <PasswordInput
              ref={newPass}
              id="newPassword"
              placeholder="New password"
              className="border border-border"
            />
            <PasswordInput
              ref={newPassConfirm}
              id="newPasswordConfirm"
              placeholder="Confirm new password"
              className="border border-border"
            />
          </div>
          <PasswordInput
            ref={currentPass}
            id="currentPassword"
            placeholder="Current password"
            className="border border-border"
          />
          <div className="w-fit mx-auto items-center text-center flex  text-muted-foreground/80">
            Can&apos;t remember your password?
            <Button
              variant="link"
              onClick={handleResetPassword}
              className="text-base font-bold text-c1 hover:opacity-80 underline px-1"
            >
              Reset your password
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full absolute bottom-0 left-0 h-14 bg-muted/40 border-t border-t-border bg-primary/5 flex px-6 justify-between items-center ">
        <p className="text-muted-foreground text-sm">
          We will email you to verify the change.
        </p>
        <Button onClick={handleUpdatePassword} className="py-1" size="sm">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </div>
  );
};

const DeleteAccount = () => {
  const {setShowDeleteAccountModal, DeleteAccountModal} =
    useDeleteAccountModal();

  return (
    <div className="rounded-lg border border-destructive bg-theme-red/20">
      <DeleteAccountModal />
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <label className="text-xl font-bold text-primary  ">
          Delete Account
        </label>
        <p className="text-sm text-muted-foreground mb-3  ">
          Permanently delete your Moltar account and all of your account data -
          please proceed with caution.
        </p>
      </div>

      <div className="flex items-center justify-end p-3 sm:px-10  bg-primary/5 ">
        <div className="w-32">
          <Button
            onClick={() => setShowDeleteAccountModal(true)}
            variant="ghost"
            className="w-fit whitespace-nowrap bg-theme-red focus:theme-red text-background hover:bg-theme-red  text-white"
          >
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
};

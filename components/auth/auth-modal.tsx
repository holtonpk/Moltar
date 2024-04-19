"use client";
import {Button} from "../ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Login from "@/components/auth/login";
import RegisterForm from "@/components/auth/register";
import {useAuth} from "@/context/user-auth";
import {Icons} from "../icons";

const AuthModal = () => {
  const {
    showLoginModal,
    setShowLoginModal,
    newUser,
    showEmailVerificationModal,
    setShowEmailVerificationModal,
  } = useAuth()!;

  return (
    <>
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="bg-transparent p-none justify-center flex h-fit border-none p-0 w-screen max-w-screen   md:w-[60vw] md:max-w-md">
          {newUser ? <RegisterForm /> : <Login />}
        </DialogContent>
      </Dialog>

      <EmailVerificationModal />
    </>
  );
};

export default AuthModal;

const EmailVerificationModal = () => {
  const {showEmailVerificationModal, setShowEmailVerificationModal, email} =
    useAuth()!;

  const [isResending, setIsResending] = React.useState(false);

  // const onResend = async () => {
  //   setIsResending(true);
  //   reSendEmailVerification();
  //   setTimeout(() => {
  //     setIsResending(false);
  //   }, 3000);
  // };

  return (
    <Dialog
      open={showEmailVerificationModal}
      onOpenChange={setShowEmailVerificationModal}
    >
      <DialogContent className="flex flex-col items-center gap-2">
        <div className="bg-theme-blue/20 p-2 aspect-square rounded-md h-fit w-fit">
          <Icons.mail className="w-12 h-12 text-theme-blue" />
        </div>
        <h1 className="text-2xl poppins-bold mt-3">Please verify your email</h1>
        <p className="text-base poppins-regular text-center text-muted-foreground">
          A verification email has been sent to {email}. Please verify your
          email to continue.
        </p>
        {/* <Button onClick={onResend} className="mt-3">
          {isResending ? "Resending..." : "Resend email"}
        </Button> */}
      </DialogContent>
    </Dialog>
  );
};

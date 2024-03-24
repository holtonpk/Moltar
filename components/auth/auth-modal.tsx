"use client";

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

const AuthModal = () => {
  const {showLoginModal, setShowLoginModal, newUser} = useAuth()!;

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="bg-transparent p-none  h-fit border-none p-0  md:w-[60vw] md:max-w-md">
        {newUser ? <RegisterForm /> : <Login />}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

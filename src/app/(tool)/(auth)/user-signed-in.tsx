"use client";
import React, {ReactElement, ReactNode} from "react";
import {useAuth} from "@/context/user-auth";
import {useRouter} from "next/navigation";

const UserSignedIn = ({children}: {children: ReactElement}) => {
  const {currentUser} = useAuth()!;
  const router = useRouter();

  if (currentUser) {
    router.push("/dashboard");
  }

  return children;
};

export default UserSignedIn;

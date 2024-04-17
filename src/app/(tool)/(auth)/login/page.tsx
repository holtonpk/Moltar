import React from "react";
import Link from "next/link";
import Background from "@/components/background";
import LoginForm from "./login-form";
import {Toaster} from "@/components/ui/toaster";
import {Icons} from "@/components/icons";
import {LinkButton} from "@/components/ui/link";
// import { siteConfig } from "@/config/site";
// import { constructMetadata } from "@/lib/utils";
import {Metadata} from "next";

// export const metadata: Metadata = constructMetadata({
//   title: `Login - ${siteConfig.name}`,
// });

const Login = () => {
  return (
    <div className="container flex h-screen w-screen  flex-col items-center ">
      <Toaster />

      <LinkButton
        href="/register"
        // variant="ghost"]
        variant="outline"
        className="bg-transparent absolute top-4 right-4 border-theme-blue text-theme-blue hover:text-theme-blue"
      >
        Sign up
      </LinkButton>

      <div className="z-10 mt-[calc(15vh)] h-fit w-full  max-w-md overflow-hidden border border-border rounded-2xl sm:shadow-xl">
        <div className="flex flex-col space-y-2 text-center bg-card px-4 py-6 pt-8">
          {/* <Icons.logo className="mx-auto h-6 w-6" /> */}

          <h1 className="text-4xl font-semibold text-theme-blue">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Please enter your details
          </p>
        </div>
        <div className="grid gap-6 bg-card/10 blurBack px-4 py-8 sm:px-16">
          <LoginForm />

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              Sign up
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

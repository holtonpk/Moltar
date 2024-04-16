"use client";

import React from "react";
import {LinkButton} from "@/components/ui/link";
import Link from "next/link";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {useAuth} from "@/context/user-auth";
import {Icons} from "@/components/icons";
import {useRouter, useSearchParams} from "next/navigation";

const EmailVerification = () => {
  const [code, setCode] = React.useState<string>("");

  const isValid = code.length === 6;
  const {VerifyEmail, resendVerificationEmail} = useAuth()!;

  const [incorrectError, setIncorrectError] = React.useState<boolean>(false);

  const {currentUser} = useAuth()!;

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const uId = searchParams.get("uid");

  const onSubmit = async () => {
    setIsLoading(true);
    setIncorrectError(false);
    const res = await VerifyEmail(code, uId as string);
    console.log("res", res);
    if (res == "error") {
      setIncorrectError(true);
      setIsLoading(false);
      return;
    } else {
      router.push("/upload");
    }
  };

  const [resent, setResent] = React.useState<boolean>(false);

  async function onResendVerificationEmail() {
    setResent(true);
    await resendVerificationEmail();
    setTimeout(() => {
      setResent(false);
    }, 10000);
  }

  return (
    <div className="container flex h-screen w-screen  flex-col items-center">
      <div className=" mt-20 md:mt-[calc(15vh)] h-fit w-full max-w-md overflow-hidden border border-border sm:rounded-2xl sm:shadow-xl z-20 blurBack">
        <div className="flex flex-col space-y-2 text-center bg-card px-4 py-6 pt-8">
          <h1 className="text-2xl md:text-4xl font-semibold bg-gradient-to-r to-theme-green via-theme-blue from-theme-purple bg-clip-text text-transparent">
            Secure your account
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6 digit code to your email address. Please enter the code
            from the email.
          </p>
        </div>
        <div className="w-full flex justify-center items-center py-4 flex-col text-3xl px-4">
          {incorrectError && (
            <span className="text-theme-red mb-3 w-fit text-sm">
              *Incorrect code
            </span>
          )}
          <InputOTP
            maxLength={6}
            className="w-full"
            value={code}
            onChange={setCode}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button
            onClick={onSubmit}
            disabled={!isValid}
            className="w-full bg-theme-blue hover:bg-theme-blue/80 text-white mt-4"
          >
            {isLoading && <Icons.spinner className="animate-spin mr-2" />}
            Verify Code
          </Button>
          <span className="px-4 text-center gap-1 h-fit mt-2 flex items-center text-[12px] md:text-sm text-muted-foreground whitespace-nowrap">
            Cant find the email?{" "}
            <Button
              disabled={resent}
              onClick={onResendVerificationEmail}
              variant={"link"}
              className="font-semibold p-0 text-muted-foreground transition-colors hover:text-primary underline"
            >
              {resent ? (
                <>
                  Email Sent
                  <Icons.check className="h-4 w-4 mr-1" />
                </>
              ) : (
                "Resend Email"
              )}
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

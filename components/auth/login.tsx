"use client";
import React from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {userAuthSchema} from "@/lib/validations/auth";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {toast} from "@/components/ui/use-toast";
import {Input} from "@/components/ui/input";
import * as z from "zod";
import {useAuth} from "@/context/user-auth";
import {PasswordInput} from "@/components/ui/password-input";
import {Icons} from "@/components/icons";
import {useRouter} from "next/navigation";
import Link from "next/link";

const Login = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {signIn, logInWithGoogle, setNewUser, setShowLoginModal} = useAuth()!;

  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);

  type FormData = z.infer<typeof userAuthSchema>;
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const signInResult = await signIn(data.email, data.password);

    setIsLoading(false);
    if (signInResult?.success) {
      setShowLoginModal(false);
      return;
    }
    if (signInResult?.error === "auth/user-not-found") {
      setError("email", {
        type: "manual",
        message: "An account with this email does not exist.",
      });
      toast({
        title: "An account with this email does not exist.",
        description: "Please please check your email and try again.",
        variant: "destructive",
      });
    } else if (signInResult?.error === "auth/wrong-password") {
      setError("password", {
        type: "manual",
        message: "Incorrect password.",
      });
      toast({
        title: "Incorrect password.",
        description: "Please please check your password and try again.",
        variant: "destructive",
      });
    } else if (signInResult?.error === "auth/too-many-requests") {
      toast({
        title: "Too many requests.",
        description: "Please try again later.",
        variant: "destructive",
      });
    } else if (signInResult?.error === "auth/invalid-credential") {
      setError("password", {
        type: "manual",
        message: "Wrong email or password.",
      });
    } else if (signInResult?.error === "auth/user-disabled") {
      toast({
        title: "User disabled.",
        description: "Please contact support.",
        variant: "destructive",
      });
    }
  }

  function handleLoginError(error: any): void {
    toast({
      title: "Something went wrong.",
      description: `Please try again later. Error: ${error.message || error}`,
      variant: "destructive",
    });
  }

  async function googleSingIn(): Promise<void> {
    try {
      setIsGoogleLoading(true);
      const createAccountResult = await logInWithGoogle();

      if (createAccountResult.error) {
        handleLoginError(createAccountResult.error);
      }
    } catch (error: any) {
      handleLoginError(error);
    } finally {
      setIsGoogleLoading(false);
      setShowLoginModal(false);
    }
  }

  return (
    <div className=" z-10  h-fit w-full  overflow-hidden border border-border sm:rounded-2xl shadow-xl">
      <div className="flex flex-col space-y-2 text-center bg-card px-4 py-6 pt-8">
        <h1 className="text-4xl font-semibold text-theme-blue">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Please enter your details
        </p>
      </div>
      <div className="grid gap-6 bg-card/60 blurBack px-4 py-8 sm:px-16">
        <div className="grid gap-6 ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Input
                className="bg-card focus-visible:ring-theme-blue dark:border dark:border-border"
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isGoogleLoading}
                {...register("email")}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
              <PasswordInput
                className="bg-card dark:border dark:border-border"
                id="password"
                placeholder="password"
                type="password"
                autoCapitalize="none"
                disabled={isLoading || isGoogleLoading}
                {...register("password")}
              />
              {errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
              <Button
                className="w-full bg-theme-blue hover:bg-theme-blue/80 text-white"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In
              </Button>
            </div>
          </form>
          <div className="relative flex items-center">
            <span className="w-full border-t border-muted-foreground" />
            <div className="relative text-xs uppercase whitespace-nowrap px-2 text-muted-foreground">
              Or
            </div>
            <span className="w-full border-t border-muted-foreground" />
          </div>

          <Button
            onClick={googleSingIn}
            type="button"
            className="w-full"
            variant="outline"
          >
            {isGoogleLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className=" h-6 w-6 mr-2" />
            )}
            Sign in with Google
          </Button>
        </div>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => setNewUser(true)}
            className="font-semibold text-muted-foreground transition-colors hover:text-primary underline"
          >
            Sign up
          </button>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;

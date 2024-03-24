import Background from "@/components/background";
import Link from "next/link";
import RegisterForm from "./register-form";
import {LinkButton} from "@/components/ui/link";

const Register = () => {
  return (
    <div className="container flex h-screen w-screen  flex-col items-center">
      <LinkButton
        href="/login"
        // variant="ghost"]
        variant="outline"
        className=" absolute top-4 right-4 border-theme-blue text-theme-blue hover:text-theme-blue bg-transparent "
      >
        Log in
      </LinkButton>
      <div className=" mt-20 md:mt-[calc(15vh)] h-fit w-full max-w-md overflow-hidden border border-border sm:rounded-2xl sm:shadow-xl z-20 blurBack">
        <div className="flex flex-col space-y-2 text-center bg-card px-4 py-6 pt-8">
          <h1 className="text-2xl md:text-4xl font-semibold bg-gradient-to-r to-theme-green via-theme-blue from-theme-purple bg-clip-text text-transparent">
            Let&apos;s Get Started!
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>

        <div className="grid gap-4 bg-card/10 px- py-4 px-4 ">
          <RegisterForm />

          <p className="px-4 text-center flex items-center flex-col text-[12px] md:text-sm text-muted-foreground whitespace-nowrap">
            By clicking continue, you agree to our
            <div className="flex items-center gap-1">
              <Link
                href="/terms"
                className="font-semibold text-muted-foreground transition-colors hover:text-primary underline"
              >
                Terms of Service
              </Link>
              &
              <Link
                href="/privacy"
                className="font-semibold text-muted-foreground transition-colors hover:text-primary underline"
              >
                Privacy Policy
              </Link>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

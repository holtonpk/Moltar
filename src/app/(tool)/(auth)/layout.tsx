// import { AuthProvider } from "@/context/user-auth";
// import { siteConfig } from "@/config/site";
// import {constructMetadata} from "@/lib/utils";
import {Metadata} from "next";
import Image from "next/image";
import {Icons} from "@/components/icons";
import {ThemeProvider} from "@/components/theme-provider";

// export const metadata: Metadata = constructMetadata({
//   title: `Register - ${siteConfig.name}`,
// });

interface AuthLayoutProps {
  children: React.ReactElement;
}
import Link from "next/link";
import Background from "@/components/background";

export default function AuthLayout({children}: AuthLayoutProps) {
  return (
    // <AuthProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <>
        <Link
          href="/"
          className=" items-center space-x-2 flex w-fit absolute top-4 left-4"
        >
          <span className=" text-lg md:text-2xl  text-primary font-bold  flex items-center ">
            <div className="grid grid-cols-[32px_1fr]  gap-2 ">
              <Icons.logoAdaptive className="h-8 w-8 " />

              <span className="font-bold  text-3xl  leading-[32px] fade-in  bg-gradient-to-r from-theme-purple via-theme-blue to-theme-green bg-clip-text text-transparent">
                moltar.ai
              </span>
            </div>
          </span>
        </Link>

        {children}
        <Background />
      </>
    </ThemeProvider>
    // </AuthProvider>
  );
}

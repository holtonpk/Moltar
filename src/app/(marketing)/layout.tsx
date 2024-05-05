import Nav from "@/src/app/(marketing)/components/main-nav";
import {SiteFooter} from "@/src/app/(marketing)/components/site-footer";
import Background from "@/src/app/(marketing)/components/background";
import MobileNav from "@/src/app/(marketing)/components/mobile-main-nav";
import {ThemeProvider} from "@/components/theme-provider";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex min-h-screen h-fit  flex-col">
        <Nav />
        <MobileNav />
        <main className="flex-1 z-10">{children}</main>
        {/* <SiteFooter /> */}
        <Background />
      </div>
    </ThemeProvider>
  );
}

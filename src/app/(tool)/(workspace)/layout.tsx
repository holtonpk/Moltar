import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Navbar} from "../components/navbar/navbar";
import {ProjectsProvider} from "@/context/projects-context";
import {UploadsProvider} from "@/context/upload-context";
import {Toaster} from "@/components/ui/toaster";
import AuthModal from "@/components/auth/auth-modal";
import {NavbarProvider} from "@/context/navbar-context";
import MobileNav from "../components/navbar/mobile-nav";
import FreeLimitDialog from "@/components/dialogs/free-limit";

const Workspace = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <div className="bg-background  flex h-screen overflow-hidden">
        <NavbarProvider>
          <UploadsProvider>
            <ProjectsProvider>
              <Navbar />
              <div className="md:flex-grow w-full  overflow-hidden   relative h-screen flex-col flex  ">
                <MobileNav />
                {children}
              </div>
              <AuthModal />
            </ProjectsProvider>
          </UploadsProvider>
        </NavbarProvider>
      </div>
    </ThemeProvider>
  );
};

export default Workspace;

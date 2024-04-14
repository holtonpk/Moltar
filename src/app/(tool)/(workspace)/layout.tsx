import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Navbar} from "../components/navbar/navbar";
import {ProjectsProvider} from "@/context/projects-context";
import {UploadsProvider} from "@/context/upload-context";
import {Toaster} from "@/components/ui/toaster";
import AuthModal from "@/components/auth/auth-modal";
import {NavbarProvider} from "@/context/navbar-context";
import MobileNav from "../components/navbar/mobile-nav";
import {Button} from "@/components/ui/button";

const Workspace = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <NavbarProvider>
        <UploadsProvider>
          <ProjectsProvider>
            <div className="bg-background  flex h-screen overflow-hidden">
              <Navbar />
              <div className="md:flex-grow w-full  overflow-hidden   relative h-screen flex-col flex  ">
                <MobileNav />
                {children}
              </div>
              <AuthModal />
            </div>
          </ProjectsProvider>
        </UploadsProvider>
      </NavbarProvider>
    </ThemeProvider>
  );
};

export default Workspace;

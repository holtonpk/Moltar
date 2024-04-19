import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Navbar} from "../components/navbar/navbar";
import {ProjectsProvider} from "@/context/projects-context";
import {UploadsProvider} from "@/context/upload-context";
import {Toaster} from "@/components/ui/toaster";
import AuthModal from "@/components/auth/auth-modal";
import {NavbarProvider} from "@/context/navbar-context";
import {Button} from "@/components/ui/button";
import MobileBackground from "@/components/mobile-background";
import {useNavbar} from "@/context/navbar-context";

const Workspace = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <NavbarProvider>
        <UploadsProvider>
          <ProjectsProvider>
            <div className="bg-background  flex h-fit md:h-screen md:overflow-hidden">
              <Navbar />
              <div className="md:flex-grow w-full  h-fit md:overflow-hidden   relative md:h-screen flex-col flex  ">
                <div className="md:hidden block ">
                  <MobileBackground />
                </div>
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

import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Navbar} from "../components/navbar/navbar";
import {ProjectsProvider} from "@/context/projects-context";
import {UploadsProvider} from "@/context/upload-context";
import {Toaster} from "@/components/ui/toaster";
import AuthModal from "@/components/auth/auth-modal";
import {NavbarProvider} from "@/context/navbar-context";

const Workspace = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <div className="bg-background  flex h-screen overflow-hidden">
        <NavbarProvider>
          <UploadsProvider>
            <ProjectsProvider>
              <Navbar />
              <div className="flex-grow bg-card overflow-hidden   border border-border ">
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

import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {Navbar} from "../components/navbar/navbar";
import {ProjectsProvider} from "@/context/projects-context";
import {UploadsProvider} from "@/context/upload-context";
import {Toaster} from "@/components/ui/toaster";
import AuthModal from "@/components/auth/auth-modal";

const Workspace = ({children}: {children: React.ReactNode}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <div className="bg-background p-4 flex h-screen overflow-hidden">
        <UploadsProvider>
          <ProjectsProvider>
            <Navbar />
            <div className="flex-grow bg-card overflow-hidden rounded-xl ">
              {children}
            </div>
            <AuthModal />
          </ProjectsProvider>
        </UploadsProvider>
      </div>
    </ThemeProvider>
  );
};

export default Workspace;

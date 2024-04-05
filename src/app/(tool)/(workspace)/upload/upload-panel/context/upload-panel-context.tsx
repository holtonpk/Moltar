import React from "react";
import {
  UploadType,
  ProjectType,
  UrlScrapeUpload,
  PDFUpload,
  YoutubeScrapeUpload,
} from "@/types";

type UploadPanelContextType = {
  selectedFile: UrlScrapeUpload | PDFUpload | YoutubeScrapeUpload | null;
  setSelectedFile: React.Dispatch<
    React.SetStateAction<
      UrlScrapeUpload | PDFUpload | YoutubeScrapeUpload | null
    >
  >;
  goToNewProject: (file: UploadType) => void;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRename: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UploadPanelContext =
  React.createContext<UploadPanelContextType | null>(null);

interface UploadPanelProviderProps {
  children: React.ReactNode;
  setSelectedFile: React.Dispatch<
    React.SetStateAction<
      UrlScrapeUpload | PDFUpload | YoutubeScrapeUpload | null
    >
  >;
  selectedFile: UrlScrapeUpload | PDFUpload | YoutubeScrapeUpload | null;
  goToNewProject: (file: UploadType) => void;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRename: React.Dispatch<React.SetStateAction<boolean>>;
}

// Provider component
export const UploadPanelProvider = ({
  children,
  selectedFile,
  setSelectedFile,
  goToNewProject,
  setShowDeleteDialog,
  setOpenRename,
}: UploadPanelProviderProps) => {
  return (
    <UploadPanelContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
        goToNewProject,
        setShowDeleteDialog,
        setOpenRename,
      }}
    >
      {children}
    </UploadPanelContext.Provider>
  );
};

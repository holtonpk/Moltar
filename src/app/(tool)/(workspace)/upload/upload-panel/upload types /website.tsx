import React from "react";
import {UploadOptions} from "../components/upload-options";
import {UploadPanelContext} from "../context/upload-panel-context";
import {UrlScrapeUpload} from "@/types";

export const UrlUpload = ({file}: {file: UrlScrapeUpload}) => {
  const {goToNewProject, setSelectedFile, setShowDeleteDialog, setOpenRename} =
    React.useContext(UploadPanelContext)!;

  return (
    <>
      <button
        onClick={() => goToNewProject(file)}
        className="absolute z-20 top-0 left-0 h-full w-full group"
      />
      <div className="grid grid-cols-[24px_1fr] gap-1 relative  group mx-auto rounded-t-lg overflow-x-hidden text-ellipsis   max-w-full  z-10 bg-theme-blue/20 whitespace-nowrap p-2 pr-6">
        <img src={file.fav} className="h-6 w-6 rounded-md" />
        <span className="w-full overflow-hidden text-ellipsis">{file.url}</span>
      </div>
      <div className="pr-6 z-20   border-t-border border-t h-fit  bg-card  top-full  w-full  relative  group-hover:  transition-transform">
        <div
          onClick={() => goToNewProject(file)}
          className="p-2 text-primary  text-sm text-left  font- overflow-hidden text-ellipsis relative z-10 "
        >
          {file.title}
        </div>
        <UploadOptions file={file} />
      </div>
    </>
  );
};

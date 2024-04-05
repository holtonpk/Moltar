import React from "react";
import {UploadOptions} from "../components/upload-options";
import {UploadPanelContext} from "../context/upload-panel-context";
import {YoutubeScrapeUpload} from "@/types";

export const YoutubeUpload = ({file}: {file: YoutubeScrapeUpload}) => {
  const {goToNewProject, setSelectedFile, setShowDeleteDialog, setOpenRename} =
    React.useContext(UploadPanelContext)!;

  return (
    <>
      <button
        onClick={() => goToNewProject(file)}
        className="absolute z-20 top-0 left-0 h-full w-full group"
      />
      <div className="w-full aspect-[16/9] relative overflow-hidden">
        <img
          src={file.thumbnail}
          className="w-full rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="pr-6 z-20   border-t-border border-t h-fit  bg-card  top-full  w-full  relative  group-hover:  transition-transform">
        <div
          onClick={() => goToNewProject(file)}
          className="p-2 text-primary  text-sm text-left  font- overflow-hidden text-ellipsis relative z-10 max-h-full  "
        >
          <span className="max-w-full max-h-full overflow-hidden text-ellipsis whitespace-break-spaces">
            {file.title}
          </span>
        </div>
        <UploadOptions file={file} />
      </div>
    </>
  );
};

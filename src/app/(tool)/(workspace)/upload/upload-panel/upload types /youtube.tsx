import React, {useEffect} from "react";
import {UploadPreview} from "../components/upload-options";
import {UploadPanelContext} from "../context/upload-panel-context";
import {YoutubeScrapeUpload} from "@/types";
import {Icons} from "@/components/icons";

export const YoutubeUpload = ({
  file,
  filterList,
}: {
  file: YoutubeScrapeUpload;
  filterList: string[] | undefined;
}) => {
  const {goToNewProject, setSelectedFile, setShowDeleteDialog, setOpenRename} =
    React.useContext(UploadPanelContext)!;

  const [openOptions, setOpenOptions] = React.useState(false);

  return (
    <div
      key={file.id}
      className={` w-[250px] group  h-fit flex flex-col  overflow-hidden  relative  border-border border-4 rounded-lg bg-border
${filterList && filterList.includes(file.id) ? "visible" : "hidden"} `}
    >
      <button
        onClick={() => goToNewProject(file)}
        className="absolute z-20 top-0 left-0 h-full w-full "
      />
      <div className="w-full aspect-[16/9] top-0 relative rounded-lg overflow-hidden">
        <img
          src={file.thumbnail}
          className="w-full rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <UploadPreview file={file} />
    </div>
  );
};

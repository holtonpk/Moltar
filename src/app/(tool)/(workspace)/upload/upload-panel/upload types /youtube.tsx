import React, {useEffect} from "react";
import {UploadOptions} from "../components/upload-options";
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
      <div className="w-full aspect-[16/9] top-0 relative overflow-hidden">
        <img
          src={file.thumbnail}
          className="w-full rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div
        className={`pr-6 rounded-t-md absolute bg-card/80  bottom-0 overflow-hidden h-fit w-[100%] pl-4 left-1/2 -translate-x-1/2 transition-transform ${
          openOptions
            ? "translate-y-0"
            : "translate-y-full  group-hover:translate-y-0 "
        }
    `}
      >
        <div className="p-2 text-primary  text-sm text-left  font- overflow-hidden text-ellipsis z-10 max-h-full relative ">
          <span className="max-w-full max-h-full overflow-hidden text-ellipsis whitespace-break-spaces">
            {file.title}
          </span>
          <button
            onClick={() => goToNewProject(file)}
            className=" w-full rounded-lg mt-3  bg-gradient-to-l group from-theme-purple via-theme-green to-theme-blue p-[2px] flex items-center justify-center "
          >
            <span className="flex items-center bg-card w-full justify-center p-2 rounded-md hover:bg-card/90">
              New Chat
              <Icons.arrowRight className="h-4 w-4 ml-2 " />
            </span>
          </button>
        </div>
        <UploadOptions
          file={file}
          open={openOptions}
          setOpen={setOpenOptions}
        />
      </div>
    </div>
  );
};

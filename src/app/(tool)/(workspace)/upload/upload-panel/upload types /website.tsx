import React from "react";
import {UploadPreview} from "../components/upload-options";
import {UploadPanelContext} from "../context/upload-panel-context";
import {UrlScrapeUpload} from "@/types";
import {Icons} from "@/components/icons";

export const UrlUpload = ({
  file,
  filterList,
}: {
  file: UrlScrapeUpload;
  filterList: string[] | undefined;
}) => {
  const {goToNewProject, setSelectedFile, setShowDeleteDialog, setOpenRename} =
    React.useContext(UploadPanelContext)!;

  const [openOptions, setOpenOptions] = React.useState(false);

  return (
    <div
      key={file.id}
      className={` cursor-pointer w-[300px] h-[150px] overflow-hidden relative group border-border  border-4 rounded-lg bg-border
            ${
              filterList && filterList.includes(file.id) ? "visible" : "hidden"
            } `}
    >
      <div className="relative w-full flex flex-col h-full z-10">
        <div className="grid grid-cols-[24px_1fr] gap-2 relative  group mx-auto rounded-t-lg overflow-x-hidden text-ellipsis items-end  max-w-full  z-10 bg-theme-blue/20 whitespace-nowrap p-2 pr-6">
          <img src={file.fav} className="h-6 w-6 rounded-md " />
          <span className="w-full overflow-hidden text-ellipsis  text-sm ">
            {file.url}
          </span>
        </div>
        <div className="pr-6 z-20 poppins-regular  border-t-border border-t flex-grow   bg-background    w-full  relative  ">
          <div
            onClick={() => goToNewProject(file)}
            className="p-2 text-primary h-full text-sm text-left  font- overflow-hidden text-ellipsis relative z-10 "
          >
            {file.title}
          </div>
        </div>
      </div>
      {/* <div
        className={`px-6  flex items-center justify-center rounded-t-md absolute bg-card/80 pb-4 z-30 bottom-0 overflow-hidden h-fit w-[100%] left-1/2 -translate-x-1/2 transition-transform ${
          openOptions
            ? "translate-y-0"
            : "translate-y-full  group-hover:translate-y-0 "
        }
    `}
      >
        <button
          onClick={() => goToNewProject(file)}
          className=" w-fit  rounded-lg mt-3  bg-gradient-to-l group from-theme-purple via-theme-green to-theme-blue p-[2px] flex items-center justify-center "
        >
          <span className="px-10 flex items-center bg-card w-full justify-center p-2 rounded-md hover:bg-card/90 text-sm">
            New Chat
            <Icons.arrowRight className="h-4 w-4 ml-2 " />
          </span>
        </button>

        <UploadOptions
          file={file}
          open={openOptions}
          setOpen={setOpenOptions}
        />
      </div> */}
      <UploadPreview file={file} />
    </div>
  );
};

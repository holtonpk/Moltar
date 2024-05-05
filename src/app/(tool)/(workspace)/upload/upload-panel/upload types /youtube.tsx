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

  const [mute, setMute] = React.useState(true);

  return (
    <div className="w-[250px] h-fit relative group">
      <div
        key={file.id}
        className={` w-[250px] group  h-fit flex flex-col  overflow-hidden  relative  rounded-lg bg-border
${filterList && filterList.includes(file.id) ? "visible" : "hidden"} `}
      >
        <button
          onClick={() => goToNewProject(file)}
          className="absolute z-20 top-0 left-0 h-full w-full "
        />
        <div className="w-full aspect-[16/9] top-0 relative rounded-lg overflow-hidden group z-10">
          <img
            src={file.thumbnail}
            className="w-full rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <UploadPreview file={file} />
      </div>
      {/* <div className="hover-card upload-scale w-[250px] group-hover:block bg-card/70 blurBack border border-border rounded-lg shadow-lg">
        <div className="w-full aspect-[16/9] top-0 relative rounded-t-lg overflow-hidden group z-10">
          <iframe
            src={`https://www.youtube.com/embed/${file.id}?autoplay=1&mute=1`}
            className="w-full h-full relative z-20"
          />
        </div>
        <div className="w-full p-4">
          <div className="h-full text-sm upload-title-text poppins-regular ">
            {file.title}
          </div>
          <button
            // onClick={() => goToNewProject(file)}
            className=" w-full rounded-lg h-fit mt-2  bg-gradient-to-l group from-theme-purple via-theme-green to-theme-blue p-[2px] flex items-center justify-center "
          >
            <span className="flex whitespace-nowrap items-center bg-card w-full justify-center p-2  text-sm rounded-md hover:bg-card/90">
              New Chat
              <Icons.arrowRight className="h-4 w-4 ml-2 " />
            </span>
          </button>
        </div>
      </div> */}
    </div>
  );
};

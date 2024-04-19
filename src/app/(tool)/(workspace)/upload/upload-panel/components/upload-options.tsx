import * as React from "react";
import {UploadPanelContext} from "../context/upload-panel-context";
import {YoutubeScrapeUpload, UrlScrapeUpload, PDFUpload} from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {Icons} from "@/components/icons";

export const UploadPreview = ({
  file,
}: {
  file: PDFUpload | UrlScrapeUpload | YoutubeScrapeUpload;
}) => {
  const [openOptions, setOpenOptions] = React.useState(false);

  const {goToNewProject} = React.useContext(UploadPanelContext)!;

  return (
    <div
      className={`pr-6 p-2 hidden md:block  rounded-t-md rounded-b-none  absolute z-30 bg-card/90 max-h-[100%] bottom-0 overflow-hidden h-fit w-[95%] pl-2 left-1/2 -translate-x-1/2 transition-transform ${
        openOptions
          ? "translate-y-0"
          : "translate-y-full  group-hover:translate-y-0 "
      }
    `}
    >
      <div className=" text-primary flex flex-col gap-3  text-sm text-left  font- overflow-hidden text-ellipsis z-10 h-full relative ">
        <div className="h-full  upload-title-text poppins-regular ">
          {file.title}
        </div>
        <div className=" h-full w-full">
          <button
            onClick={() => goToNewProject(file)}
            className=" w-full rounded-lg h-fit   bg-gradient-to-l group from-theme-purple via-theme-green to-theme-blue p-[2px] flex items-center justify-center "
          >
            <span className="flex whitespace-nowrap items-center bg-card w-full justify-center p-2 rounded-md hover:bg-card/90">
              New Chat
              <Icons.arrowRight className="h-4 w-4 ml-2 " />
            </span>
          </button>
        </div>
      </div>
      <UploadOptions file={file} open={openOptions} setOpen={setOpenOptions} />
    </div>
  );
};

export const UploadOptions = ({
  file,
  open,
  setOpen,
}: {
  file: PDFUpload | UrlScrapeUpload | YoutubeScrapeUpload;
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const {setSelectedFile, setShowDeleteDialog, setOpenRename} =
    React.useContext(UploadPanelContext)!;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="z-50  flex items-center  justify-center hover:opacity-60 absolute top-1 right-0 rounded-bl-md      "
      >
        <Icons.ellipsis className="h-5 w-5" />
      </button>
      {open && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="z-50  flex items-center h-6  justify-center hover:opacity-60 absolute top-1 right-0 rounded-bl-md p-1     "></DropdownMenuTrigger>
          <DropdownMenuContent className="border-border  border">
            <DropdownMenuItem
              onSelect={() => {
                setSelectedFile(file);
                setOpenRename(true);
              }}
              className=" gap-2 cursor-pointer focus:bg-primary/20 "
            >
              <Icons.pencil className="h-4 w-4 " />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-theme-red cursor-pointer focus:bg-theme-red/20 focus:text-theme-red gap-2 "
              onClick={() => {
                setSelectedFile(file);
                setShowDeleteDialog(true);
              }}
            >
              <Icons.trash className="h-4 w-4 " />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

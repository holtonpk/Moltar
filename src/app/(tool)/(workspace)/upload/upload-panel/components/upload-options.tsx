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
import {Span} from "next/dist/trace";

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
        className="z-50  flex items-center  justify-center hover:opacity-60 absolute top-1 right-0 rounded-bl-md p-1     "
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

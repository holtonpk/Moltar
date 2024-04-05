import * as React from "react";
import {UploadPanelContext} from "../context/upload-panel-context";
import {YoutubeScrapeUpload, UrlScrapeUpload, PDFUpload} from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {Icons} from "@/components/icons";

export const UploadOptions = ({
  file,
}: {
  file: PDFUpload | UrlScrapeUpload | YoutubeScrapeUpload;
}) => {
  const {setSelectedFile, setShowDeleteDialog, setOpenRename} =
    React.useContext(UploadPanelContext)!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="z-50 flex items-center justify-center hover:opacity-60 absolute top-2 right-0 rounded-md  ">
        <Icons.ellipsis className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border bg-card">
        <DropdownMenuItem
          onSelect={() => {
            setSelectedFile(file);
            setOpenRename(true);
          }}
          className=" gap-2 cursor-pointer focus:bg-primary/20"
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
  );
};

"use client";
import React from "react";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {MobileUploadList} from "./upload-list";
import {UserInfo} from "./user-info";
import {useToast} from "@/components/ui/use-toast";
import {useUploads} from "@/context/upload-context";

const MobileNav = () => {
  const [openMenu, setOpenMenu] = React.useState(false);

  const Instuction = "Select an upload to start a chat";

  const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);

  const {toast} = useToast();

  const {uploadFile} = useUploads();

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files); // Convert FileList to an array
      setUploadQueue(files); // Set the initial queue

      for (let file of files) {
        if (file.size > 10000000) {
          toast({
            title: `${file.name} is too large`,
            description: "Please upload a file less than 10MB",
            variant: "destructive",
          });
        } else {
          await uploadFile(file); // Upload the file
        }
        // Remove the uploaded file from the queue
        setUploadQueue((currentQueue) =>
          currentQueue.filter((f) => f !== file)
        );
      }
    }
  };

  return (
    <div className="md:hidden w-full h-fit px-4 py-2  bg-card dark:bg-[#3A3D3E] flex justify-between items-center">
      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetTrigger asChild>
          <Button
            // onClick={() => setOpenMenu(!openMenu)}
            className="h-fit aspect-square z-30 p-0 bg-transparent text-primary hover:bg-transparent hover:opacity-70"
          >
            <Icons.menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[70vw] flex flex-col" side="left">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-6 mx-auto ">
              <Icons.logoSolid className="h-8 w-8" />
              <span className="font-bold text-primary text-3xl  leading-[32px] fade-in  ">
                moltar.ai
              </span>
            </div>
          </SheetHeader>
          <MobileUploadList />
          <SheetFooter className="mt-auto">
            <UserInfo />
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <span className="text-sm font-bold ">{Instuction}</span>

      <input
        multiple
        id="selectedFile"
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        style={{display: "none"}}
        className="bg-theme-blue hover:bg-theme-blue/60 text-white"
      />

      <Button
        onClick={() => document.getElementById("selectedFile")?.click()}
        className="aspect-square h-fit bg-transparent text-primary hover:bg-transparent hover:opacity-70"
      >
        <Icons.upload className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default MobileNav;
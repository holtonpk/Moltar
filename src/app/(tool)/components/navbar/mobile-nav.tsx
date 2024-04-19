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
import {useSelectedLayoutSegment} from "next/navigation";
import NavBackground from "@/components/nav-background";

const MobileNav = () => {
  const [openMenu, setOpenMenu] = React.useState(false);

  const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);

  const {toast} = useToast();

  const {uploadFile, uploadList} = useUploads()!;

  // const {project} = useChat()!;

  const segment = useSelectedLayoutSegment();

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

  type InstructionType = {
    segment: string;
    instruction: string;
  };

  const Instructions: InstructionType[] = [
    {
      segment: "upload",
      instruction: "Select an upload to start a chat",
    },
  ];

  const configInstruction = () => {
    if (segment === "upload") {
      if (uploadList && uploadList.length > 0) {
        return "Select an upload to start a chat";
      } else {
        return "Upload a file to start a chat";
      }
    } else if (segment === "chat") {
      return "Start chatting with Moltar";
    }
  };

  return (
    <div className="md:hidden w-full h-fit px-4 py-4  bg-background border-b border-border  grid grid-cols-[36px_1fr] items-center ">
      <NavBackground />

      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetTrigger asChild>
          <Button
            // onClick={() => setOpenMenu(!openMenu)}
            className="h-fit aspect-square z-30 p-0 bg-transparent text-primary border border-border hover:opacity-70"
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

      <div className="flex items-center gap-2 w-fit mx-auto">
        <Icons.logoSolid className="h-6 w-6" />
        <span className="font-bold text-primary text-xl poppins-bold  leading-[30px] sfade-in  ">
          moltar.ai
        </span>
      </div>
    </div>
  );
};

export default MobileNav;

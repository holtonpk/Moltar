"use client";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Chat from "./chat";
import FileView, {FileViewMobile} from "./file-view";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {ProjectType} from "@/types";
import {useChat} from "@/context/chat-context2";

export const Project = ({projectData}: {projectData: ProjectType}) => {
  const {responseLoading, project} = useChat()!;

  console.log("projectData 22222", project);

  return (
    <>
      <div className="md:flex h-full border border-border  flex-grow hidden">
        <ResizablePanelGroup
          direction="horizontal"
          className="z-20 relative flex-grow h-full  "
        >
          <ResizablePanel
            defaultSize={55}
            className=" z-10 relative bg-primary/5 dark:bg-card overflow-hidden"
          >
            <FileView upload={projectData.upload} />
          </ResizablePanel>
          <ResizableHandle withHandle className="z-30" />
          <ResizablePanel
            defaultSize={45}
            className=" min-w-[450px] z-20 h-full dark:bg-card flex items-center justify-center"
          >
            <Chat />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <div className="md:hidden block  min-h-full    ">
        {(project?.chat === null || project?.chat?.length === 0) && (
          <FileViewMobile upload={projectData.upload} />
        )}
        <Chat />
      </div>
    </>
  );
};

const FileUpload = () => {
  return (
    <div className="p-8 flex-col h-full flex items-center justify-center">
      <div className="w-[80%] p-6  border-border dark border-dashed border-[2px] rounded-lg bgs-[rgb(25,118,210,.2)] flex flex-col gap-2 items-center justify-center">
        <div className="flex items-center justify-center p-6 rounded-lg bg-[rgb(25,118,210,.2)]">
          <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
        </div>
        <h1 className="text- text-2xl font-bold mt-2">Drag and Drop Files</h1>
        {/* <div className="flex flex-row items-center gap-2">
              <span className="mt-1 h-[1px] w-10 bg-gray-400"></span>
              <span className="text-gray-400">Or</span>
              <span className="mt-1 h-[1px] w-10 bg-gray-400"></span>
            </div> */}
        <h2 className="text-white font-bold text-lgg rounded-full py-2 px-6 bg-theme-blue shadow-lg">
          Select files
        </h2>
      </div>
      <div className="flex flex-row items-center gap-2">
        <span className="mt-1 h-[2px] w-10 bg-gray-400"></span>
        <span className="text-xl text-gray-400">Or</span>
        <span className="mt-1 h-[2px] w-10 bg-gray-400"></span>
      </div>
      <div className="relative h-fit w-[350px]">
        <Input
          className="shadow-lg pr-10 bg-card dark:bg-[#2F3233] text-base group focus-visible:shadow-lg  ring-theme-red ring-offset-card focus-visible:ring-theme-blue border- text- font-normal w-full"
          placeholder="Enter a link here"
        />
        <button className="absolute right-2 bg-theme-blue p-1 top-1/2 -translate-y-1/2 rounded-full  ">
          <Icons.arrowRight className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
};

const EmptyUploadList = () => {
  return (
    <div className="flex flex-col w-full gap-4 items-center justify-center  h-full p-6 shadow-2xl dark:bg-white/5">
      <div className="text-3xl font-bold capitalize text-center text-theme-blued">
        Upload files & start interacting
      </div>
      <div className="w-[80%] p-6  border-border dark border-dashed border-[2px] rounded-lg bgs-[rgb(25,118,210,.2)] flex flex-col gap-2 items-center justify-center">
        <div className="flex items-center justify-center p-6 rounded-lg bg-[rgb(25,118,210,.2)]">
          <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
        </div>
        <h1 className="text- text-2xl font-bold mt-2">Drag and Drop Files</h1>
        {/* <div className="flex flex-row items-center gap-2">
              <span className="mt-1 h-[1px] w-10 bg-gray-400"></span>
              <span className="text-gray-400">Or</span>
              <span className="mt-1 h-[1px] w-10 bg-gray-400"></span>
            </div> */}
        <h2 className="text-white font-bold text-lgg rounded-full py-2 px-6 bg-theme-blue shadow-lg">
          Select files
        </h2>
      </div>
      <div className="flex flex-row items-center gap-2">
        <span className="mt-1 h-[2px] w-10 bg-gray-400"></span>
        <span className="text-xl text-gray-400">Or</span>
        <span className="mt-1 h-[2px] w-10 bg-gray-400"></span>
      </div>
      <div className="relative h-fit w-[350px]">
        <Input
          className="shadow-lg pr-10 bg-card dark:bg-[#2F3233] text-base group focus-visible:shadow-lg  ring-theme-red ring-offset-card focus-visible:ring-theme-blue border- text- font-normal w-full"
          placeholder="Enter a link here"
        />
        <button className="absolute right-2 bg-theme-blue p-1 top-1/2 -translate-y-1/2 rounded-full  ">
          <Icons.arrowRight className="h-4 w-4 text-white" />
        </button>
      </div>
      <div className="grid grid-cols-2 items-center gap-4 mt-4 w-full">
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-red/40 p-2 rounded-md flex justify-center items-center">
              <Icons.Youtube className="h-6 w-6" />
            </div>
            <h1 className="font-bold capitalize">Summarize a YouTube Video</h1>
          </div>

          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-green/40 p-2 rounded-md flex justify-center items-center">
              <Icons.newspaper className="h-6 w-6 text-theme-green" />
            </div>
            <h1 className="font-bold capitalize">
              Get The Cliff Notes of a blog
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-blue/40 p-2 rounded-md flex justify-center items-center">
              <Icons.pencil className="h-6 w-6 text-theme-blue" />
            </div>
            <h1 className="font-bold capitalize">
              Create a detailed note outline
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-orange/40 p-2 rounded-md flex justify-center items-center">
              <Icons.flask className="h-6 w-6 text-theme-orange" />
            </div>
            <h1 className="font-bold capitalize">
              Explain the method used in the study
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

"use client";
import React, {useEffect, useCallback} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import UploadsPanel from "./uploads-pannel";
import {useUploads} from "@/context/upload-context";
import {useToast} from "@/components/ui/use-toast";
import {useAuth} from "@/context/user-auth";
import {Toast} from "@/components/ui/toast";
import {set} from "zod";

//  these need to be moved to a types file

export const Uploads = () => {
  const {currentUser} = useAuth()!;

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const {uploadList, setUploadList, loading, filterList, resetFilter} =
    useUploads();

  return (
    <div className=" flex flex-col items-center max-h-full h-full relative ">
      <UploadHeader />
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full w-full ">
          <Icons.spinner className="animate-spin h-10 w-10 text-theme-blue" />
        </div>
      ) : (
        <div className="h-full relative w-full max-w-full ">
          <FileDrop />
          {!uploadList || uploadList.length === 0 ? (
            <EmptyUploadList />
          ) : (
            <>
              {filterList?.length === 0 && (
                <h1 className="p-6 text-theme-blue w-full text-center">
                  No uploads found
                </h1>
              )}
              <UploadsPanel />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const UploadHeader = () => {
  const {uploadFile, FilterUploads, resetFilter} = useUploads();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if search value is not empty, resetFilter

    FilterUploads(e.target.value);

    // if search value is empty, resetFilter
    if (e.target.value === "") {
      resetFilter();
    }
  };

  const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files); // Convert FileList to an array
      setUploadQueue(files); // Set the initial queue

      for (let file of files) {
        await uploadFile(file); // Upload the file
        // Remove the uploaded file from the queue
        setUploadQueue((currentQueue) =>
          currentQueue.filter((f) => f !== file)
        );
      }
    }
  };

  return (
    <div className=" w-full bg-card dark:bg-[#3A3D3E]  py-3 flex items-center justify-between px-4 gap-4">
      <Input
        onChange={onSearch}
        className="w-full bg-card focus-visible:ring-theme-blue dark:focus-visible:ring-offset-[#3A3D3E] dark:border-[#3A3D3E]"
        placeholder="Search uploads"
      />
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
        className="bg-theme-blue hover:bg-theme-blue/60 text-white"
      >
        <Icons.add className="h-5 w-5" />
        New Upload
      </Button>
      <div className=" z-40 right-4 bottom-4 absolute flex flex-col items-end gap-4">
        {uploadQueue.map((file, i) => (
          <div
            key={i}
            className="h-fit p-4 px-6 w-fit flex items-center gap-4 rounded-full  bg-theme-blue "
          >
            <Icons.spinner className="h-5 w-5 animate-spin text-white" />
            <span className="text-white font-bold">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyUploadList = () => {
  const {uploadFile} = useUploads();
  const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files); // Convert FileList to an array
      setUploadQueue(files); // Set the initial queue

      for (let file of files) {
        await uploadFile(file); // Upload the file
        // Remove the uploaded file from the queue
        setUploadQueue((currentQueue) =>
          currentQueue.filter((f) => f !== file)
        );
      }
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 items-center pt-20  h-full p-6 shadow-2xl dark:bg-white/5 relative z-10">
      <div className="text-3xl font-bold capitalize text-center text-theme-blued">
        Upload files & start interacting
      </div>
      <div className="w-[80%] p-6  border-border dark  rounded-lg bgs-[rgb(25,118,210,.2)] flex flex-col gap-2 items-center justify-center">
        <div className="flex items-center justify-center p-6 rounded-lg bg-[rgb(25,118,210,.2)]">
          <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
        </div>
        <h1 className="text- text-2xl font-bold mt-2">Drag and Drop Files</h1>
        <Button
          onClick={() => document.getElementById("selectedFile")?.click()}
          className="text-primary font-bold  rounded-full py-2 px-6 bg-theme-blue shadow-lg"
        >
          Select files
        </Button>
        <input
          multiple
          id="selectedFile"
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          style={{display: "none"}}
        />
      </div>
      <div className=" z-40 right-4 bottom-4 absolute flex flex-col items-end gap-4">
        {uploadQueue.map((file, i) => (
          <div
            key={i}
            className="h-fit p-4 px-6 w-fit flex items-center gap-4 rounded-full  bg-theme-blue "
          >
            <Icons.spinner className="h-5 w-5 animate-spin text-white" />
            <span className="text-white font-bold">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FileDrop = () => {
  const [dragging, setDragging] = React.useState(false);
  const {uploadFile} = useUploads();

  const [dropError, setDropError] = React.useState(false);
  const {toast} = useToast();

  const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);
  const [activeUpload, setActiveUpload] = React.useState<File | null>(null);

  const dragContainer = React.useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);

      // Handle the dropped files here
      if (e.dataTransfer === null) return;
      const files = Array.from(e.dataTransfer.files);
      const pdfFiles = files.filter(
        (file: File) => file.type === "application/pdf"
      );
      setUploadQueue(pdfFiles);
      for (let file of pdfFiles) {
        setActiveUpload(file);
        await uploadFile(file);
        setUploadQueue((prev) => prev.filter((f) => f !== file));
      }
      setActiveUpload(null);
    },
    [uploadFile]
  );

  useEffect(() => {
    const currentDragContainer = dragContainer.current;
    if (!currentDragContainer) return;

    currentDragContainer.addEventListener("dragover", handleDragOver);
    currentDragContainer.addEventListener("dragleave", handleDragLeave);
    currentDragContainer.addEventListener("drop", handleDrop);

    return () => {
      currentDragContainer.removeEventListener("dragover", handleDragOver);
      currentDragContainer.removeEventListener("dragleave", handleDragLeave);
      currentDragContainer.removeEventListener("drop", handleDrop);
    };
  }, [handleDrop, handleDragOver, handleDragLeave]); // Assuming `handleDrop` is stable or wrapped with useCallback

  return (
    <>
      <div
        ref={dragContainer}
        className={`h-full w-full absolute p-2 left-0 top-0 z-40 pointer-events-none ${
          dragging ? " opacity-1" : "opacity-0"
        }`}
      >
        <div className="h-full  pointer-events-none w-full border-2 border-dashed border-theme-blue bg-theme-blue/10 blurBack rounded-xl z-40 flex items-center justify-center flex-col">
          <div className="flex items-center flex-col justify-center p-4 rounded-lg ">
            <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
            <h1 className="font-bold text-2xl text-theme-blue">
              Drag & Drop files here
            </h1>
          </div>
        </div>
      </div>

      <div className=" z-40 right-4 bottom-4 absolute flex flex-col items-end gap-4">
        {uploadQueue.map((file, i) => (
          <div
            key={i}
            className="h-fit p-4 px-6 w-fit flex items-center gap-4 rounded-full  bg-theme-blue "
          >
            <Icons.spinner className="h-5 w-5 animate-spin text-white" />
            <span className="text-white font-bold">{file.name}</span>
          </div>
        ))}
      </div>
    </>
  );
};

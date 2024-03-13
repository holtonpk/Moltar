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

  const dragContainer = React.useRef<HTMLDivElement>(null);

  return (
    <div className=" flex flex-col items-center max-h-full h-full relative ">
      <UploadHeader />
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full w-full ">
          <Icons.spinner className="animate-spin h-10 w-10 text-theme-blue" />
        </div>
      ) : (
        <div ref={dragContainer} className="h-full relative w-full max-w-full ">
          <FileDrop dragContainer={dragContainer} />
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
  const {toast} = useToast();

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
  const {toast} = useToast();

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
    <div className="flex flex-col w-full gap-4 items-center pt-20  h-full p-6 shadow-2xl dark:bg-white/5 relative z-10">
      <div className="h-fit w-fit flex flex-col items-center  p-8 px-20 rounded-lg border border-border dark:border-white/10  dark:bg-white/5 shadow-lg">
        {/* <div className="text-3xl font-bold capitalize text-center text-theme-blued">
          The easy way to simplify <br /> your reading
        </div> */}
        <div className="w-[80%] p-6  border-border   rounded-lg bgs-[rgb(25,118,210,.2)] flex flex-col gap-2 items-center justify-center">
          <div className="flex items-center justify-center p-6 rounded-lg bg-[rgb(25,118,210,.2)]">
            <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
          </div>
          <h1 className="text- text-2xl font-bold mt-2 whitespace-nowrap">
            Drag & Drop your .pdf Files
          </h1>
          <span>or</span>
          {/* <Button
            onClick={() => document.getElementById("selectedFile")?.click()}
            className="text-primary font-bold  rounded-full py-2 px-6 bg-theme-blue hover:bg-theme-blue hover:opacity-80 shadow-lg"
          >
            Click to browse
          </Button> */}
          <Button
            onClick={() => document.getElementById("selectedFile")?.click()}
            className="text-primary text-sm bg-transparent  w-full bg-gradient-to-b from-theme-purple via-theme-green to-theme-blue p-[2px]"
          >
            <span className="bg-card dark:bg-[#3B3C3D] text-primary w-full h-full rounded-md flex items-center justify-center hover:opacity-90">
              Click to browse
            </span>
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
    </div>
  );
};

const FileDrop = ({
  dragContainer,
}: {
  dragContainer: React.RefObject<HTMLDivElement>;
}) => {
  const [dragging, setDragging] = React.useState(false);
  const {uploadFile} = useUploads();

  const [dropError, setDropError] = React.useState(false);
  const {toast} = useToast();

  const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);
  const [activeUpload, setActiveUpload] = React.useState<File | null>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    console.log("dragging");
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
        // get the total words in the pdf file
        if (file.size > 10000000) {
          toast({
            title: `${file.name} is too large`,
            description: "Please upload a file less than 10MB",
            variant: "destructive",
          });
        } else {
          setActiveUpload(file);
          await uploadFile(file);
        }
        setUploadQueue((prev) => prev.filter((f) => f !== file));
      }
      setActiveUpload(null);
    },
    [uploadFile, toast]
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
  }, [handleDrop, handleDragOver, handleDragLeave, dragContainer]); // Assuming `handleDrop` is stable or wrapped with useCallback

  return (
    <>
      <div
        className={`h-full w-full absolute p-2 left-0 top-0 z-40 pointer-events-none  ${
          dragging ? " opacity-1" : "opacity-0 "
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

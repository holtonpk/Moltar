"use client";
import React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import UploadsPanel from "./uploads-pannel";
import {useUploads} from "@/context/upload-context";
import {useToast} from "@/components/ui/use-toast";

//  these need to be moved to a types file

export const Uploads = () => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const {uploadList, setUploadList, loading, filterList, resetFilter} =
    useUploads();

  console.log("uploadList render **************");

  return (
    <div className=" flex flex-col items-center max-h-full h-full relative">
      <UploadHeader />
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full w-full ">
          <Icons.spinner className="animate-spin h-10 w-10 text-theme-blue" />
        </div>
      ) : (
        <div className="h-full relative w-full ">
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
  const {FileUpload, FilterUploads, resetFilter} = useUploads();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if search value is not empty, resetFilter

    FilterUploads(e.target.value);

    // if search value is empty, resetFilter
    if (e.target.value === "") {
      resetFilter();
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
        id="selectedFile"
        type="file"
        accept=".pdf"
        onChange={FileUpload}
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
    </div>
  );
};

const EmptyUploadList = () => {
  const {FileUpload} = useUploads();

  return (
    <div className="flex flex-col w-full gap-4 items-center pt-20  h-full p-6 shadow-2xl dark:bg-white/5">
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
          id="selectedFile"
          type="file"
          accept=".pdf"
          onChange={FileUpload}
          style={{display: "none"}}
        />
      </div>
    </div>
  );
};

const FileDrop = () => {
  const [dragging, setDragging] = React.useState(false);
  const {FileDrop, uploadFile} = useUploads();

  const [dropError, setDropError] = React.useState(false);
  const {toast} = useToast();

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setDragging(true);
    };

    const handleDragLeave = () => {
      setDragging(false);
    };

    async function handleDrop(e: DragEvent) {
      e.preventDefault();
      setDragging(false);

      // Handle the dropped files here
      if (e.dataTransfer === null) return;
      const files = Array.from(e.dataTransfer.files);
      const pdfFiles = files.filter(
        (file: File) => file.type === "application/pdf"
      );
      console.log("dropped==>", pdfFiles);
      if (pdfFiles.length > 0) {
        await FileDrop(pdfFiles);
        toast({
          variant: "blue",
          title: `${pdfFiles.length > 1 ? "Files" : "File"} uploaded`,
          description:
            `${pdfFiles.length} ` +
            (pdfFiles.length > 1 ? " files have" : " file has") +
            " been uploaded successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Unsupported file type",
          description: "Only PDF files are supported",
        });
      }
    }

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [toast, FileDrop]);

  return (
    <div
      className={`h-full w-full absolute p-2 left-0 top-0 z-40 ${
        dragging ? "visible" : "hidden"
      }`}
    >
      <div className="h-full  pointer-events-none w-full border-2 border-dashed border-theme-blue bg-theme-blue/10 rounded-xl z-40 flex items-center justify-center flex-col">
        <div className="flex items-center flex-col justify-center p-4 rounded-lg ">
          <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
          <h1 className="font-bold text-2xl text-theme-blue">
            Drag & Drop files here
          </h1>
        </div>
      </div>
    </div>
  );
};

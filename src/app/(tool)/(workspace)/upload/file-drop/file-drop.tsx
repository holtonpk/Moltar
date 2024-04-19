"use client";
import React, {useEffect, useCallback, useState} from "react";
import {Icons} from "@/components/icons";
import {useUploads} from "@/context/upload-context";
import {toastLong} from "@/components/ui/use-toast-long";
import {toast} from "@/components/ui/use-toast";
import {useAuth} from "@/context/user-auth";
export const FileDrop = ({
  dragContainer,
}: {
  dragContainer: React.RefObject<HTMLDivElement>;
}) => {
  const [dragging, setDragging] = React.useState(false);
  const {
    uploadFile,
    setShowDialog,
    isLoadingUpload,
    setIsLoadingUpload,
    setUploadedFile,
    uploadedFileLocal,
    setUploadedFileLocal,
    uploadList,
  } = useUploads()!;
  const {setShowLoginModal, currentUser} = useAuth()!;

  const [dropError, setDropError] = React.useState(false);

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

      if (
        uploadList &&
        uploadList?.length > 0 &&
        (!currentUser || !currentUser?.uid)
      ) {
        toastLong({
          title: "You've reached the limit without an account",
          description:
            "Create an account to continue chatting, don't worry it's free!",
        });
        setShowLoginModal(true);
        return;
      }

      // Handle the dropped files here
      if (e.dataTransfer === null) return;
      const files = Array.from(e.dataTransfer.files);
      const pdfFiles = files.filter(
        (file: File) => file.type === "application/pdf"
      );
      setUploadedFileLocal(pdfFiles[0]);
      setIsLoadingUpload(true);

      for (let file of pdfFiles) {
        // get the total words in the pdf file
        if (file.size > 10000000) {
          toast({
            title: `${file.name} is too large`,
            description: "Please upload a file less than 10MB",
            variant: "destructive",
          });
        } else {
          const fileData = await uploadFile(file);
          setUploadedFile(fileData);
          setShowDialog(true);
        }
      }
    },
    [uploadFile, toast, setShowDialog, setUploadedFile]
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
    </>
  );
};

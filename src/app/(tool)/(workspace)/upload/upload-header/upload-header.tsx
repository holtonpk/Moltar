"use client";
import React, {useEffect, useCallback, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {useUploads} from "@/context/upload-context";
import {toastLong} from "@/components/ui/use-toast-long";
import {useAuth} from "@/context/user-auth";

export const UploadHeader = ({
  setShowUploadDialog,
}: {
  setShowUploadDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    uploadFile,
    FilterUploads,
    resetFilter,
    setUploadedFile,
    setShowDialog,
    setUploadedFileLocal,
    setIsLoadingUpload,
    uploadList,
  } = useUploads()!;

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if search value is not empty, resetFilter

    FilterUploads(e.target.value);

    // if search value is empty, resetFilter
    if (e.target.value === "") {
      resetFilter();
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files); // Convert FileList to an array
      setUploadedFileLocal(files[0]);
      setIsLoadingUpload(true);
      for (let file of files) {
        // if (file.size > 10000000) {
        //   toast({
        //     title: `${file.name} is too large`,
        //     description: "Please upload a file less than 10MB",
        //     variant: "destructive",
        //   });
        // } else {
        const fileData = await uploadFile(file); // Upload the file to firebase
        setUploadedFile(fileData);
        setShowDialog(true);
      }
      // }
    }
  };

  const dummyFile = {
    id: "4ym68it",
    title: "Jacobs-DeathAndLifeOfGreatAmericanCities-Excerpts.pdf",
    // path: "https://firebasestorage.googleapis.com/v0/b/moltar-bc665.appspot.com/o/4ym68it?alt=media&token=7afe9e3e-67a4-40a9-9030-b186fef1b16b",
    path: "https://firebasestorage.googleapis.com/v0/b/moltar-bc665.appspot.com/o/1lrebg?alt=media&token=dc8de7a3-b209-49c8-bb78-e0e4d0037e3f",
  };

  const {currentUser, setShowLoginModal} = useAuth()!;

  return (
    <div className="w-full p-2 rounded-md bg-transparent pb-0 z-20">
      <div className=" w-full     py-3 flex  items-center justify-between  gap-4">
        <Input
          onChange={onSearch}
          className="w-full bg-card shadow-sm hidden md:flex focus-visible:ring-theme-blue dark:focus-visible:ring-offset-[#3A3D3E] dark:border-[#3A3D3E]"
          placeholder="Search uploads"
        />
        <input
          multiple
          id="newUploadInput"
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          style={{display: "none"}}
          className="bg-theme-blue hover:bg-theme-blue/60 text-white"
        />
        {/* <Button
          onClick={() => setShowUploadDialog(true)}
          className="bg-theme-green hover:bg-theme-green/60 text-white w-full  md:w-fit"
        >
          <Icons.filter className="h-5 w-5 mr-2" />
          Filter
        </Button> */}

        <Button
          onClick={() => {
            if (
              uploadList &&
              uploadList?.length > 0 &&
              (!currentUser || !currentUser?.uid)
            ) {
              toastLong({
                title: "You've reached the limit without an account",
                description:
                  "Upgrade to continue chatting, don't worry it's free!",
              });
              setShowLoginModal(true);
              return;
            }

            setShowUploadDialog(true);
          }}
          className="bg-theme-blue hover:bg-theme-blue/60 text-white w-full  md:w-fit"
        >
          <Icons.add className="h-5 w-5 mr-2" />
          New Upload
        </Button>
      </div>
    </div>
  );
};

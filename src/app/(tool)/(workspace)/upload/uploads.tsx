"use client";
import React, {useEffect, useCallback, useState} from "react";
import {Icons} from "@/components/icons";
import UploadsPanel from "./upload-panel/upload-panel";
import {useUploads} from "@/context/upload-context";
import {PdfUploadDialog} from "./upload-dialogs/pdf-upload";
import {UploadDialog} from "./upload-dialogs/upload-dialog";
import {Progress, ProgressBlue} from "@/components/ui/progress";
import {UploadHeader} from "./upload-header/upload-header";
import {FileDrop} from "./file-drop/file-drop";
import {EmptyUploadList} from "./empty-upload/empty-upload";
import {set} from "zod";

export const Uploads = () => {
  const {
    uploadList,
    loading,
    filterList,
    uploadedFile,
    showDialog,
    uploadedFileLocal,
    isLoadingUpload,
    uploadProgress,
    cancelUpload,
    setIsLoadingUpload,
  } = useUploads()!;

  const dragContainer = React.useRef<HTMLDivElement>(null);

  const [showUploadDialog, setShowUploadDialog] = React.useState(false);

  // const loading = true;

  const [loadingProgress, setLoadingProgress] = React.useState(0);

  useEffect(() => {
    if (loadingProgress <= 95) {
      setTimeout(() => {
        setLoadingProgress(loadingProgress + 1);
      }, 5);
    }
  }, [loadingProgress]);

  const cancel = () => {
    setIsLoadingUpload(false);
    cancelUpload.current = true;
  };

  return (
    <>
      {uploadedFile && showDialog && <PdfUploadDialog file={uploadedFile} />}
      <div className=" flex flex-col items-center max-h-full overflow-scroll h-full relative ">
        <UploadDialog open={showUploadDialog} setIsOpen={setShowUploadDialog} />
        {uploadList && uploadList?.length > 0 && (
          <UploadHeader setShowUploadDialog={setShowUploadDialog} />
        )}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <Icons.logo className="h-20 w-20 text-theme-blue" />
            {/* <Icons.spinner className="animate-spin h-10 w-10 text-theme-blue" /> */}
            <Progress
              value={loadingProgress}
              className="w-[200px] bg-primary/5 border border-border"
            />
          </div>
        ) : (
          <div
            ref={dragContainer}
            className="h-full relative w-full max-w-full "
          >
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
      {/* {true && ( */}
      {uploadedFileLocal && isLoadingUpload && (
        <div className="w-[95%] right-1/2 translate-x-1/2 md:-translate-x-0 md:w-fit z-40 md:right-4 md:bottom-4 bottom-4 absolute flex flex-col items-end gap-4">
          <div className="h-fit p-4 px-6 w-full grid min-w-[300px] items-center gap-4 rounded-md bg-card shadow-lg  dark:bg-[#2F3233]  border border-border">
            <span className="text-primary text-sm font-bold whitespace-nowrap overflow-hidden max-w-full text-ellipsis flex flex-row items-center gap-2">
              {uploadProgress === 100 ? (
                <Icons.check className="h-5 w-5 text-theme-green" />
              ) : (
                <Icons.spinner className="h-5 w-5 animate-spin text-theme-blue" />
              )}
              {uploadedFileLocal.name}
            </span>
            <div className="flex items-center gap-2">
              <ProgressBlue
                value={uploadProgress}
                className="flex-grow   bg-primary/10"
              />
              <button onClick={cancel}>
                <Icons.close className="h-5 w-5 " />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

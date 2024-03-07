"use client";

import React, {useContext, createContext, useState, useEffect} from "react";

import {UploadType} from "@/types";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

import {app} from "@/config/firebase";

const UploadsContext = createContext<any | null>(null);

export function useUploads() {
  return useContext(UploadsContext);
}

interface Props {
  children?: React.ReactNode;
}

export const UploadsProvider = ({children}: Props) => {
  const [uploadList, setUploadList] = React.useState<UploadType[]>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [filterList, setFilterList] = useState<string[]>();

  const setStateToLocalStorage = () => {
    const userUploads = localStorage.getItem("userUploads");
    if (userUploads) {
      setUploadList(JSON.parse(userUploads));
      setFilterList(
        JSON.parse(userUploads).map((upload: UploadType) => upload.id)
      );
    }
  };

  useEffect(() => {
    setStateToLocalStorage();
    setLoading(false);
  }, []); // Empty dependency array ensures effect runs only once

  async function uploadFileToFirebase(file: File, fileID: string) {
    console.log("uploading file to firebase");
    const storage = getStorage(app);
    const fileRef = ref(storage, fileID);
    // upload file
    await uploadBytesResumable(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);
    return fileUrl;
  }

  async function uploadFile(file: File) {
    const fileID = Math.random().toString(36).substring(7);
    // upload file to firebase storage
    const firebaseUrl = await uploadFileToFirebase(file, fileID);

    const upload: UploadType = {
      title: file.name,
      id: fileID,
      path: firebaseUrl,
    };
    const userStorage = localStorage.getItem("userUploads");
    if (!userStorage) {
      localStorage.setItem("userUploads", JSON.stringify([upload]));
    } else {
      localStorage.setItem(
        "userUploads",
        JSON.stringify([...JSON.parse(userStorage), upload])
      );
    }

    return upload;

    // save url userUploads in local storage
  }

  async function FileDrop(files: File[]) {
    let newFiles: any = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newFile = await uploadFile(file);
      newFiles.push(newFile);
    }
    setUploadList([...(uploadList || []), ...newFiles]);
  }

  async function FileUpload(event: any) {
    const file = event.target.files[0];
    const newFile = await uploadFile(file);
    setUploadList([...(uploadList || []), newFile]);
  }

  const ReNameUpload = (fileId: string, name: string) => {
    const storage = localStorage.getItem("userUploads");
    if (storage) {
      const userStorage = JSON.parse(storage);
      const newStorage = userStorage.map((upload: UploadType) => {
        if (upload.id === fileId) {
          upload.title = name;
        }
        return upload;
      });
      localStorage.setItem("userUploads", JSON.stringify(newStorage));
    }
    setUploadList(
      uploadList?.map((upload) => {
        if (upload.id === fileId) {
          upload.title = name;
        }
        return upload;
      })
    );
  };

  async function DeleteUploadFromFirebase(fileId: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileId);
    await deleteObject(fileRef);
  }

  async function DeleteUpload(fileId: string) {
    const storage = localStorage.getItem("userUploads");
    if (storage) {
      const userStorage = JSON.parse(storage);
      const newStorage = userStorage.filter(
        (upload: UploadType) => upload.id !== fileId
      );
      localStorage.setItem("userUploads", JSON.stringify(newStorage));
    }
    await DeleteUploadFromFirebase(fileId);
    setUploadList((prevUploadList) =>
      prevUploadList
        ? prevUploadList.filter((upload) => upload.id !== fileId)
        : []
    );
  }

  const FilterUploads = (search: string) => {
    // Convert search string to lowercase for case-insensitive matching
    const searchLowerCase = search.toLowerCase();

    // Filter uploadList based on search
    const filteredUploads = uploadList?.filter((upload) => {
      // Convert title to lowercase for case-insensitive matching
      const titleLowerCase = upload.title.toLowerCase();

      // Check if the title contains the search string
      return titleLowerCase.includes(searchLowerCase);
    });

    // Extract only the IDs from the filtered uploads
    const filteredUploadIds = filteredUploads?.map((upload) => upload.id);

    // Update filterList state with filtered upload IDs
    setFilterList(filteredUploadIds);
  };

  const resetFilter = () => {
    setFilterList(uploadList?.map((upload: UploadType) => upload.id));
  };

  console.log("filterList", filterList);

  const values = {
    filterList,
    uploadList,
    resetFilter,
    setUploadList,
    loading,
    uploadFile,
    FileUpload,
    DeleteUpload,
    ReNameUpload,
    FileDrop,
    FilterUploads,
  };

  return (
    <UploadsContext.Provider value={values}>{children}</UploadsContext.Provider>
  );
};

export default UploadsContext;

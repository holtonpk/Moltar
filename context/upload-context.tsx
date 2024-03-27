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
import {
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  query,
  collection,
  deleteDoc,
} from "firebase/firestore";

import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";

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

  const {currentUser, unSubscribedUserId} = useAuth()!;

  useEffect(() => {
    const q = query(
      collection(db, `users/${currentUser?.uid || unSubscribedUserId}/uploads`)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const uploads = querySnapshot.docs.map((doc) => doc.data());
      const savedProjects = uploads as UploadType[];
      setLoading(false);
      setUploadList(savedProjects);
      setFilterList(savedProjects.map((upload: UploadType) => upload.id));
    });

    // Cleanup this component
    return () => unsubscribe();
  }, [currentUser]); // Empty dependency array ensures effect runs only once

  async function uploadFileToFirebase(file: File, fileID: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileID);
    // upload file
    await uploadBytesResumable(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);
    return fileUrl;
  }

  async function uploadFile(file: File, text: string) {
    const fileID = Math.random().toString(36).substring(7);
    // upload file to firebase storage
    const firebaseUrl = await uploadFileToFirebase(file, fileID);

    const upload: UploadType = {
      title: file.name,
      id: fileID,
      path: firebaseUrl,
      text: text,
    };

    // save upload ref to firebase firestore
    const docRef = doc(
      db,
      `users/${
        currentUser?.uid || unSubscribedUserId || unSubscribedUserId
      }/uploads`,
      fileID
    );
    await setDoc(docRef, upload);
    return upload;
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
    // renmame file field in firebase storage
    const docRef = doc(
      db,
      `users/${currentUser?.uid || unSubscribedUserId}/uploads`,
      fileId
    );
    setDoc(docRef, {title: name}, {merge: true});
  };

  async function DeleteUploadFromFirebase(fileId: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileId);
    await deleteObject(fileRef);
  }

  async function DeleteUpload(fileId: string) {
    const docRef = doc(
      db,
      `users/${currentUser?.uid || unSubscribedUserId}/uploads`,
      fileId
    );
    await deleteDoc(docRef);
    await DeleteUploadFromFirebase(fileId);
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

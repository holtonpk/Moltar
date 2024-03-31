"use client";

import React, {useContext, createContext, useState, useEffect} from "react";

import {UploadType, LocalUploadType} from "@/types";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from "firebase/storage";

import {app} from "@/config/firebase";
import {
  doc,
  where,
  getDocs,
  onSnapshot,
  setDoc,
  query,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import {db} from "@/config/firebase";
import {useAuth} from "@/context/user-auth";

type UploadContextType = {
  filterList: string[] | undefined;
  uploadList: UploadType[] | undefined;
  resetFilter: () => void;
  setUploadList: React.Dispatch<React.SetStateAction<UploadType[] | undefined>>;
  loading: boolean;
  uploadFile: (file: File) => Promise<LocalUploadType>;
  // FileUpload: (event: any) => void;
  DeleteUpload: (fileId: string) => void;
  ReNameUpload: (fileId: string, name: string) => void;
  FileDrop: (files: File[]) => void;
  FilterUploads: (search: string) => void;
  uploadedFile: LocalUploadType | null;
  setUploadedFile: React.Dispatch<React.SetStateAction<LocalUploadType | null>>;
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingUpload: boolean;
  setIsLoadingUpload: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadsContext = createContext<UploadContextType | null>(null);

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

  const [uploadedFile, setUploadedFile] =
    React.useState<LocalUploadType | null>(null);
  const [showDialog, setShowDialog] = React.useState(false);

  const [isLoadingUpload, setIsLoadingUpload] = React.useState(false);

  const {currentUser, unSubscribedUserId} = useAuth()!;

  useEffect(() => {
    console.log("unsub", currentUser?.uid, unSubscribedUserId);
    const q = query(
      collection(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/uploads`
      )
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

  const [uploadData, setUploadData] = useState<any>();

  // useEffect(() => {
  //   if (!isLoadingUpload && uploadData) {
  //     saveToFirebase(uploadData!);
  //     setUploadData(null);
  //   }
  // }, [isLoadingUpload]);

  async function saveToFirebase(file: UploadType) {
    const docRef = doc(
      db,
      `users/${
        currentUser?.uid
          ? currentUser?.uid
          : unSubscribedUserId || unSubscribedUserId
      }/uploads`,
      file.id
    );
    await setDoc(docRef, file, {merge: true});
  }

  async function uploadFile(file: File) {
    const fileID = Math.random().toString(36).substring(7);
    // upload file to firebase storage
    const firebaseUrl = await uploadFileToFirebase(file, fileID);
    const upload = {
      title: file.name,
      id: fileID,
      path: firebaseUrl,
    };
    setUploadData(upload);
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

  // async function FileUpload(event: any) {
  //   const file = event.target.files[0];
  //   const newFile = await uploadFile(file);
  //   setUploadList([...(uploadList || []), newFile]);
  // }

  const ReNameUpload = (fileId: string, name: string) => {
    // renmame file field in firebase storage
    const docRef = doc(
      db,
      `users/${
        currentUser?.uid ? currentUser?.uid : unSubscribedUserId
      }/uploads`,
      fileId
    );
    setDoc(docRef, {title: name}, {merge: true});
  };

  async function DeleteUploadFromFirebase(fileId: string) {
    const storage = getStorage(app);
    const fileRef = ref(storage, fileId);
    await deleteObject(fileRef);

    const folderRef = ref(storage, fileId);
    const files = await listAll(folderRef);
    files.items.forEach(async (file) => {
      await deleteObject(file);
    });
  }

  async function DeleteAllProjectsWithUpload(fileId: string) {
    const q = query(
      collection(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/projects`
      ),
      where("uploadId", "==", fileId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  async function DeleteUpload(fileId: string) {
    const docRef = doc(
      db,
      `users/${
        currentUser?.uid ? currentUser?.uid : unSubscribedUserId
      }/uploads`,
      fileId
    );
    await deleteDoc(docRef);
    await DeleteUploadFromFirebase(fileId);
    await DeleteAllProjectsWithUpload(fileId);
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
    // FileUpload,
    DeleteUpload,
    ReNameUpload,
    FileDrop,
    FilterUploads,
    uploadedFile,
    setUploadedFile,
    showDialog,
    setShowDialog,
    isLoadingUpload,
    setIsLoadingUpload,
  };

  return (
    <UploadsContext.Provider value={values}>{children}</UploadsContext.Provider>
  );
};

export default UploadsContext;

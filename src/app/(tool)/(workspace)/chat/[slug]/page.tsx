"use client";

import React, {use} from "react";
import {Project} from "./project";
import {ProjectType} from "@/types";
import {ChatProvider} from "@/context/chat-context";
import {db} from "@/config/firebase";
import {doc, getDoc} from "firebase/firestore";
import {useAuth} from "@/context/user-auth";
import {Skeleton} from "@/components/ui/skeleton";

interface Params {
  params: {
    slug: string;
  };
}

export default function Page({params}: Params) {
  const [loading, setLoading] = React.useState(true);
  const [project, setProject] = React.useState<ProjectType>();

  const {currentUser, unSubscribedUserId} = useAuth()!;

  React.useEffect(() => {
    const fetchProject = async (projectId: string) => {
      console.log("fethcing ******");
      const docRef = doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/projects`,
        projectId
      );

      const docSnap = await getDoc(docRef);
      const projectData = docSnap.data() as ProjectType;
      console.log("projectData ====", projectData);
      const uploadRef = doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/uploads`,
        projectData.uploadId
      );
      const uploadSnap = await getDoc(uploadRef);
      const upload = uploadSnap.data();
      console.log("uploadData=====", upload);

      const projectLocal = {
        ...projectData,
        upload: upload,
      } as ProjectType;

      setProject(projectLocal);
      setLoading(false);
    };

    fetchProject(params.slug);
  }, [params.slug, unSubscribedUserId, currentUser?.uid]);

  console.log("project 111111", params.slug, project);

  return (
    <ChatProvider projectId={params.slug}>
      <Project projectData={project as ProjectType} />
    </ChatProvider>
  );
}

const dummyData = {
  uploadId: "yljgm",
  chat: null,
  upload: {
    id: "yljgm",
    path: "https://firebasestorage.googleapis.com/v0/b/moltar-bc665.appspot.com/o/yljgm?alt=media&token=e9d2eaea-e713-44f2-bd03-17d93972430b",
    title: "Casner Park strategy.pdf",
  },
  createdAt: {
    seconds: 1709762996,
    nanoseconds: 270000000,
  },
  id: "ecdok4",
};

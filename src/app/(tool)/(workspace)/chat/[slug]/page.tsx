"use client";

import React, {use} from "react";
import {Project} from "./project";
import {ProjectType} from "@/types";
import {ChatProvider2} from "@/context/chat-context2";
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
      const docRef = doc(
        db,
        `users/${currentUser?.uid || unSubscribedUserId}/projects`,
        projectId
      );
      const docSnap = await getDoc(docRef);
      const projectData = docSnap.data() as ProjectType;
      const uploadRef = doc(
        db,
        `users/${currentUser?.uid || unSubscribedUserId}/uploads`,
        projectData.uploadId
      );
      const uploadSnap = await getDoc(uploadRef);
      const upload = uploadSnap.data();
      const projectLocal = {
        ...projectData,
        upload: upload,
      } as ProjectType;

      setProject(projectLocal);
      setLoading(false);
    };

    fetchProject(params.slug);
  }, [params.slug, unSubscribedUserId, currentUser?.uid]);

  console.log("project 111111", project);

  return (
    <>
      {loading ? (
        <div className="flex">
          <div className="w-[55%] flex flex-col justify-between gap-4 items-center pt-6">
            <Skeleton className="gap-4 flex-grow bg-primary/40   w-[80%]" />

            <Skeleton className="h-20 bg-primary/40 w-full  rounded-none" />
          </div>

          <Skeleton className="h-screen bg-primary/40 w-[45%] rounded-none" />
        </div>
      ) : (
        <ChatProvider2 projectId={params.slug}>
          <Project projectData={project as ProjectType} />
        </ChatProvider2>
      )}
    </>
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

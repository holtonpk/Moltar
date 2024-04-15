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
      const docRef = doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/projects`,
        projectId
      );

      const docSnap = await getDoc(docRef);
      const projectData = docSnap.data() as ProjectType;

      const uploadRef = doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/uploads`,
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

  console.log("fetching project", currentUser?.uid);

  return (
    <ChatProvider projectId={params.slug}>
      <Project projectData={project as ProjectType} />
    </ChatProvider>
  );
}

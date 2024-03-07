import React from "react";
import {Project} from "./project";
import {useChat} from "@/context/chat-context";
import {SavedProjectType, UploadType, ProjectType, ChatObject} from "@/types";

interface Params {
  params: {
    slug: string;
  };
}

const fetchProject = async (projectId: string) => {
  const project = ProjectList.find((project) => project.id === projectId);

  const projectWithUpload = {
    ...project,
    upload: uploads.find((upload) => upload.id === project?.uploadId),
  };

  return projectWithUpload as ProjectType;
};

export default async function Page({params}: Params) {
  const project = await fetchProject(params.slug);

  return <Project project={project} />;
}

const DEMO_USERS_CHATS: ChatObject[] = [
  {
    id: "1",
    chatLog: [],
    title: "Biology 2 - Chapter 3",
    tagColor: "#E65709",
    documentId: "test",
  },
  {
    id: "2",
    chatLog: [
      {
        sender: "human",
        text: "Can you create a study guide for the mid term exam?",
      },
    ],
    title: "Chemistry mid term exam",
    tagColor: "#9166F0",
    documentId: "book-preview",
  },
  {
    id: "3",
    chatLog: [
      {
        sender: "human",
        text: "Can you create a report on this book",
      },
    ],
    title: "Book report on the Great Gatsby",
    tagColor: "#348DF4",
    documentId: "the-50-greatest-business-success-stories",
  },
];

const ProjectList: SavedProjectType[] = [
  {
    id: "1",
    name: "Biology 2 - Chapter 3",
    color: "bg-theme-orange",
    uploadId: "1",
    chat: DEMO_USERS_CHATS[0],
  },
  {
    id: "2",
    name: "Chemistry mid term exam",
    color: "bg-theme-purple",
    uploadId: "2",
    chat: null,
  },
  // {
  //   id: "3",
  //   name: "Book report on 'To Kill a Mockingbird'",
  //   color: "bg-theme-blue",
  //   uploadId: "3",
  // },
  // {
  //   id: "4",
  //   name: "Notes from Ecom 101",
  //   color: "bg-theme-green",
  //   uploadId: "4",
  // },
  // {
  //   id: "5",
  //   name: "Notes from Ecom 101 Notes from Ecom 101 Notes from Ecom 101 Notes from Ecom 101 Notes from Ecom 101",
  //   color: "bg-theme-green",
  //   uploadId: "5",
  // },
  // {
  //   id: "6",
  //   name: "Notes from Ecom 101 Notes from Ecom 101 Notes from Ecom 101 Notes from Ecom 101 Notes from Ecom 101",
  //   color: "bg-theme-green",
  //   uploadId: "1",
  // },
];

const uploads: UploadType[] = [
  {
    title: "test.pdf",
    id: "1",
    path: "test.pdf",
  },
  {
    title: "book-preview.pdf",
    id: "2",
    path: "book-preview.pdf",
  },
  {
    title: "book2.pdf",
    id: "3",
    path: "book2.pdf",
  },
  {
    title: "test-pdf-book.pdf",
    id: "4",
    path: "test-pdf-book.pdf",
  },
  {
    title: "the-50-greatest-business-success-stories.pdf",
    id: "5",
    path: "the-50-greatest-business-success-stories.pdf",
  },
];

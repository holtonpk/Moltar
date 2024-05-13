"use client";

import React, {useContext, createContext, useEffect, useState} from "react";
import {
  doc,
  getDocs,
  getDoc,
  onSnapshot,
  setDoc,
  query,
  collection,
} from "firebase/firestore";

import {db} from "@/config/firebase";
import OpenAI from "openai";
import {track} from "@vercel/analytics";

import {ProjectType, ChatLog} from "@/types";

const ChatContext = createContext<ChatContextType | null>(null);

const LOCAL_STORAGE_KEY = "userProjects";
import {useAuth} from "@/context/user-auth";
import {text} from "stream/consumers";

export function useChat() {
  return useContext(ChatContext);
}

interface Props {
  children?: React.ReactNode;
  projectId: string;
}

interface ChatContextType {
  prompt: string;
  setPrompt: (prompt: string) => void;
  project: ProjectType | null;
  chat: ChatLog[] | null;
  updateProject: (updatedProject: ProjectType) => void;
  updateChat: (newChat: ChatLog) => void;
  responseRendering: boolean;
  animatedMessage: string;
  responseLoading: boolean;
  chatError: boolean;
  setChatError: (value: boolean) => void;
}

export const ChatProvider = ({children, projectId}: Props) => {
  const [totalProjects, setTotalProjects] = useState<number>();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [chat, setChat] = useState<ChatLog[] | null>(null);

  const {currentUser, unSubscribedUserId} = useAuth()!;

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(
          db,
          `users/${
            currentUser?.uid ? currentUser?.uid : unSubscribedUserId
          }/projects`
        )
      );

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const projects = querySnapshot.docs.map((doc) => doc.data());
        const savedProjects = projects as ProjectType[];
        const currentProject = savedProjects.find(
          (p: ProjectType) => p.id === projectId
        );

        if (currentProject) {
          const uploadRef = doc(
            db,
            `users/${
              currentUser?.uid ? currentUser?.uid : unSubscribedUserId
            }/uploads`,
            currentProject.uploadId
          );
          const uploadSnap = await getDoc(uploadRef);
          const upload = uploadSnap.data();

          const projectData = {
            ...currentProject,
            upload: upload,
          };

          setProject(projectData as ProjectType);
          setChat(currentProject.chat || null);
          setTotalProjects(projects.length);
        }
      });

      // Cleanup this component
      return () => unsubscribe();
    };

    fetchData();
  }, []);

  // Save project to local storage whenever it updates
  useEffect(() => {
    const saveProject = () => {
      const projectRef = doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/projects`,
        projectId
      );
      setDoc(projectRef, project, {merge: true});
    };
    if (project) {
      saveProject();
    }
  }, [project, projectId]);

  // Function to update the entire project
  const updateProject = (updatedProject: ProjectType) => {
    setProject(updatedProject);
  };

  // Function to update a specific chat log
  const updateChat = (newChat: ChatLog) => {
    const updatedChat = chat ? [...chat, newChat] : [newChat];
    setChat(updatedChat);
    setProject((prevProject) =>
      prevProject ? {...prevProject, chat: updatedChat} : null
    );
  };

  const [prompt, setPrompt] = React.useState<string>("");
  const [responseLoading, setResponseLoading] = React.useState(false);
  const [responseRendering, setResponseRendering] = React.useState(false);
  const [animatedMessage, setAnimatedMessage] = React.useState("");
  const [aiResponse, setAiResponse] = React.useState("");
  const [chatError, setChatError] = React.useState(false);

  useEffect(() => {
    if (prompt && !chatError) {
      const UpdatedChat = {
        sender: "human",
        text: prompt,
      };
      // set the name & color of the project making it a valid project

      updateChat(UpdatedChat as ChatLog);
      setResponseRendering(true);
      setResponseLoading(true);
      fetchAiResponse(prompt);
    }
  }, [prompt, chatError]);

  // useEffect(() => {
  //   if (prompt && !chatError) {
  //     const UpdatedChat = {
  //       sender: "human",
  //       text: prompt,
  //     };
  //     // set the name & color of the project making it a valid project
  //     if (project && !project.name && prompt.trim() !== "") {
  //       generateNewProject(prompt);
  //     }

  //     updateChat(UpdatedChat as ChatLog);
  //     setResponseRendering(true);
  //     setResponseLoading(true);
  //     fetchAiResponse(prompt);
  //   }
  // }, [prompt, chatError]);

  const fetchAiResponse = async (prompt: string) => {
    try {
      await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          text: project?.upload.text,
          // prompt: `Respond to the following with a formatted response. ${prompt} based on the following text: ${project?.upload.text}`,
        }),
      })
        .then((res) => res.json())

        .then((data) => {
          if (data.success) {
            setAiResponse(data.response);
            setResponseLoading(false);
            setChatError(false);
          } else {
            track("chat-error", {
              message: data.response,
              userId: currentUser?.uid ? currentUser?.uid : unSubscribedUserId,
              projectId: projectId,
              uploadId: project?.uploadId || "null",
              date: new Date().toISOString(),
            });
            setChatError(true);

            setResponseLoading(false);
          }
        });
    } catch (error) {
      setChatError(true);
      setResponseLoading(false);
    }
  };

  useEffect(() => {
    if (!responseLoading && responseRendering && !chatError) {
      setResponseRendering(false);

      const UpdatedChat = {
        sender: "ai",
        text: aiResponse,
      };
      updateChat(UpdatedChat as ChatLog);
      setAnimatedMessage("");
      if (project && !project.name && prompt.trim() !== "") {
        generateNewProject(prompt, aiResponse);
      }
    }
  }, [aiResponse, animatedMessage, responseLoading, chatError, prompt]);

  async function generateNewProject(prompt: string, aiResponse: string) {
    const name = await generateProjectName(prompt, aiResponse);
    const color = generateTagColor();
    ChangeProjectName(name);
    ChangeProjectColor(color);
  }

  async function ChangeProjectName(newName: string) {
    //  update the project name in firestore
    const projectRef = doc(
      db,
      `users/${
        currentUser?.uid ? currentUser?.uid : unSubscribedUserId
      }/projects`,
      projectId
    );
    await setDoc(projectRef, {name: newName}, {merge: true});
  }

  async function ChangeProjectColor(color: string) {
    //  update the project color in firestore
    const projectRef = doc(
      db,
      `users/${
        currentUser?.uid ? currentUser?.uid : unSubscribedUserId
      }/projects`,
      projectId
    );
    await setDoc(projectRef, {color: color}, {merge: true});
  }

  async function generateProjectName(prompt: string, aiResponse: string) {
    const response = await fetch("/api/name-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        response: aiResponse,
      }),
    }).then((res) => res.json());

    return response.response;
  }

  const generateTagColor = () => {
    const tagColors = ["#358EF4", "#4AAB67", "#9164F0", "#E5560A", "#ED8D16"];
    // Use modulus operator to loop through tagColors
    const colorIndex = (totalProjects || 2 - 1) % tagColors.length;
    const color = tagColors[colorIndex];

    return color;
  };

  const values = {
    prompt,
    setPrompt,
    projectId,
    project,
    chat,
    updateProject,
    updateChat,
    responseRendering,
    animatedMessage,
    responseLoading,
    chatError,
    setChatError,
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatContext;

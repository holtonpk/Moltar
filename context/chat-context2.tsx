"use client";

import React, {useContext, createContext, useEffect, useState} from "react";
import {
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  query,
  collection,
} from "firebase/firestore";

import {db} from "@/config/firebase";

import {ProjectType, ChatLog} from "@/types";

const ChatContext = createContext<ChatContextType | null>(null);

const LOCAL_STORAGE_KEY = "userProjects";
import {useAuth} from "@/context/user-auth";

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
}

export const ChatProvider2 = ({children, projectId}: Props) => {
  const [totalProjects, setTotalProjects] = useState<number>();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [chat, setChat] = useState<ChatLog[] | null>(null);

  const {currentUser, unSubscribedUserId} = useAuth()!;

  useEffect(() => {
    const q = query(
      collection(db, `users/${currentUser?.uid || unSubscribedUserId}/projects`)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projects = querySnapshot.docs.map((doc) => doc.data());
      const savedProjects = projects as ProjectType[];
      const currentProject = savedProjects.find(
        (p: ProjectType) => p.id === projectId
      );
      setProject(currentProject as ProjectType);
      setChat(currentProject?.chat || null);
      setTotalProjects(projects.length);
    });

    // Cleanup this component
    return () => unsubscribe();
  }, []);

  // Save project to local storage whenever it updates
  useEffect(() => {
    const saveProject = () => {
      const projectRef = doc(
        db,
        `users/${currentUser?.uid || unSubscribedUserId}/projects`,
        projectId
      );
      setDoc(projectRef, project, {merge: true}).then(() => {
        console.log("Document successfully written!");
      });
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
  const [responseLoading, setResponseLoading] = React.useState(true);
  const [responseRendering, setResponseRendering] = React.useState(false);
  const [animatedMessage, setAnimatedMessage] = React.useState("");
  const [aiResponse, setAiResponse] = React.useState("");

  useEffect(() => {
    if (prompt) {
      const UpdatedChat = {
        sender: "human",
        text: prompt,
      };
      // set the name & color of the project making it a valid project
      if (project && !project.name && prompt.trim() !== "") {
        generateNewProject(prompt);
      }

      updateChat(UpdatedChat as ChatLog);
      setResponseRendering(true);
      setResponseLoading(true);
      fetchAiResponse(prompt);
    }
  }, [prompt]);

  const fetchAiResponse = async (prompt: string) => {
    // simulate api delay
    setTimeout(() => {
      setResponseLoading(false);
    }, 2000);

    const response = {
      sender: "ai",
      text: `This is a placeholder for the actual AI response to the prompt: ${prompt}`,
    };
    setAiResponse(response.text);
  };

  useEffect(() => {
    if (!responseLoading && responseRendering) {
      const animationInterval = setInterval(() => {
        if (aiResponse.length > animatedMessage.length) {
          setAnimatedMessage(
            (prevMessage) => prevMessage + aiResponse[animatedMessage.length]
          );
        } else {
          clearInterval(animationInterval);
          setResponseRendering(false);

          const UpdatedChat = {
            sender: "ai",
            text: aiResponse,
          };
          updateChat(UpdatedChat as ChatLog);
          setAnimatedMessage("");
        }
      }, 20); // Adjust the speed of the animation here (milliseconds)

      return () => clearInterval(animationInterval);
    }
  }, [aiResponse, animatedMessage, responseLoading]);

  const generateNewProject = (prompt: string) => {
    const name = generateProjectName(prompt);
    const color = generateTagColor();
    ChangeProjectName(name);
    ChangeProjectColor(color);
  };

  async function ChangeProjectName(newName: string) {
    //  update the project name in firestore
    const projectRef = doc(
      db,
      `users/${currentUser?.uid || unSubscribedUserId}/projects`,
      projectId
    );
    await setDoc(projectRef, {name: newName}, {merge: true}).then(() => {
      console.log("Document successfully updated!");
    });
  }

  async function ChangeProjectColor(color: string) {
    //  update the project color in firestore
    const projectRef = doc(
      db,
      `users/${currentUser?.uid || unSubscribedUserId}/projects`,
      projectId
    );
    await setDoc(projectRef, {color: color}, {merge: true}).then(() => {
      console.log("Document successfully updated!");
    });
  }

  const generateProjectName = (prompt: string) => {
    // this will be on the server to generate a relevant name
    return `${project?.upload.title.slice(0, 10)} - ${prompt.slice(0, 10)}`;
  };

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
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatContext;

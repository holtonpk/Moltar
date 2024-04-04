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
  const [responseLoading, setResponseLoading] = React.useState(false);
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
    console.log(
      "fetching ai response",
      // `Respond to the following with a formatted response. Apply the following prompt: ${prompt} - to this text : ${project?.upload.text}`
      `${prompt} based on the following text: ${project?.upload.text}`
    );
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // prompt: `Respond to the following with a formatted response. Apply the following prompt: ${prompt} - to this text  : ${project?.upload.text}`,
        prompt: `Respond to the following with a formatted response. ${prompt} based on the following text: ${project?.upload.text}`,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        setAiResponse(data.response);
        setResponseLoading(false);
      });
    // setAiResponse(
    //   "The document provides an overview of the importance of time management in helping individuals achieve their goals and lead a more productive life. It highlights how effective time management can lead to increased efficiency, reduced stress levels, and improved overall well-being. The document emphasizes the significance of setting priorities, creating a to-do list, and practicing self-discipline to make the most of one's time. It also discusses the benefits of breaking tasks into smaller, more manageable parts and incorporating breaks into a daily routine. Ultimately, the document serves as a guide to help readers optimize their time and reach their full potential."
    // );
    // setResponseLoading(false);
  };

  useEffect(() => {
    if (!responseLoading && responseRendering) {
      // const animationInterval = setInterval(() => {
      //   if (aiResponse.length > animatedMessage.length) {
      //     setAnimatedMessage(
      //       (prevMessage) => prevMessage + aiResponse[animatedMessage.length]
      //     );
      //   } else {
      //     clearInterval(animationInterval);
      //     setResponseRendering(false);

      //     const UpdatedChat = {
      //       sender: "ai",
      //       text: aiResponse,
      //     };
      //     updateChat(UpdatedChat as ChatLog);
      //     setAnimatedMessage("");
      //   }
      // }, 10); // Adjust the speed of the animation here (milliseconds)

      // return () => clearInterval(animationInterval);
      setResponseRendering(false);

      const UpdatedChat = {
        sender: "ai",
        text: aiResponse,
      };
      updateChat(UpdatedChat as ChatLog);
      setAnimatedMessage("");
    }
  }, [aiResponse, animatedMessage, responseLoading]);

  async function generateNewProject(prompt: string) {
    const name = await generateProjectName(prompt);
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
    await setDoc(projectRef, {name: newName}, {merge: true}).then(() => {
      console.log("Document successfully updated!");
    });
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
    await setDoc(projectRef, {color: color}, {merge: true}).then(() => {
      console.log("Document successfully updated!");
    });
  }

  async function generateProjectName(prompt: string) {
    // this will be on the server to generate a relevant name
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Generate a short, descriptive name (40 characters max) for a chat session that is based on the given prompt '${prompt}' and relates to the project ${project?.upload.text}. The name should be concise, memorable, and accurately reflect the discussion's focus on the project. It should engage the target audience of college students and highlight key aspects of the conversation related to the project's theme or goal. don't put it in quotes`,
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
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
};

export default ChatContext;

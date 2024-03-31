"use client";

import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  use,
  useRef,
} from "react";
import {ProjectType} from "@/types";
import {db} from "@/config/firebase";
import {
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  query,
  collection,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import {useAuth} from "@/context/user-auth";

const ProjectsContext = createContext<ProjectsContextType | null>(null);

interface ProjectsContextType {
  projects: ProjectType[];

  setProjects: (projects: ProjectType[]) => void;

  ChangeProjectName: (id: string, newName: string) => void;
  ChangeProjectColor: (id: string, color: string) => void;
  DeleteProject: (id: string) => void;
  displayedProjects: ProjectType[];
  loading: boolean;
  addingNewAnimation: boolean;
  setAddingNewAnimation: (adding: boolean) => void;
}

export function useProjects() {
  return useContext(ProjectsContext);
}

interface Props {
  children?: React.ReactNode;
}

export const ProjectsProvider = ({children}: Props) => {
  // this is for displaying the projects only

  const {currentUser, unSubscribedUserId} = useAuth()!;

  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [addingNewAnimation, setAddingNewAnimation] = useState<boolean>(false);

  // fetch all projects from local storage

  const projectsRef = useRef<ProjectType[]>([]);
  const displayedProjectsRef = useRef<ProjectType[]>([]);

  useEffect(() => {
    // console.log("fetching projects", currentUser?.uid, unSubscribedUserId);
    const q = query(
      collection(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/projects`
      ),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = querySnapshot.docs.map((doc) => doc.data());
      const savedProjects = projectsData as ProjectType[];
      const dProjects = savedProjects.filter((project: ProjectType) => {
        return project.name && project.color && project.uploadId;
      });

      if (
        dProjects.length > displayedProjectsRef.current.length &&
        projectsRef.current.length > 1
      ) {
        setAddingNewAnimation(true);
      }

      setProjects(savedProjects);
      projectsRef.current = savedProjects;
      setDisplayedProjects(dProjects as ProjectType[]);
      displayedProjectsRef.current = dProjects as ProjectType[];
      setLoading(false);
    });

    // Cleanup this component
    return () => unsubscribe();
  }, [currentUser]);

  async function ChangeProjectName(id: string, newName: string) {
    //  update the project name in firestore
    const projectRef = doc(
      db,
      `users/${currentUser?.uid || unSubscribedUserId}/projects`,
      id
    );
    await setDoc(projectRef, {name: newName}, {merge: true}).then(() => {
      console.log("Document successfully updated!");
    });
  }

  async function ChangeProjectColor(id: string, color: string) {
    //  update the project color in firestore
    const projectRef = doc(
      db,
      `users/${currentUser?.uid || unSubscribedUserId}/projects`,
      id
    );
    await setDoc(projectRef, {color: color}, {merge: true}).then(() => {
      console.log("Document successfully updated!");
    });
  }

  //  delete the project from firestore
  async function DeleteProject(id: string) {
    await deleteDoc(
      doc(db, `users/${currentUser?.uid || unSubscribedUserId}/projects`, id)
    ).then(() => {
      console.log("Document successfully deleted!");
    });
  }

  const values = {
    projects,
    ChangeProjectName,
    setProjects,
    ChangeProjectColor,
    DeleteProject,
    displayedProjects,
    loading,
    addingNewAnimation,
    setAddingNewAnimation,
  };

  return (
    <ProjectsContext.Provider value={values}>
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsContext;

import {Timestamp, FieldValue} from "firebase/firestore";

export type UploadType = {
  title: string;
  id: string;
  path: string;
};

export interface ProjectType {
  id: string;
  name: string;
  color: string;
  uploadId: string;
  upload: UploadType;
  chat: ChatLog[] | null;
  createdAt: Timestamp | FieldValue; // Allow both types
}

export type ChatLog = {
  sender: "human" | "ai";
  text: string;
};

export type ChatObject = {
  name: string;
  color: string;
  id: string;
  chatLog: ChatLog[];
  documentId: string;
};

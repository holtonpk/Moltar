import {Timestamp, FieldValue} from "firebase/firestore";
import {User as FirebaseUser} from "firebase/auth";
import {uploadTypes} from "@/config/data";

export type UploadType = PDFUpload | UrlScrapeUpload;

export type PDFUpload = {
  type: (typeof uploadTypes)[number]["value"];
  id: string;
  title: string;
  path: string;
  text: string;
};

export type UrlScrapeUpload = {
  type: (typeof uploadTypes)[number]["value"];
  id: string;
  title: string;
  fav: string;
  url: string;
  text: string;
};

export type LocalUploadType = {
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

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  monthly_price: Price;
  annual_price: Price;
  features: feature[];
  firebaseRole: string;
}

export interface UserData extends FirebaseUser {
  firstName: string;
  lastName: string;
  photoURL: string;
  stripeId: string;
  userPlan: PlansType | undefined;
  welcome_intro: boolean;
}

export interface PlansType {
  tier: number;
  COLLECTION_LIMIT: ToolAccessConfig;
  PRODUCT_TRACK_LIMIT: ToolAccessConfig;
  DAILY_PRODUCT_SEARCH_LIMIT: ToolAccessConfig;
}

export type ScrapeResult = {
  success: boolean;
  text: string;
  title: string;
  favicon: string;
};

import React from "react";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Chat - Moltar",
  description: "Upload and ask away, Moltar will do the rest!",
  image: "http://localhost:3000/image/favicon.ico",
});

const Layout = ({children}: {children: React.ReactNode}) => {
  return <> {children}</>;
};

export default Layout;

import React from "react";
import {Uploads} from "./uploads";
import {constructMetadata} from "@/lib/utils";
import MobileNav from "../../components/navbar/mobile-nav";

export const metadata = constructMetadata({
  title: "Upload - Moltar",
  description: "Upload and ask away, Moltar will do the rest!",
  image: "image/favicon.ico",
});
const Page = () => {
  return (
    <>
      <MobileNav />
      <Uploads />
    </>
  );
};

export default Page;

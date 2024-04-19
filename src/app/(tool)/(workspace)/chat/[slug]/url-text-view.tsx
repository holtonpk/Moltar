import React from "react";
import {UrlScrapeUpload} from "@/types";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {LinkButton} from "@/components/ui/link";
import {useAuth} from "@/context/user-auth";
import {db} from "@/config/firebase";
import {doc, setDoc} from "firebase/firestore";

const UrlTextView = ({
  upload,
  projectId,
}: {
  upload: UrlScrapeUpload;
  projectId: string;
}) => {
  const {currentUser, unSubscribedUserId} = useAuth()!;

  const updateText = async (text: string) => {
    const docRef = doc(
      db,
      `users/${currentUser?.uid || unSubscribedUserId}/uploads`,
      upload.id
    );

    await setDoc(docRef, {text}, {merge: true});

    const projectRef = doc(
      db,
      `users/${currentUser?.uid || unSubscribedUserId}/projects`,
      projectId
    );
    await setDoc(projectRef, {text}, {merge: true});
  };

  const [textValue, setTextValue] = React.useState(upload.text);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="w-full flex justify-between p-1">
        <LinkButton
          href={"/upload"}
          variant="ghost"
          className="text-theme-blue hover:text-theme-blue/70"
        >
          <Icons.chevronLeft />
          back
        </LinkButton>
        {/* <Button variant="ghost">
          <Icons.ellipsis />
        </Button> */}
      </div>
      <div className="flex flex-col gap-4 w-full p-6 px-8 pt-0 flex-grow">
        <div className="w-full  font-bold text-xl">{upload.title}</div>
        <div className="grid grid-cols-[48px_1fr] items-center gap-2 bg-background p-2 rounded-md border border-border">
          <img src={upload.fav} className="w-12 h-12 rounded-md" />
          <Link
            href={upload.url || ""}
            target={"_blank"}
            className="w-full p-2 flex flex-row items-center underline hover:opacity-70 overflow-hidden text-ellipsis"
          >
            {upload.url}
          </Link>
        </div>
        <Textarea
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
            updateText(e.target.value);
          }}
          className="flex-grow  "
          style={{resize: "none"}}
        >
          {upload.text}
        </Textarea>
      </div>
    </div>
  );
};

export default UrlTextView;

export const UrlTextViewMobile = ({upload}: {upload: UrlScrapeUpload}) => {
  return (
    <div className="w-full p-4 flex flex-col gap-4 bg-primary/5 ">
      <LinkButton
        href={"/upload"}
        variant="ghost"
        className=" z-20 text-theme-blue hover:text-theme-blue/60 p-0 w-fit"
      >
        <Icons.chevronLeft className="h-6 w-6" />
        back to uploads
      </LinkButton>
      <div className="w-full   font-bold text-sm">{upload.title}</div>

      <div className="grid grid-cols-[48px_1fr] items-center gap-2 bg-background p-2 rounded-md border border-border">
        <img src={upload.fav} className="w-12 h-12 rounded-md" />
        <Link
          href={upload.url || ""}
          target={"_blank"}
          className="w-full p-2 flex flex-row items-center underline hover:opacity-70  overflow-hidden"
        >
          {upload.url}
        </Link>
      </div>
    </div>
  );
};

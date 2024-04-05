"use client";
import {useState, useCallback, useEffect, useRef} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {useAuth} from "@/context/user-auth";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {db, app} from "@/config/firebase";
import {YoutubeScrapeResult, YoutubeScrapeUpload} from "@/types";

import {useRouter} from "next/navigation";

export const YoutubeScrape = ({
  open,
  setIsOpen,
  url,
  scrapeResult,
  goBackFunction,
}: {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  url: string;
  scrapeResult: YoutubeScrapeResult | undefined;
  goBackFunction: () => void;
}) => {
  const [title, setTitle] = useState(scrapeResult?.title);
  const [text, setText] = useState(scrapeResult?.text);

  const {currentUser, unSubscribedUserId} = useAuth()!;

  const [savingIsLoading, setSavingIsLoading] = useState(false);

  async function saveAsUpload() {
    if (!scrapeResult) return;
    const file = {
      id: scrapeResult.id,
      title: title,
      type: "youtube",
      text: text,
      url: url,
      thumbnail: scrapeResult?.thumbnail,
    };
    await setDoc(
      doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/uploads`,
        scrapeResult.id
      ),
      file
    );
    return file as YoutubeScrapeUpload;
  }

  useEffect(() => {
    setTitle(scrapeResult?.title);
    setText(scrapeResult?.text);
  }, [scrapeResult]);

  const Router = useRouter();

  const [creatingIsLoading, setCreatingIsLoading] = useState(false);

  const createNewProject = async () => {
    if (!scrapeResult) return;
    setCreatingIsLoading(true);
    const file = await saveAsUpload();
    if (!file) return;
    const id = Math.random().toString(36).substring(7);
    await setDoc(
      doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/projects`,
        id
      ),
      {
        id: id,
        uploadId: file.id,
        chat: null,
        upload: file,
        createdAt: serverTimestamp(),
      }
    );
    Router.push(`/chat/${id}`);
    setCreatingIsLoading(false);
  };

  return (
    <>
      {url && scrapeResult && (
        <Dialog open={open} onOpenChange={setIsOpen}>
          <DialogContent className="">
            {scrapeResult.success ? (
              <>
                <DialogHeader>
                  <DialogTitle>Here&apos;s the Youtube video</DialogTitle>
                  <DialogDescription>
                    Create a project with this video or save it as an upload for
                    later
                  </DialogDescription>
                </DialogHeader>
                <Link
                  target="_blank"
                  href={url}
                  className="w-full group relative overflow-hidden aspect-[16/9] border border-border rounded-md"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${scrapeResult.id}`}
                    className="w-full h-full absolute top-0 left-0 z-20"
                  />
                  <img
                    src={scrapeResult.thumbnail}
                    className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  />
                  {/* <div className="absolute  bottom-0 w-full h-fit bg-card/40 blurBack z-20 grid grid-cols-[24px_1fr] gap-2 border-t border-border items-center p-2">
                      <Icons.Youtube className="h-6 w-6 mr-2" />
                      <span className="font-bold  group-hover:underline">
                        {scrapeResult.title}
                      </span>
                    </div> */}
                </Link>

                <DialogFooter className="gap-4 md:gap-0">
                  <Button onClick={goBackFunction} variant={"ghost"}>
                    <Icons.arrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Upload
                  </Button>
                  <Button
                    onClick={() => {
                      setSavingIsLoading(true);
                      saveAsUpload();
                      setSavingIsLoading(false);

                      setIsOpen(false);
                    }}
                    className="bg-theme-blue hover:bg-theme-blue/70 text-white"
                  >
                    Save as Upload
                    {savingIsLoading ? (
                      <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Icons.save className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      createNewProject();
                    }}
                    className="bg-theme-purple hover:bg-theme-purple/70 text-white"
                  >
                    Create Project
                    {creatingIsLoading ? (
                      <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Icons.arrowRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>
                    Sorry we were&apos;nt able to find any text from{" "}
                    <Link
                      href={url}
                      className="underline text-theme-blue hover:text-theme-blue/60"
                      target="_blank"
                    >
                      this link
                    </Link>
                  </DialogTitle>
                  <DialogDescription>
                    We recommend you copy and paste the text from the website
                    manually
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give this project a title"
                />
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{resize: "none"}}
                  placeholder="Manually copy and paste text here"
                  className="h-[300px] overflow-scroll border border-border rounded-md p-2"
                ></Textarea>
                <DialogFooter className="gap-4 md:gap-0">
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    variant={"ghost"}
                  >
                    <Icons.arrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Upload
                  </Button>
                  <Button
                    onClick={() => {
                      saveAsUpload();
                      setIsOpen(false);
                    }}
                    className="bg-theme-blue hover:bg-theme-blue/70 text-white mt-4"
                  >
                    Save as Upload
                    <Icons.save className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="bg-theme-purple hover:bg-theme-purple/70 text-white"
                  >
                    Create Project
                    <Icons.arrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

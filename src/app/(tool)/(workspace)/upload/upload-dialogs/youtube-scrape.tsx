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
import Image from "next/image";
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
      createdAt: serverTimestamp(),
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
          <DialogContent className=" min-w-fit">
            {scrapeResult.success ? (
              <>
                <DialogHeader>
                  <DialogTitle>Here&apos;s the Youtube video</DialogTitle>
                  <DialogDescription>
                    Create a project with this video or save it as an upload for
                    later
                  </DialogDescription>
                </DialogHeader>
                <div className="h-[350px]  group relative overflow-hidden aspect-[16/9] border border-border rounded-md bg-background ">
                  <iframe
                    src={`https://www.youtube.com/embed/${scrapeResult.id}`}
                    className="relative z-20 w-full h-full"
                  />
                  {/* <Image
                    src={scrapeResult.thumbnail}
                    alt={scrapeResult.title}
                    className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    sizes={
                      "(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                    }
                    fill
                    priority={true}
                  /> */}
                </div>

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
                />
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

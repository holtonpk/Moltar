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
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";

import Link from "next/link";
import {useAuth} from "@/context/user-auth";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {db, app} from "@/config/firebase";
import {UrlScrapeResult, UrlScrapeUpload} from "@/types";

import {useRouter} from "next/navigation";

export const WebsiteScrape = ({
  open,
  setIsOpen,
  url,
  scrapeResult,
  goBackFunction,
}: {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  url: string;
  scrapeResult: UrlScrapeResult | undefined;
  goBackFunction: () => void;
}) => {
  const [title, setTitle] = useState(scrapeResult?.title);
  const [text, setText] = useState(scrapeResult?.text);

  const {currentUser, unSubscribedUserId} = useAuth()!;

  const [savingIsLoading, setSavingIsLoading] = useState(false);

  async function saveAsUpload() {
    const id = Math.random().toString(36).substring(7);
    const file = {
      id: id,
      title: title,
      type: "url",
      text: text,
      url: url,
      fav: scrapeResult?.favicon,
    };
    await setDoc(
      doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/uploads`,
        id
      ),
      file
    );
    return file as UrlScrapeUpload;
  }

  useEffect(() => {
    setTitle(scrapeResult?.title);
    setText(scrapeResult?.text);
  }, [scrapeResult]);

  const Router = useRouter();

  const [creatingIsLoading, setCreatingIsLoading] = useState(false);

  const createNewProject = async () => {
    setCreatingIsLoading(true);
    const file = await saveAsUpload();
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
                  <DialogTitle>Here&apos;s the text we found</DialogTitle>
                  <DialogDescription>
                    If it looks good you can start a project feel free to edit
                    it
                  </DialogDescription>
                </DialogHeader>
                <Link
                  href={url}
                  className="grid grid-cols-[24px_1fr] group gap-2 max-w-full p-4 bg-background border border-border rounded-md items-center"
                  target="_blank"
                >
                  <img
                    src={scrapeResult.favicon}
                    alt="favicon"
                    className="h-6 w-6 "
                  />
                  <span className="w-full whitespace-nowrap text-ellipsis overflow-hidden group-hover:opacity-65">
                    {url}
                  </span>
                </Link>
                <div className=" flex  items-center">{title}</div>
                <Textarea
                  style={{resize: "none"}}
                  className="h-[300px] overflow-scroll border border-border rounded-md p-2"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                />

                <DialogFooter className="gap-4 md:gap-0 max-w-full">
                  <Button onClick={goBackFunction} variant={"ghost"}>
                    <Icons.arrowRight className="h-4 w-4 rotate-180" />
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
                  className="h-[300px] w-full overflow-scroll border border-border rounded-md p-2"
                ></Textarea>
                <DialogFooter className="gap-4 md:gap-0 ">
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    variant={"ghost"}
                  >
                    <Icons.arrowRight className="h-4 w-4  rotate-180" />
                    Back to Upload
                  </Button>
                  <Button
                    onClick={() => {
                      saveAsUpload();
                      setIsOpen(false);
                    }}
                    className="bg-theme-blue hover:bg-theme-blue/70 text-white"
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

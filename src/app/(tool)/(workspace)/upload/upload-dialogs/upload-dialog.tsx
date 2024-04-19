"use client";
import {useState} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";

import {UrlScrapeResult, YoutubeScrapeResult} from "@/types";
import {useToast} from "@/components/ui/use-toast";
import {YoutubeScrape} from "./youtube-scrape";
import {WebsiteScrape} from "./website-scrape";
import {FileInput} from "./file-input";
import MaxSizeDialog, {MaxSizeMessage} from "./max-size";

export const UploadDialog = ({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const [scraping, setScraping] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  // url scrape states
  const [scrapeText, setScrapeText] = useState<UrlScrapeResult>();
  const [openScrapeDialog, setOpenScrapeDialog] = useState(false);

  // youtube scrape states
  const [openYoutubeDialog, setOpenYoutubeDialog] = useState(false);
  const [youtubeScrape, setYoutubeScrape] = useState<YoutubeScrapeResult>();

  // max size dialog states
  const [openMaxSizeDialog, setOpenMaxSizeDialog] = useState(false);
  const [maxSizeMessage, setMaxSizeMessage] = useState<MaxSizeMessage>({
    title: "",
    description: "",
  });

  const {toast} = useToast();

  const scrapeUrl = async () => {
    try {
      setScraping(true);

      const url = new URL(urlInput);
      let scrapeResponse = null;

      if (url.hostname === "www.youtube.com") {
        scrapeResponse = await fetch("/api/scrape-youtube", {
          method: "POST",
          body: JSON.stringify({url: urlInput}),
        }).then((res) => res.json());

        if (scrapeResponse.text) {
          // const tokenResponse = await fetch("/api/get-tokens", {
          //   method: "POST",
          //   body: JSON.stringify({str: scrapeResponse.text}),
          // }).then((res) => res.json());

          // if (tokenResponse.isAcceptable) {
          setYoutubeScrape({
            success: true,
            text: scrapeResponse.text,
            id: scrapeResponse.id,
            title: scrapeResponse.title,
            thumbnail: scrapeResponse.thumbnail,
          });
          setOpenYoutubeDialog(true);
          // } else {
          //   setMaxSizeMessage({
          //     title: "Sorry this video is too large for Moltar 😔 ",
          //     description:
          //       "Try uploading a shorter video or clips from the video",
          //   });
          //   setOpenMaxSizeDialog(true);
          // }
        } else {
          toast({
            title: "Error",
            description: "We couldn't find any text from this video",
            variant: "destructive",
          });
        }
      } else {
        scrapeResponse = await fetch("/api/scrape-text", {
          method: "POST",
          body: JSON.stringify({url: urlInput}),
        }).then((res) => res.json());

        if (scrapeResponse.text) {
          const tokenResponse = await fetch("/api/get-tokens", {
            method: "POST",
            body: JSON.stringify({str: scrapeResponse.text}),
          }).then((res) => res.json());

          if (tokenResponse.isAcceptable) {
            setScrapeText({
              success: true,
              text: scrapeResponse.text,
              title: scrapeResponse.title,
              favicon: scrapeResponse.favicon,
            });
            setOpenScrapeDialog(true);
          } else {
            setMaxSizeMessage({
              title: "Sorry this website has too much for Moltar to read 😔 ",
              description: "Try using a smaller page",
            });
            setOpenMaxSizeDialog(true);
          }
        } else {
          setScrapeText({
            success: false,
            text: "",
            title: "",
            favicon:
              "https://firebasestorage.googleapis.com/v0/b/moltar-bc665.appspot.com/o/website.png?alt=media&token=19ac6d99-82e9-469d-badb-bdf0c39f626f",
          });
          setOpenScrapeDialog(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setScraping(false);
      setIsOpen(false);
    }
  };

  const goBackFunction = () => {
    setOpenScrapeDialog(false);
    setOpenYoutubeDialog(false);
    setOpenMaxSizeDialog(false);
    setIsOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 ">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>File Upload</DialogTitle>
            <DialogDescription>
              Upload a PDF file or enter a URL to start using Moltar
            </DialogDescription>
          </DialogHeader>
          <div className=" p-4 flex flex-col gap-3 md:gap-6">
            <FileInput setIsOpen={setIsOpen} />

            <Button
              onClick={() => document.getElementById("selectedFile")?.click()}
              className="text-primary text-sm bg-transparent  w-full bg-gradient-to-l from-theme-purple via-theme-green to-theme-blue p-[2px] sm:hidden"
            >
              <span className="bg-background md:bg-card md:hover:bg-card/80 text-primary w-full h-full rounded-md flex items-center justify-center hover:opacity-90">
                Click to upload a pdf
              </span>
            </Button>
            <div className="w-[20%] mx-auto grid grid-cols-[1fr_25px_1fr] items-center">
              <span className="w-full h-[1px] bg-primary/60"></span>
              <span className="w-full flex justify-center">or</span>
              <span className="w-full h-[1px] bg-primary/60"></span>
            </div>
            <div className="w-full relative h-fit  bg-gradient-to-l from-theme-purple via-theme-green to-theme-blue p-[2px] rounded-md ">
              <Input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    scrapeUrl();
                  }
                }}
                value={urlInput}
                placeholder="Enter A URL"
                className="border-none rounded-md focus-visible:ring-theme-blue focus-visible:border-transparent pr-10"
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button
                onClick={scrapeUrl}
                className="rounded-full absolute top-1/2 right-2 -translate-y-1/2  aspect-square h-fit w-fit p-1 bg-theme-purple hover:bg-theme-purple/70 "
              >
                {scraping ? (
                  <Icons.loader className="h-4 w-4 text-white animate-spin" />
                ) : (
                  <Icons.arrowRight className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <WebsiteScrape
        open={openScrapeDialog}
        setIsOpen={setOpenScrapeDialog}
        scrapeResult={scrapeText}
        url={urlInput}
        goBackFunction={goBackFunction}
      />
      <YoutubeScrape
        open={openYoutubeDialog}
        setIsOpen={setOpenYoutubeDialog}
        scrapeResult={youtubeScrape}
        goBackFunction={goBackFunction}
        url={urlInput}
      />
      <MaxSizeDialog
        open={openMaxSizeDialog}
        setIsOpen={setOpenMaxSizeDialog}
        goBackFunction={goBackFunction}
        maxSizeMessage={maxSizeMessage}
        setMaxSizeMessage={setMaxSizeMessage}
      />
    </>
  );
};

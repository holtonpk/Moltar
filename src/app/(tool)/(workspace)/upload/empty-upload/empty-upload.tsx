import React, {useEffect, useCallback, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {useUploads} from "@/context/upload-context";
import {useToast} from "@/components/ui/use-toast";
import {UrlScrapeResult, YoutubeScrapeResult} from "@/types";
import {LucideProps} from "lucide-react";
import {WebsiteScrape} from "../upload-dialogs/website-scrape";
import {YoutubeScrape} from "../upload-dialogs/youtube-scrape";

import MaxSizeDialog, {MaxSizeMessage} from "../upload-dialogs/max-size";

export const EmptyUploadList = () => {
  const {
    uploadFile,
    setUploadedFile,
    setShowDialog,
    setUploadedFileLocal,
    setIsLoadingUpload,
  } = useUploads()!;
  // const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);
  const {toast} = useToast();

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files); // Convert FileList to an array
      setUploadedFileLocal(files[0]);
      setIsLoadingUpload(true);

      for (let file of files) {
        // if (file.size > 10000000) {
        //   setMaxSizeMessage({
        //     title: "Sorry this file is too large for Moltar 😔 ",
        //     description: "Try uploading a file less than 10MB",
        //   });
        //   setOpenMaxSizeDialog(true);
        // } else {
        const fileData = await uploadFile(file);
        setUploadedFile(fileData);
        setShowDialog(true);
        // }
      }
    }
  };
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
          // const tokenResponse = await fetch("/api/get-tokens", {
          //   method: "POST",
          //   body: JSON.stringify({str: scrapeResponse.text}),
          // }).then((res) => {
          //   console.log(res.json());
          //   return res.json();
          // });

          // if (tokenResponse.isAcceptable) {
          setScrapeText({
            success: true,
            text: scrapeResponse.text,
            title: scrapeResponse.title,
            favicon: scrapeResponse.favicon,
          });
          setOpenScrapeDialog(true);
          // } else {
          //   setMaxSizeMessage({
          //     title: "Sorry this website has too much for Moltar to read 😔 ",
          //     description: "Try using a smaller page",
          //   });
          //   setOpenMaxSizeDialog(true);
          // }
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
    }
  };

  const goBackFunction = () => {
    setOpenYoutubeDialog(false);
    setOpenScrapeDialog(false);
    setOpenMaxSizeDialog(false);
  };

  return (
    <>
      <div className="bg-card flex-col w-full gap-4 items-center  pt-20   h-full p-6 shadow-2xl md:flex hidden relative z-10">
        <div className="  border-border md:w-fit  rounded-lg  flex flex-col w-full   gap-6 items-center bg-card">
          <span className="font-bold text-3xl md:text-5xl mb-6 poppins-bold ">
            Let&apos;s get started!
          </span>
          {/* <span className="font-re text-xl">
            First you&apos;ll need to upload a resource
          </span> */}
          <div className="w-full md:w-fit border-theme-blue shadow-lg rounded-md relative">
            <div className="flex items-center flex-col gap-2 p-10 rounded-lg border border-border dark:border-white/10  dark:bg-white/5">
              <div className="flex items-center justify-center  rounded-lg bg-theme-blue/20 p-6">
                <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
              </div>
              <h1 className="text- text-2xl font-bold mt-2 whitespace-nowrap md:block hidden poppins-regular">
                Drag & and drop a PDF file here
              </h1>
              <h1 className="text- text-2xl font-bold mt-2 whitespace-nowrap md:hidden text-center ">
                Upload your PDF files <br /> to get started
              </h1>
              {/* <span className="md:block hidden">or</span> */}
              <Button
                onClick={() => document.getElementById("selectedFile")?.click()}
                className="text-primary text-sm bg-transparent  w-fit bg-gradient-to-l from-theme-purple via-theme-green to-theme-blue p-0 mt-4"
              >
                <span className="poppins-regular bg-theme-blue hover:bg-card/80 text-white px-6 w-fit h-full rounded-md flex items-center justify-center hover:opacity-90">
                  Click to browse
                </span>
              </Button>
              <input
                multiple
                id="selectedFile"
                type="file"
                accept=".pdf"
                onChange={onFileChange}
                style={{display: "none"}}
              />
            </div>

            <div className="hidden md:flex absolute -left-10  flex-col gap-0 items-end top-[40%] -translate-y-1/2 -translate-x-full text-theme-green">
              <span className="font-bold text-xl hand-font">
                Moltar can read any pdf for you! <br /> Just upload your pdf and
                <br />
                start leveraging moltar
              </span>
              <Arrow1 className="absolute  bottom-4 translate-y-full h-24 w-24  fill-theme-green rotate-[150deg] scale-y-[-1]" />
            </div>
          </div>

          <div className="w-[20%] mx-auto grid grid-cols-[1fr_25px_1fr] items-center">
            <span className="w-full h-[1px] bg-primary/30"></span>
            <span className="w-full flex justify-center font-bold poppins-bold">
              or
            </span>
            <span className="w-full h-[1px] bg-primary/30"></span>
          </div>
          <div className="w-full shadow-lg relative h-fit  border border-border dark:border-white/10    rounded-md ">
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  scrapeUrl();
                }
              }}
              value={urlInput}
              placeholder="Enter A URL"
              className="border-none text-xl poppins-regular p-6 rounded-md bg-card dark:bg-white/5 focus-visible:ring-theme-blue focus-visible:border-transparent pl-3 pr-12"
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button
              onClick={scrapeUrl}
              className={`rounded-full absolute top-1/2 right-2  -translate-y-1/2  aspect-square h-fit w-fit p-1 bg-theme-blue hover:bg-theme-blue/70 
              ${urlInput === "" ? "flex" : "flex"}
              
              `}
            >
              {scraping ? (
                <Icons.loader className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Icons.arrowRight className="h-6 w-6 text-white" />
              )}
            </Button>

            <div className="absolute   -right-10 hidden md:flex flex-col gap-0 items-start bottom-0 translate-x-full text-theme-purple">
              <span className="font-bold text-center text-xl hand-font">
                Some ideas for URLs:
                <br />
                - News article
                <br />- Blog post
                <br />- Youtube video
              </span>
              <Arrow2 className=" h-24 w-24  fill-theme-purple rotate-[110deg]  scale-y-[1]" />
            </div>
          </div>
          {/* <Button disabled className="w-full bg-theme-blue text-white" size="lg">
            Start using Moltar
          </Button> */}
        </div>

        {/* <div className=" z-40 right-4 bottom-4 absolute flex flex-col items-end gap-4">
            {uploadQueue.map((file, i) => (
              <div
                key={i}
                className="h-fit p-4 px-6 w-fit flex items-center gap-4 rounded-full  bg-theme-blue "
              >
                <Icons.spinner className="h-5 w-5 animate-spin text-white" />
                <span className="text-white font-bold">{file.name}</span>
              </div>
            ))}
          </div> */}
      </div>
      <div className="bg-card/70 blurBack flex-col w-full rounded-lg gap-4 items-center h-fit p-6 shadow-2xl md:hidden flex relative z-10">
        <div className="border-border rounded-lg  flex flex-col w-full h-full gap-8  items-center ">
          <span className="font-bold text-3xl poppins-regular ">
            Let&apos;s get started!
          </span>
          {/* <span className="font-re text-xl">
            First you&apos;ll need to upload a resource
          </span> */}
          <div className="w-full relative ">
            <div className="flex items-center flex-col gap-2  rounded-lg   ">
              <div className="flex relative flex-col gap-0 items-end text-theme-green">
                <span className="font-bold text-xl hand-font text-center">
                  Moltar can read any pdf for you! <br /> Just upload your pdf
                  to
                  <br />
                  start leveraging moltar
                </span>
                <Arrow1 className="absolute  -bottom-2 right-0 translate-x-1/2  h-14 w-14  fill-theme-green -rotate-[40deg] " />
              </div>
              <Button
                onClick={() => document.getElementById("selectedFile")?.click()}
                className="text-primary text-sm bg-transparent  w-full bg-gradient-to-l from-theme-purple via-theme-green to-theme-blue p-[1px] mt-4 shadow-lg h-fit"
              >
                <span className="poppins-bold text-xl bg-background hover:bg-card/80 text-primary px-6 py-2 w-full h-fit rounded-md flex items-center justify-center hover:opacity-90 capitalize">
                  upload a file
                </span>
              </Button>
              <input
                multiple
                id="selectedFile"
                type="file"
                accept=".pdf"
                onChange={onFileChange}
                style={{display: "none"}}
              />
            </div>
          </div>
          <div className="   relative flex flex-col gap-0 items-start  text-theme-purple">
            <span className="font-bold text-center text-xl hand-font">
              Some ideas for URLs:
              <br />
              - News article
              <br />- Blog post
              <br />- Youtube video
            </span>
            <Arrow2 className=" h-14 w-14  fill-theme-purple rotate-[-40deg]  -scale-x-[1] absolute left-0 -translate-x-1/2  top-[60%] " />
          </div>
          <div className="w-full shadow-lg relative h-fit  rounded-md p-[1px] bg-gradient-to-l from-theme-purple via-theme-green to-theme-blue ">
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  scrapeUrl();
                }
              }}
              value={urlInput}
              placeholder="Enter A URL..."
              className="border-none poppins-bold placeholder:text-primary text-xl poppins-regular p-6 rounded-md bg-background focus-visible:ring-theme-blue focus-visible:border-transparent pl-3 pr-12"
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <Button
              onClick={scrapeUrl}
              disabled={urlInput === ""}
              className={`rounded-full absolute top-1/2 right-2  -translate-y-1/2  aspect-square h-fit w-fit p-1 bg-theme-purple hover:bg-them-purple/70
              ${urlInput === "" ? "flex" : "flex"}
              
              `}
            >
              {scraping ? (
                <Icons.loader className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Icons.arrowRight className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
          {/* <Button disabled className="w-full bg-theme-blue text-white" size="lg">
            Start using Moltar
          </Button> */}
        </div>

        {/* <div className=" z-40 right-4 bottom-4 absolute flex flex-col items-end gap-4">
            {uploadQueue.map((file, i) => (
              <div
                key={i}
                className="h-fit p-4 px-6 w-fit flex items-center gap-4 rounded-full  bg-theme-blue "
              >
                <Icons.spinner className="h-5 w-5 animate-spin text-white" />
                <span className="text-white font-bold">{file.name}</span>
              </div>
            ))}
          </div> */}
      </div>
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

const Arrow1 = ({...props}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 243 236"
    >
      <g clipPath="url(#clip0_374_487)" opacity="1">
        <path d="M31.972 206.562a8.429 8.429 0 01-.394-5.722 108.646 108.646 0 013.266-11.07 157.197 157.197 0 019.542-22.703 4.055 4.055 0 014.174-.807 4.058 4.058 0 012.597 3.367 70.57 70.57 0 01-3.797 11.701c-1.544 3.968-4.196 12.443-5.712 17.49l.217-.073c.541-.252 2.354-.84 3.258-1.124 6.653-2.966 13.039-6.5 19.502-9.854 38.41-19.981 70.033-40.642 101.374-69.707a236.058 236.058 0 004.413-4.106c-10.331 4.164-20.604 8.471-30.898 12.726-3.203 1.318-6.416 2.617-9.682 3.774a10.333 10.333 0 01-6.422.858c-10.307-4.285 3.778-16.066 6.811-21.427a338.92 338.92 0 0030.713-45.62 172.783 172.783 0 0018.512-58.507 4.182 4.182 0 015.864-3.665c4.28 1.945 1.737 7.315 1.559 10.907a157.428 157.428 0 01-7.547 29.994 196.402 196.402 0 01-26.483 50.795c-6.354 9.186-13.439 17.86-20.026 26.874 12.878-4.734 29.048-12.39 43.096-17.263 3.567-1.481 10.117-2.764 10.105 2.923-.77 4.173-4.725 6.988-7.272 10.177a417.839 417.839 0 01-106.097 76.514c-6.66 3.766-17.99 8.999-23.075 11.073a234.315 234.315 0 0028.302 4.005 4.022 4.022 0 013.674 3.035 4.034 4.034 0 01-5.055 4.856c-10.76-.898-21.47-2.344-32.1-4.236a56.549 56.549 0 01-7.732-1.672 7.889 7.889 0 01-4.687-3.513zm97.868-76.111l-.008.003-.02.007.028-.01zm.172-.064c.73-.268.882-.332 0 0zm0 0l-.172.064.051-.018.121-.046z"></path>
      </g>
      <defs>
        <clipPath id="clip0_374_487">
          <path
            d="M0 0H252.316V85.835H0z"
            transform="rotate(136.764 108.918 79.34)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};

const Arrow2 = ({...props}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 346 330"
    >
      <g clipPath="url(#clip0_374_489)" opacity="1">
        <path d="M337.368 231.622c.11 5.125-3.94 38.107-14.119 50.391a11.291 11.291 0 01-15.816-.81c-7.89-7.097-15.519-14.479-23.26-21.737-3.549-4.338-10.849-7.341-10.538-13.65a7.026 7.026 0 014.939-5.848 7.041 7.041 0 013.994-.023 7.02 7.02 0 013.36 2.154c9.2 8.388 17.592 16.871 25.226 23.708a530.509 530.509 0 00-33.393-83.143c-12.695-24.769-23.152-45.315-43.03-59.621a86.749 86.749 0 00-42.148-16.644 41.555 41.555 0 01-4.288 35.821 18.386 18.386 0 01-12.857 9.377 18.4 18.4 0 01-15.362-4.156 34.082 34.082 0 01-11.15-19.412 27.089 27.089 0 01-.195-13.922 27.126 27.126 0 016.746-12.186 38.994 38.994 0 0118.489-7.48C149.771 63.509 95.347 49.679 56.13 54.305a242.533 242.533 0 00-41.525 7.474c-.254.068-.504.15-.763.2 2.915-1.002-1.36.429-3.86 1.144a7.273 7.273 0 01-2.546.527 5.024 5.024 0 01-4.099-1.537 5.81 5.81 0 011.493-9.49c1.905-.738 3.796-1.53 5.73-2.195a163.109 163.109 0 0129.509-7.583 171.45 171.45 0 01109.225 17.037 96.656 96.656 0 0137.211 33.481 95.19 95.19 0 0163.02 26.915c19.636 19.106 30.885 44.8 42.572 69.14a455.178 455.178 0 0126.638 69.776c2.452-8.083 4.832-17.867 6.937-24.889 1.068-2.962.575-2.354 1.38-4.228a5.665 5.665 0 011.801-3.008 5.264 5.264 0 015.759-.524 5.246 5.246 0 012.756 5.078zM181.602 106.291a65.227 65.227 0 00-8.037 1.183c-9.339 2.018-11.854 4.727-13.193 12.299-.549 9.055 5.87 20.438 11.44 20.693 8.192 2.589 17.193-18.411 9.79-34.175z"></path>
      </g>
      <defs>
        <clipPath id="clip0_374_489">
          <path
            fill="#fff"
            d="M0 0H303.37V283.954H0z"
            transform="scale(1 -1) rotate(9.384 2031.224 117.244)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};

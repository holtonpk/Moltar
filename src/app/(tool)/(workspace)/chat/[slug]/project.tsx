"use client";
import React, {useEffect} from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Chat from "./chat";
import {Skeleton} from "@/components/ui/skeleton";
import PdfFileView, {PdfFileViewMobile} from "./pdf-file-view";
import UrlTextView, {UrlTextViewMobile} from "./url-text-view";
import YoutubeVideoView, {YoutubeVideoViewMobile} from "./youtube-video-view";
import {Button} from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {
  ProjectType,
  PDFUpload,
  UrlScrapeUpload,
  YoutubeScrapeUpload,
} from "@/types";
import {useChat} from "@/context/chat-context";
import {circIn} from "framer-motion";
import {Progress} from "@/components/ui/progress";
import {doc} from "firebase/firestore";

export const Project = ({projectData}: {projectData: ProjectType}) => {
  const [loading, setLoading] = React.useState(true);
  const [loadingProgress, setLoadingProgress] = React.useState(0);

  React.useEffect(() => {
    // if (loadingProgress == 100) return;
    if (loadingProgress <= 95) {
      setTimeout(() => {
        setLoadingProgress(loadingProgress + 1);
      }, 5);
    }
  }, [loadingProgress]);

  React.useEffect(() => {
    if (projectData) {
      setLoading(false);
    }
  }, [projectData]);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full w-full gap-4">
          <Icons.logo className="h-20 w-20 text-theme-blue" />
          {/* <Icons.spinner className="animate-spin h-10 w-10 text-theme-blue" /> */}
          <Progress
            value={loadingProgress}
            className="w-[200px] bg-primary/5 border border-border"
          />
        </div>
      ) : (
        <>
          <DesktopProject projectData={projectData} />
          <MobileProject projectData={projectData} />
        </>
      )}
    </>
  );
};

const DesktopProject = ({
  projectData,
}: {
  projectData: ProjectType | undefined;
}) => {
  const [expandedChat, setExpandedChat] = React.useState(false);
  const container = React.useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = React.useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (!container.current) return;
      const width = container.current.clientWidth;
      if (width) {
        setContainerWidth(width);
      }
    };

    updateWidth();
    if (!container.current) return;

    // Optional: If you need to handle window resizing
    container.current.addEventListener("resize", updateWidth);

    // Cleanup the event listener
    return () => {
      if (!container.current) return;

      container.current.removeEventListener("resize", updateWidth);
    };
  }, [expandedChat]); // Add any other dependencies that might affect the size

  return (
    <div className="md:flex h-full  border border-border  bg-primary/5 dark:bg-background flex-grow hidden">
      <div ref={container} className="z-20  relative flex-grow h-full flex">
        <div
          className={`transition-all relative duration-300  ${
            expandedChat ? "w-[0%] " : " w-[55%]"
          }`}
        >
          <div
            style={{
              // width: "100%",
              width: containerWidth * 0.55,
            }}
            className={`z-10 h-full  absolute  overflow-hidden    
`}
          >
            {projectData && (
              <>
                {projectData.upload.type === "pdf" && (
                  <PdfFileView upload={projectData?.upload as PDFUpload} />
                )}
                {projectData.upload.type === "url" && (
                  <UrlTextView
                    upload={projectData?.upload as UrlScrapeUpload}
                    projectId={projectData.id}
                  />
                )}
                {projectData.upload.type === "youtube" && (
                  <YoutubeVideoView
                    upload={projectData?.upload as YoutubeScrapeUpload}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div
          style={{
            width: !expandedChat ? containerWidth * 0.45 : "100%",
          }}
          className={`py-2 flex bg-[#E9ECED] dark:bg-background relative pl-4 flex-grow transition-transform duration-300

  `}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-2 z-30  -translate-x-1/2 ">
            <button
              onClick={() => setExpandedChat(!expandedChat)}
              className={`relative group
    
    `}
            >
              <div className={` ${expandedChat ? "transform rotate-180" : ""}`}>
                <HoverIcon />
              </div>
              <span className="expand-hover-animation opacity-0  pointer-events-none z-40 shadow-md absolute whitespace-nowrap top-1/2 -translate-y-1/2 left-full bg-background  rounded-md p-2 text-sm">
                <Icons.chevronLeft className="h-6 w-6 absolute left-0 -translate-x-1/2 fill-background text-background" />
                {!expandedChat ? <p>Hide Upload</p> : <p>Show Upload</p>}
              </span>
            </button>
          </div>
          <div className="w-full rounded-l-lg z-20 h-full  bg-card border border-border border-r-0  flex items-center justify-center relative overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileProject = ({
  projectData,
}: {
  projectData: ProjectType | undefined;
}) => {
  const {project} = useChat()!;

  return (
    <div className="md:hidden block  min-h-full   ">
      {(project?.chat === null || project?.chat?.length === 0) &&
        projectData && (
          <>
            {projectData.upload.type === "pdf" && (
              <PdfFileViewMobile upload={projectData.upload as PDFUpload} />
            )}
            {projectData.upload.type === "url" && (
              <UrlTextViewMobile
                upload={projectData.upload as UrlScrapeUpload}
              />
            )}
            {projectData.upload.type === "youtube" && (
              <YoutubeVideoViewMobile
                upload={projectData.upload as YoutubeScrapeUpload}
              />
            )}
          </>
        )}
      <Chat />
    </div>
  );
};

const HoverIcon: React.FC = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        id="vertical-bar"
        fill="none"
        // stroke="black"
        className="stroke-primary/30"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="50" y1="20" x2="50" y2="80" />
      </g>
      <g
        id="chevron-left"
        fill="none"
        className="stroke-primary"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      >
        <polyline points="50,20 40,50 50,80" />
      </g>

      <style jsx>{`
        svg:hover #vertical-bar {
          opacity: 0;
        }
        svg:hover #chevron-left {
          opacity: 1;
        }
      `}</style>
    </svg>
  );
};

const FileUpload = () => {
  return (
    <div className="p-8 flex-col h-full flex items-center justify-center">
      <div className="w-[80%] p-6  border-border dark border-dashed border-[2px] rounded-lg bgs-[rgb(25,118,210,.2)] flex flex-col gap-2 items-center justify-center">
        <div className="flex items-center justify-center p-6 rounded-lg bg-[rgb(25,118,210,.2)]">
          <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
        </div>
        <h1 className="text- text-2xl font-bold mt-2">Drag and Drop Files</h1>
        {/* <div className="flex flex-row items-center gap-2">
              <span className="mt-1 h-[1px] w-10 bg-gray-400"></span>
              <span className="text-gray-400">Or</span>
              <span className="mt-1 h-[1px] w-10 bg-gray-400"></span>
            </div> */}
        <h2 className="text-white font-bold text-lgg rounded-full py-2 px-6 bg-theme-blue shadow-lg">
          Select files
        </h2>
      </div>
      <div className="flex flex-row items-center gap-2">
        <span className="mt-1 h-[2px] w-10 bg-gray-400"></span>
        <span className="text-xl text-gray-400">Or</span>
        <span className="mt-1 h-[2px] w-10 bg-gray-400"></span>
      </div>
      <div className="relative h-fit w-[350px]">
        <Input
          className="shadow-lg pr-10 bg-card dark:bg-[#2F3233] text-base group focus-visible:shadow-lg  ring-theme-red ring-offset-card focus-visible:ring-theme-blue border- text- font-normal w-full"
          placeholder="Enter a link here"
        />
        <button className="absolute right-2 bg-theme-blue p-1 top-1/2 -translate-y-1/2 rounded-full  ">
          <Icons.arrowRight className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
};

const EmptyUploadList = () => {
  return (
    <div className="flex flex-col w-full gap-4 items-center justify-center  h-full p-6 shadow-2xl dark:bg-white/5">
      <div className="text-3xl font-bold capitalize text-center text-theme-blued">
        Upload files & start interacting
      </div>
      <div className="w-[80%] p-6  border-border dark border-dashed border-[2px] rounded-lg bgs-[rgb(25,118,210,.2)] flex flex-col gap-2 items-center justify-center">
        <div className="flex items-center justify-center p-6 rounded-lg bg-[rgb(25,118,210,.2)]">
          <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
        </div>
        <h1 className="text- text-2xl font-bold mt-2">Drag and Drop Files</h1>
        {/* <div className="flex flex-row items-center gap-2">
              <span className="mt-1 h-[1px] w-10 bg-gray-400"></span>
              <span className="text-gray-400">Or</span>
              <span className="mt-1 h-[1px] w-10 bg-gray-400"></span>
            </div> */}
        <h2 className="text-white font-bold text-lgg rounded-full py-2 px-6 bg-theme-blue shadow-lg">
          Select files
        </h2>
      </div>
      <div className="flex flex-row items-center gap-2">
        <span className="mt-1 h-[2px] w-10 bg-gray-400"></span>
        <span className="text-xl text-gray-400">Or</span>
        <span className="mt-1 h-[2px] w-10 bg-gray-400"></span>
      </div>
      <div className="relative h-fit w-[350px]">
        <Input
          className="shadow-lg pr-10 bg-card dark:bg-[#2F3233] text-base group focus-visible:shadow-lg  ring-theme-red ring-offset-card focus-visible:ring-theme-blue border- text- font-normal w-full"
          placeholder="Enter a link here"
        />
        <button className="absolute right-2 bg-theme-blue p-1 top-1/2 -translate-y-1/2 rounded-full  ">
          <Icons.arrowRight className="h-4 w-4 text-white" />
        </button>
      </div>
      <div className="grid grid-cols-2 items-center gap-4 mt-4 w-full">
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-red/40 p-2 rounded-md flex justify-center items-center">
              <Icons.Youtube className="h-6 w-6" />
            </div>
            <h1 className="font-bold capitalize">Summarize a YouTube Video</h1>
          </div>

          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-green/40 p-2 rounded-md flex justify-center items-center">
              <Icons.newspaper className="h-6 w-6 text-theme-green" />
            </div>
            <h1 className="font-bold capitalize">
              Get The Cliff Notes of a blog
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-blue/40 p-2 rounded-md flex justify-center items-center">
              <Icons.pencil className="h-6 w-6 text-theme-blue" />
            </div>
            <h1 className="font-bold capitalize">
              Create a detailed note outline
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-orange/40 p-2 rounded-md flex justify-center items-center">
              <Icons.flask className="h-6 w-6 text-theme-orange" />
            </div>
            <h1 className="font-bold capitalize">
              Explain the method used in the study
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

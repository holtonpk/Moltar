import React from "react";
import {YoutubeScrapeUpload} from "@/types";
import {LinkButton} from "@/components/ui/link";
import {Icons} from "@/components/icons";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const YoutubeVideoView = ({upload}: {upload: YoutubeScrapeUpload}) => {
  const isVideoSharable = true;

  return (
    <div className="flex flex-col gap-4 h-full overflow-scroll ">
      <div className="w-full flex justify-between p-1 ">
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
      <div className="flex flex-col gap-2 w-full p-6 pt-0 h-fit  justify-center">
        <div className="w-full aspect-[16/9] relative rounded-lg overflow-hidden mb-2">
          {isVideoSharable ? (
            <iframe
              src={`https://www.youtube.com/embed/${upload.id}`}
              className="w-full h-full relative z-20"
            />
          ) : (
            <img
              src={upload.thumbnail}
              className="w-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-30"
            />
          )}
        </div>
        <Label className="flex items-center text-lg gap-1 mt-2 font-bold">
          {/* <TooltipProvider>
            <Tooltip className="z-50">
              <TooltipTrigger>
                <Icons.info className="text-primary/60 h-4 w-4" />
              </TooltipTrigger>

              <TooltipContent className="border-border bg-card z-50 w-[200px]">
                <p>
                  Edit the transcript text as needed. Moltar will utilize this
                  text for your chat.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
          Video Transcript
        </Label>
        <div className="h-fit   poppins-regular">{upload.text}</div>
      </div>
    </div>
  );
};

export default YoutubeVideoView;

export const YoutubeVideoViewMobile = ({
  upload,
}: {
  upload: YoutubeScrapeUpload;
}) => {
  return (
    <div className="w-full h-fit p-4 bg-primary/5">
      <div className="w-full aspect-[16/9] relative rounded-lg overflow-hidden mb-2">
        <iframe
          src={`https://www.youtube.com/embed/${upload.id}`}
          className="w-full h-full relative z-20"
        />
      </div>
    </div>
  );
};

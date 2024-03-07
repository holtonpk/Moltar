"use client";
import React, {useEffect} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Document, Page, pdfjs} from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {Slider} from "@/components/ui/slider";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";
import {LinkButton} from "@/components/ui/link";
import {UploadType} from "@/types";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const FileView = ({upload}: {upload: UploadType}) => {
  const [numPages, setNumPages] = React.useState<number>(1);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [docLoading, setDocLoading] = React.useState<boolean>(true);

  function onDocumentLoadSuccess({numPages}: {numPages: number}): void {
    setNumPages(numPages);
    setDocLoading(false);
  }

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > numPages) return;
    setCurrentPage(pageNumber);
    document
      .getElementById(`page-number-${pageNumber}`)
      ?.scrollIntoView({block: "center"});
  };

  //   add event listener it see if page is in view
  useEffect(() => {
    const handleScroll = () => {
      for (let index = 0; index < numPages; index++) {
        const element = document.getElementById(`page-number-${index + 1}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            setCurrentPage(index + 1);
          }
        }
      }
    };

    const container = containerRef.current; // Copy containerRef.current to a variable inside the effect

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [containerRef, numPages]);

  const pageInput = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pageInput.current) {
      pageInput.current.value = currentPage.toString();
    }
  }, [currentPage, pageInput]);

  const [zoomValue, setZoomValue] = React.useState<number>(75);

  const handleZoom = (value: number[]) => {
    containerRef.current?.style.setProperty("zoom", `${value[0]}%`);
    setZoomValue(value[0]);
  };

  const [showGridPages, setShowGridPages] = React.useState(false);

  const selectPageFromGrid = (pageNumber: number) => {
    goToPage(pageNumber);
    setShowGridPages(false);
  };

  return (
    <div className="flex flex-col  items-center justify-center h-full w-full  shadow-2xl relative ">
      <LinkButton
        href={"/upload"}
        variant="ghost"
        className="absolute top-2 left-2 z-20 text-theme-blue hover:text-theme-blue/60"
      >
        <Icons.chevronLeft className="h-5 w-5" />
      </LinkButton>
      <ScrollArea
        ref={containerRef}
        className="w-full flex-grow  rounded-md  overflow-scroll relative z-10 flex flex-col  gap-3 pt-2  zoom-75 "
      >
        <Document
          className={
            "absolute h-full w-fit flex flex-col gap-4 p-2   left-1/2 -translate-x-1/2 "
          }
          file={upload.path}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Icons.spinner className="animate-spin h-10 w-10 mx-auto text-[#4DA6E0]" />
            </div>
          }
        >
          {/* {docLoading && <div className="h-full w-full bg-red-600"></div>} */}
          {Array.from(new Array(numPages), (el, index) => (
            <div
              key={index}
              id={`page-number-${index + 1}`}
              className="h-fit w-fit "
            >
              <Page
                className={"shadow-lg h-fit border rounded-lg  p-1 "}
                pageNumber={index + 1}
              ></Page>
            </div>
          ))}
        </Document>
      </ScrollArea>
      <div className=" w-full  justify-between  py-2  bg-card dark:bg-[#3A3D3E] border-t border-border  z-20 flex items-center px-4 ">
        <span className="p-1  rounded-md flex items-center whitespace-nowrap gap-2 w-fit text-[12px] font-bold  ">
          <Button
            onClick={() => goToPage(currentPage - 1)}
            size="sm"
            className="p-1"
            variant={"ghost"}
          >
            <Icons.chevronLeft className="h-5 w-5" />
          </Button>
          Page
          <Input
            ref={pageInput}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "") return;
              goToPage(parseInt(value));
            }}
            className="p-1 text-center bg-card/20 border rounded-lg aspect-square border-gray-200 font-normal text-theme-blue"
          />
          of {numPages}
          <Button
            onClick={() => goToPage(currentPage + 1)}
            size="sm"
            className="p-1"
            variant={"ghost"}
          >
            <Icons.chevronRight className="h-5 w-5" />
          </Button>
        </span>
        <Popover open={showGridPages} onOpenChange={setShowGridPages}>
          <PopoverTrigger className="bg-card dark:bg-[#3A3D3E] shadow-md text-theme-blue border dark:border-transparent dark:bg-white/5  p-2 rounded-md">
            <Icons.grid className="h-5 w-5 " />
          </PopoverTrigger>
          <PopoverContent className="blurBack bg-card/10 p-4 w-[500px]  top-4 h-[450px] overflow-scroll">
            <Document
              className={" relative overflow-hidden grid grid-cols-3 gap-4"}
              file={upload.path}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icons.spinner className="animate-spin h-10 w-10 mx-auto text-[#4DA6E0]" />
                </div>
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <button
                  key={index}
                  onClick={() => selectPageFromGrid(index + 1)}
                  className={`h-[200px] aspect-[1/1.4]  rounded-md border-4 border-border  overflow-hidden relative  hover:border-theme-blue shadow-sm
                ${
                  currentPage === index + 1
                    ? "border-theme-blue"
                    : "border-border dark:border-white/60"
                }
                `}
                >
                  <div className="absolute right-0 bottom-0 z-20 text-theme-blue font-bold bg-white px-2 py-1 rounded-md border  rounded-r-none">
                    {index + 1}
                  </div>
                  <Page
                    className={
                      "shadow-lg border rounded-lg  p-1 scale-[.35]  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    }
                    pageNumber={index + 1}
                  ></Page>
                </button>
              ))}
            </Document>
          </PopoverContent>
        </Popover>

        <div className="w-[200px] flex flex-row items-center gap-2 text-theme-blue">
          {zoomValue + "%"}
          <Slider
            defaultValue={[75]}
            max={200}
            min={1}
            step={1}
            onValueChange={handleZoom}
          />
        </div>
      </div>
    </div>
  );
};

export default FileView;

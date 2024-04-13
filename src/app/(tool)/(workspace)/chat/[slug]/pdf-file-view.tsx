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
import {PDFUpload} from "@/types";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {Skeleton} from "@/components/ui/skeleton";
import {useChat} from "@/context/chat-context";
import {Expand} from "lucide-react";
import exp from "constants";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfFileView = ({upload}: {upload: PDFUpload}) => {
  const [numPages, setNumPages] = React.useState<number>();
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [pdfLoading, setPdfLoading] = React.useState<boolean>(true);

  async function onDocumentLoadSuccess({numPages}: {numPages: number}) {
    setNumPages(numPages);
    setPdfLoading(false);
  }

  const goToPage = (pageNumber: number) => {
    if (!numPages) return;
    if (pageNumber < 1 || pageNumber > numPages) return;
    setCurrentPage(pageNumber);
    document
      .getElementById(`page-number-${pageNumber}`)
      ?.scrollIntoView({block: "center"});
  };

  //   add event listener it see if page is in view
  useEffect(() => {
    const handleScroll = () => {
      const containerHeight =
        containerRef.current?.getBoundingClientRect().height;
      if (!containerHeight || !numPages) return;
      for (let index = 0; index < numPages; index++) {
        const element = document.getElementById(`page-number-${index + 1}`);
        if (element) {
          const rect = element.getBoundingClientRect();

          if (rect.top >= 0 && rect.bottom <= containerHeight) {
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

  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  const calculateWidth = () => {
    const container = containerRef.current;
    if (container) {
      const width = container.getBoundingClientRect().width;
      setContainerWidth(width - 200);
    }
  };

  // useEffect(() => {
  //   calculateWidth();
  //   const container = containerRef.current;
  //   if (container) {
  //     calculateWidth();
  //   }
  // }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      calculateWidth();
    };

    updateWidth();

    if (!containerRef.current) return;

    containerRef.current.addEventListener("resize", updateWidth);

    // Cleanup the event listener
    return () => {
      if (!containerRef.current) return;

      containerRef.current.removeEventListener("resize", updateWidth);
    };
  }, [containerRef.current]); // Add any other dependencies that might affect the size

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
        className="w-full flex-grow p-6 rounded-md  overflow-scroll relative z-10 flex flex-col  gap-3 zoom-75 "
      >
        {pdfLoading && (
          <div className="absolute -translate-x-1/2  left-1/2 ">
            <Skeleton
              style={{width: containerWidth}}
              className="gap-4 flex-grow bg-primary/40  aspect-[1/1.414]"
            />
          </div>
        )}
        {upload && (
          <Document
            className={
              "absolute w-fit  flex flex-col gap-4    left-1/2 -translate-x-1/2 "
            }
            file={upload.path}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<></>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <PdfPage
                key={index}
                index={index}
                containerWidth={containerWidth}
              />
            ))}
          </Document>
        )}
      </ScrollArea>
      {upload && numPages && (
        <div className="absolute bottom-4 z-20">
          <div className="  w-[95%] rounded-lg min-w-fit gap-10 justify-between  py-2  bg-card/70 border border-border blurBack darka:bg-[#3A3D3E]   z-20 flex items-center px-2  duration-[5s] fade-in-0 animate-in slide-in-from-bottom-4  ">
            <div className="w-[200px] min-w-[200px]  flex flex-row items-center gap-2 text-theme-blue  p-2 rounded-md ">
              {zoomValue + "%"}
              <Slider
                defaultValue={[75]}
                max={200}
                min={1}
                step={1}
                onValueChange={handleZoom}
              />
            </div>

            <Popover open={showGridPages} onOpenChange={setShowGridPages}>
              <PopoverTrigger className=" text-theme-blue   p-2 rounded-md flex items-center gap-2 border-4 border-border dark:border-primary/30">
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
                      <PdfPagePreview index={index} />
                    </button>
                  ))}
                </Document>
              </PopoverContent>
            </Popover>

            <span className="p-1  rounded-md  flex items-center whitespace-nowrap gap-2 w-fit text-[12px] font-bold  ">
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
                value={currentPage}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") return;
                  goToPage(parseInt(value));
                }}
                className="p-1 text-center font-bold bg-transparent border rounded-lg aspect-square border-border dark:border-white/30 text-theme-blue"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfFileView;

export const PdfFileViewMobile = ({upload}: {upload: PDFUpload}) => {
  const [numPages, setNumPages] = React.useState<number>(1);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const [docLoading, setDocLoading] = React.useState<boolean>(true);

  async function onDocumentLoadSuccess({numPages}: {numPages: number}) {
    // Extract text from each page
    setNumPages(numPages);
    setDocLoading(false);
    console.log("setting loading to", docLoading);
  }
  const [selectedPage, setSelectedPage] = React.useState<number>(1);

  const [showExpandedView, setShowExpandedView] = React.useState(false);

  return (
    <>
      <div className="flex flex-col  items-center justify-center h-fit  py-4 w-full   bg-primary/5   relative ">
        <div className=" px-2 grid grid-cols-[36px_1fr] items-center h-fit justify-center relative z-10">
          <LinkButton
            href={"/upload"}
            variant="ghost"
            className=" z-20 text-theme-blue hover:text-theme-blue/60 p-0 "
          >
            <Icons.chevronLeft className="h-6 w-6" />
          </LinkButton>
          <div className="flex items-center justify-between w-full overflow-hidden  gap-4  ">
            <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap ">
              {upload.title}
            </span>
          </div>
        </div>

        <div className="w-screen h-[200px] mt-4 px-4    overflow-x-scroll relative z-10 flex   gap-3    ">
          <Document
            className={"relative w-fit  h-[200px]  flex  gap-4   "}
            file={upload.path}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="w-screen h-[200px] flex justify-center items-center">
                <Icons.spinner className="animate-spin h-10 w-10 mx-auto text-[#4DA6E0]" />
              </div>
            }
          >
            {Array.from(new Array(numPages), (el, index) => (
              <MobilePDFPage
                key={index}
                index={index}
                setSelectedPage={setSelectedPage}
                setShowExpandedView={setShowExpandedView}
              />
            ))}
          </Document>
        </div>
      </div>

      {showExpandedView && (
        <div className="fixed h-screen w-screen  z-40 top-0 left-0  flex flex-col justify-center items-center">
          <Document
            className={"relative w-fit  h-[400px]  flex  gap-4  z-20 "}
            file={upload.path}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="w-screen h-[400px] flex justify-center items-center">
                <Icons.spinner className="animate-spin h-10 w-10 mx-auto text-[#4DA6E0]" />
              </div>
            }
          >
            <Button
              onClick={() => setShowExpandedView(false)}
              className="absolute -top-5 -right-5 z-30 aspect-square p-1 rounded-full  bg-theme-blue hover:bg-theme-blue/70"
            >
              <Icons.close className="h-5 w-5" />
            </Button>
            <Page
              // width={141.4}
              height={400}
              // onLoadSuccess={() => setLoading(false)}
              className={`shadow-lg  border rounded-lg  overflow-hidden   
  

  `}
              pageNumber={selectedPage}
            />
          </Document>
          <div className="flex w-fit gap-4 items-center bg-card p-4 border rounded-md relative z-20 mt-4">
            <Button
              className="bg-theme-blue hover:bg-theme-blue/70"
              onClick={() => {
                if (selectedPage === 1) return;
                setSelectedPage(selectedPage - 1);
              }}
            >
              <Icons.chevronLeft className="h-5 w-5" />
            </Button>
            <span className="font-bold">
              {selectedPage} of {numPages}
            </span>
            <Button
              className="bg-theme-blue hover:bg-theme-blue/70"
              onClick={() => {
                if (selectedPage === numPages) return;
                setSelectedPage(selectedPage + 1);
              }}
            >
              <Icons.chevronRight className="h-5 w-5" />
            </Button>
          </div>
          <button
            onClick={() => setShowExpandedView(false)}
            className="z-10 absolute bg-primary/20 w-full h-full top-0 left-0 blurBack"
          />
        </div>
      )}
    </>
  );
};

const PdfPagePreview = ({index}: {index: number}) => {
  const [loading, setLoading] = React.useState(true);
  return (
    <>
      <Page
        onLoadSuccess={() => setLoading(false)}
        width={200}
        className={`shadow-lg border rounded-lg  p-1   absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none
        ${loading ? "hidden" : "visible"}
        `}
        pageNumber={index + 1}
      ></Page>
      {loading && (
        <Skeleton
          style={{width: 200}}
          className="aspect-[1/1.414] bg-border flex items-center justify-center"
        >
          {/* <Icons.loader className="h-10 w-10 text-primary animate-spin " /> */}
        </Skeleton>
      )}
    </>
  );
};

const PdfPage = ({
  index,
  containerWidth,
}: {
  index: number;
  containerWidth: number;
}) => {
  const [loading, setLoading] = React.useState(true);

  console.log("containerWidth", containerWidth);

  return (
    <div id={`page-number-${index + 1}`} className="h-full w-full  ">
      <Page
        width={containerWidth}
        onLoadSuccess={() => setLoading(false)}
        className={`shadow-lg  border rounded-lg  p-1 
        ${loading ? "hidden" : "visible"}
      
        `}
        pageNumber={index + 1}
      />
      {loading && (
        <Skeleton
          style={{width: containerWidth}}
          className="aspect-[1/1.414] bg-border flex items-center justify-center"
        >
          {/* <Icons.loader className="h-10 w-10 text-primary animate-spin " /> */}
        </Skeleton>
      )}
    </div>
  );
};

const MobilePDFPage = ({
  index,
  setSelectedPage,
  setShowExpandedView,
}: {
  index: number;
  setSelectedPage: (page: number) => void;
  setShowExpandedView: (value: boolean) => void;
}) => {
  const [loading, setLoading] = React.useState(true);

  return (
    <button
      onClick={() => {
        setShowExpandedView(true);
        setSelectedPage(index + 1);
      }}
      id={`page-number-${index + 1}`}
      className="h-[200px]  overflow-hidden  "
    >
      <Page
        // width={141.4}
        height={200}
        onLoadSuccess={() => setLoading(false)}
        className={`shadow-lg  border rounded-lg  overflow-hidden   
        
        ${loading ? "hidden" : "visible"}
        `}
        pageNumber={index + 1}
      />
      {loading && (
        <Skeleton
          style={{width: 141.4}}
          className="aspect-[1/1.414] bg-border flex items-center justify-center"
        >
          {/* <Icons.loader className="h-10 w-10 text-primary animate-spin " /> */}
        </Skeleton>
      )}
    </button>
  );
};

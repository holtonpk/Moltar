import React from "react";
import {UploadOptions} from "../components/upload-options";
import {UploadPanelContext} from "../context/upload-panel-context";
import {PDFUpload} from "@/types";
import {Document, Page, pdfjs} from "react-pdf";
import {Skeleton} from "@/components/ui/skeleton";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const PdfUpload = ({file}: {file: PDFUpload}) => {
  const [loading, setLoading] = React.useState(true);

  const documentRef = React.useRef<HTMLDivElement>(null);

  const {goToNewProject} = React.useContext(UploadPanelContext)!;

  return (
    <>
      <button
        onClick={() => goToNewProject(file)}
        className="absolute  z-20 top-0 left-0 h-full w-full group"
      />

      <Document
        ref={documentRef}
        className={
          " relative  group mx-auto rounded-lg    h-[242px] w-[190px]  z-10 "
        }
        onLoadSuccess={() => console.log("PDF loaded successfully")}
        file={file.path}
        onLoadError={(error) => console.log("Inside Error", error)}
        loading={
          <Skeleton className="rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full h-full" />
        }
      >
        <Page
          height={242}
          onLoadSuccess={() => setLoading(false)}
          className={`rounded-lg overflow-hidden p-1 border-2 border-border   absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2  pointer-events-none 
          ${loading ? "hidden" : "visible"}
          `}
          pageNumber={1}
        />
      </Document>
      {loading && (
        <Skeleton className="rounded-lg bg-primary/30  w-[190px] h-[242px] absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2 z-20" />
      )}

      <div className="pr-6  z-30 border-t-border border-t h-fit absolute bg-card  top-full  w-[110%] pl-4 left-1/2 -translate-x-1/2  group-hover: -translate-y-full transition-transform">
        <div
          onClick={() => goToNewProject(file)}
          className="p-2 text-primary  text-sm text-left  font- overflow-hidden text-ellipsis "
        >
          {file.title}
        </div>
        <UploadOptions file={file} />
      </div>
    </>
  );
};

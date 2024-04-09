import React from "react";
import {UploadPreview} from "../components/upload-options";
import {UploadPanelContext} from "../context/upload-panel-context";
import {PDFUpload} from "@/types";
import {Document, Page, pdfjs} from "react-pdf";
import {Skeleton} from "@/components/ui/skeleton";
import {Icons} from "@/components/icons";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const PdfUpload = ({
  file,
  filterList,
}: {
  file: PDFUpload;
  filterList: string[] | undefined;
}) => {
  const [loading, setLoading] = React.useState(true);

  const documentRef = React.useRef<HTMLDivElement>(null);

  const {goToNewProject} = React.useContext(UploadPanelContext)!;

  return (
    <div
      key={file.id}
      className={` cursor-pointer w-full h-[200px] overflow-hidden relative group border-border  border-4 rounded-lg bg-border
            ${
              filterList && filterList.includes(file.id) ? "visible" : "hidden"
            } `}
    >
      <button
        onClick={() => goToNewProject(file)}
        className="absolute  z-20 top-0 left-0 h-full w-full "
      />

      <Document
        ref={documentRef}
        className={" relative   mx-auto    h-[242px] w-[160px]  z-10 "}
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
          className={`rounded-lg overflow-hidden p-1    absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2  pointer-events-none 
          ${loading ? "hidden" : "visible"}
          `}
          pageNumber={1}
        />
      </Document>
      {loading && (
        <Skeleton className="rounded-lg bg-primary/30  w-[160px] h-[242px] absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2 z-20" />
      )}

      <UploadPreview file={file} />
    </div>
  );
};

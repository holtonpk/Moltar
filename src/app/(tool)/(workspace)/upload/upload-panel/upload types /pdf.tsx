import React from "react";
import {UploadOptions} from "../components/upload-options";
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

  const [openOptions, setOpenOptions] = React.useState(false);

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
        className="absolute  z-20 top-0 left-0 h-full w-full group"
      />

      <Document
        ref={documentRef}
        className={
          " relative   mx-auto rounded-lg   h-[242px] w-[160px]  z-10 "
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
        <Skeleton className="rounded-lg bg-primary/30  w-[160px] h-[242px] absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2 z-20" />
      )}

      <div
        className={` rounded-t-md absolute bg-card/80 z-30  bottom-0 overflow-hidden h-fit w-[100%] px-4 left-1/2 -translate-x-1/2 transition-transform ${
          openOptions
            ? "translate-y-0"
            : "translate-y-full  group-hover:translate-y-0 "
        }
`}
      >
        <div className="p-2 text-primary w-full  text-sm text-left  font- overflow-hidden text-ellipsis z-10 max-h-full relative ">
          <span className="max-w-full max-h-full overflow-hidden text-ellipsis whitespace-break-spaces">
            {file.title}
          </span>
          <button
            onClick={() => goToNewProject(file)}
            className=" w-full rounded-lg mt-3  bg-gradient-to-l group from-theme-purple via-theme-green to-theme-blue p-[2px] flex items-center justify-center "
          >
            <span className="whitespace-nowrap flex items-center bg-card w-full justify-center p-2 rounded-md hover:bg-card/90">
              New Chat
              <Icons.arrowRight className="h-4 w-4 ml-2 " />
            </span>
          </button>
        </div>
        <UploadOptions
          file={file}
          open={openOptions}
          setOpen={setOpenOptions}
        />
      </div>
    </div>
  );
};

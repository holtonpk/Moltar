import React, {useEffect} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {useRouter} from "next/navigation";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {UploadType, ProjectType} from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import {db, app} from "@/config/firebase";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {listAll, getStorage, getDownloadURL, ref} from "firebase/storage";
import {useAuth} from "@/context/user-auth";
import {Skeleton} from "@/components/ui/skeleton";
import {useNavbar} from "@/context/navbar-context";
import {useUploads} from "@/context/upload-context";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const UploadsPanel = () => {
  const {uploadList, FileUpload, DeleteUpload, ReNameUpload, filterList} =
    useUploads();
  const {currentUser, unSubscribedUserId} = useAuth()!;

  async function createNewProject(file: UploadType) {
    const id = Math.random().toString(36).substring(7);

    await setDoc(
      doc(db, `users/${currentUser?.uid || unSubscribedUserId}/projects`, id),
      {
        id: id,
        uploadId: file.id,
        chat: null,
        upload: file,
        createdAt: serverTimestamp(),
      }
    );

    return id;
  }

  const router = useRouter();
  async function goToNewProject(file: UploadType) {
    const projectId = await createNewProject(file);
    router.push(`/chat/${projectId}`);
  }

  const [openRename, setOpenRename] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const {collapsed} = useNavbar()!;

  const [textView, setTextView] = React.useState(false);

  const [fileDate, setFileDate] = React.useState<UploadType | null>(null);

  return (
    <div className="  overflow-scroll h-full items-center  pb-20   w-full absolute p-6 ">
      <div
        className={`grid  items-center w-fit mx-auto h-fit gap-4   pb-6
      ${
        collapsed
          ? "md:grid-cols-6 grid-cols-2 "
          : "md:grid-cols-5 grid-cols-2 "
      }
      `}
      >
        {uploadList.map((file: UploadType) => (
          <div
            key={file.id}
            className={` cursor-pointer w-full h-fit overflow-hidden relative group border-border hover:border-theme-blue border-4 rounded-lg bg-border
            ${filterList.includes(file.id) ? "visible" : "hidden"} `}
          >
            <button
              onClick={() => goToNewProject(file)}
              className="absolute  z-20 top-0 left-0 h-full w-full group"
            />
            <PdfViewer file={file} />
            <div className="pr-6  z-30 border-t-border border-t h-fit absolute bg-card  top-full  w-[110%] pl-4 left-1/2 -translate-x-1/2  group-hover: -translate-y-full transition-transform">
              <div className="p-2 text-primary  text-sm text-left  font- overflow-hidden text-ellipsis ">
                {file.title}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="z-30 flex items-center justify-center  hover:opacity-60 absolute top-2 right-2 rounded-md  ">
                  <Icons.ellipsis className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="text-theme-red  focus:bg-theme-red/20 focus:text-theme-red gap-2 "
                    onClick={() => {
                      setSelectedFile(file.id);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Icons.trash className="h-4 w-4 " />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setSelectedFile(file.id);
                      setOpenRename(true);
                    }}
                    className=" gap-2 "
                  >
                    <Icons.pencil className="h-4 w-4 " />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setFileDate(file);
                      setTextView(true);
                    }}
                    className=" gap-2 "
                  >
                    <Icons.showPassword className="h-4 w-4 " />
                    View text
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        <PDFTextScannerDialog
          file={fileDate}
          textView={textView}
          setTextView={setTextView}
        />

        <Dialog open={openRename} onOpenChange={setOpenRename}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename your upload</DialogTitle>
              <DialogDescription>
                Rename your upload to something more meaningful
              </DialogDescription>
            </DialogHeader>
            <Input
              ref={nameRef}
              className="bg-card"
              placeholder="Enter new name"
            />
            <DialogFooter>
              <Button variant={"outline"} onClick={() => setOpenRename(false)}>
                Cancel
              </Button>
              <Button
                className="bg-theme-blue hover:bg-theme-blue/60 text-white"
                onClick={() => {
                  ReNameUpload(selectedFile, nameRef.current?.value);
                  setOpenRename(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                If you delete this upload you will be permanently deleting any
                chats or projects associated with it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => {
                  DeleteUpload(selectedFile);
                  setShowDeleteDialog(false);
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
export default UploadsPanel;

const PDFTextScannerDialog = ({
  file,
  textView,
  setTextView,
}: {
  file: UploadType | null;
  textView: boolean;
  setTextView: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [pdfText, setPdfText] = React.useState<string | null>(null);

  async function onDocumentLoadSuccess({numPages}: {numPages: number}) {
    if (!file) return;
    // Extract text from each page
    const textPromises = [];
    for (let i = 1; i <= numPages; i++) {
      const loadingTask = pdfjs.getDocument({url: file.path});
      const promise = loadingTask.promise.then((pdf) => {
        return pdf.getPage(i).then((page) => {
          return page.getTextContent().then((textContent) => {
            const hasTextLayer = textContent.items.length > 0;
            console.log("has text layer", hasTextLayer);
            if (!hasTextLayer) return;
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            return pageText;
          });
        });
      });
      textPromises.push(promise);
    }

    Promise.all(textPromises)
      .then((pageTexts) => {
        const extractedText = pageTexts.join(" ");
        setPdfText(extractedText);
        console.log("extractedText==========", extractedText);
      })
      .catch((error) => console.error("Failed to extract PDF text:", error));
  }

  const [scanning, setScanning] = React.useState(false);
  const scanPdfForText = async () => {
    setScanning(true);
    await fetch("/api/convert-pdf-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({fileName: file.id}),
    })
      .then((res) => res.json())
      .then((data) => {
        getTextFromJSON();
      })
      .catch((error) => {
        console.error("Failed to extract PDF text:", error);
      });
    setScanning(false);
  };

  const getTextFromJSON = async () => {
    try {
      const storage = getStorage(app);
      const folderRef = ref(storage, file.id);
      const files = await listAll(folderRef);
      const fileData = files.items[0];
      const url = await getDownloadURL(fileData);
      const response = await fetch(url);
      const data = await response.json();
      let text = "";
      data.responses.forEach((response: any) => {
        text += response.fullTextAnnotation.text;
      });
      setPdfText(text);
    } catch (e) {
      console.log("error", e);
    }
  };

  return (
    <Dialog open={textView} onOpenChange={setTextView}>
      <DialogContent className="max-w-none w-fit">
        <DialogHeader>
          <DialogTitle>
            We didn't detect any text in your pdf. Would you like us to scan it?
          </DialogTitle>
          <DialogDescription>
            This will allow moltar to read your upload
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-10">
          {file && (
            <Document
              className={
                "h-[400px] aspect-[1/1.4]  mx-auto rounded-lg relative  z-10 "
              }
              file={file.path}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icons.spinner className="animate-spin h-10 w-10 mx-auto text-[#4DA6E0]" />
                </div>
              }
            >
              <Page
                height={400}
                className={"shadow-lg h-fit border rounded-lg  p-1 "}
                pageNumber={1}
              />
              {scanning && (
                <div className="scanBar absolute  left-1/2 -translate-x-1/2 w-full h-[40px] rounded-md bg-theme-blue/60 blurBack " />
              )}
            </Document>
          )}
          <span className="bg-muted p-4 h-[400px] aspect-[1/1.4] overflow-scroll relative">
            {pdfText}
            {scanning && (
              <div className="grid grid-rows-8 gap-4 w-full h-full">
                <Skeleton className="rounded-lg bg-primary/30  w-1/2 h-full  z-20" />
                <Skeleton className="rounded-lg bg-primary/30  w-full h-full  z-20" />
                <Skeleton className="rounded-lg bg-primary/30  w-full h-full  z-20" />
                <Skeleton className="rounded-lg bg-primary/30  w-full h-full  z-20" />
                <Skeleton className="rounded-lg bg-primary/30  w-full h-full  z-20" />
                <Skeleton className="rounded-lg bg-primary/30  w-full h-full  z-20" />
                <Skeleton className="rounded-lg bg-primary/30  w-full h-full  z-20" />
                <Skeleton className="rounded-lg bg-primary/30  w-full h-full  z-20" />
                <Skeleton className="rounded-lg bg-primary/30  w-full h-full  z-20" />
              </div>
            )}
          </span>
        </div>
        <DialogFooter>
          <Button
            variant={"outline"}
            onClick={() => {
              setPdfText(null);
              setTextView(false);
            }}
          >
            Use without text scan
          </Button>
          <Button
            className="bg-theme-blue hover:bg-theme-blue/60 text-white"
            onClick={scanPdfForText}
          >
            Scan For Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PdfViewer = ({file}: {file: UploadType}) => {
  const [loading, setLoading] = React.useState(true);

  const documentRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <Document
        ref={documentRef}
        className={
          " relative  group mx-auto rounded-lg    h-[242px] w-[190px]  z-10 "
        }
        onLoadSuccess={() => console.log("PDF loaded successfully")}
        file={file.path}
        onLoadError={(error) => console.log("Inside Error", error)}
        loading={
          // <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 w-full h-full">
          //   <Icons.spinner className="animate-spin h-10 w-10 mx-auto text-[#4DA6E0]" />
          // </div>
          <Skeleton className="rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full h-full" />
        }
      >
        <Page
          height={242}
          onLoadSuccess={() => setLoading(false)}
          className={`rounded-lg overflow-hidden p-1 border-2 border-border   absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2  pointer-events-none 
        ${loading ? "hidden" : "visible"}
        `}
          // loading={
          //   <Skeleton className="rounded-lg   w-[190px] h-[242px] " />
          // }
          pageNumber={1}
        />
      </Document>
      {/* <div className="relative  group mx-auto rounded-lg   w-[190px] h-[242px]  z-10 "></div> */}
      {loading && (
        <Skeleton className="rounded-lg bg-primary/30  w-[190px] h-[242px] absolute top-1/2  left-1/2 -translate-y-1/2 -translate-x-1/2 z-20" />
      )}
    </>
  );
};

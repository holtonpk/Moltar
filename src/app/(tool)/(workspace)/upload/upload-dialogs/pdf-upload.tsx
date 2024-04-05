import React, {useEffect} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {useRouter} from "next/navigation";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {db, app} from "@/config/firebase";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {UploadType, ProjectType, LocalUploadType} from "@/types";
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
import {listAll, getStorage, getDownloadURL, ref} from "firebase/storage";
import {useAuth} from "@/context/user-auth";
import {Skeleton} from "@/components/ui/skeleton";
import {useNavbar} from "@/context/navbar-context";
import {useUploads} from "@/context/upload-context";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
import {Link} from "lucide-react";
import Confetti from "react-confetti";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const PdfUploadDialog = ({file}: {file: LocalUploadType | null}) => {
  const [documentLoaded, setDocumentLoaded] = React.useState<boolean>(false);

  const [recommendScan, setRecommendScan] = React.useState<boolean>(false);
  const [numPages, setNumPages] = React.useState<number>(1);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const {setIsLoadingUpload, setShowDialog} = useUploads()!;

  async function onDocumentLoadSuccess({numPages}: {numPages: number}) {
    if (!file) return;
    // Extract text from each page
    const textPromises = [];
    for (let i = 1; i <= numPages; i++) {
      const loadingTask = pdfjs.getDocument({url: file.path});
      const promise = await loadingTask.promise.then((pdf) => {
        return pdf.getPage(i).then((page) => {
          return page.getTextContent().then((textContent) => {
            const hasTextLayer = textContent.items.length > 0;
            if (!hasTextLayer) {
              setRecommendScan(true);
              return;
            }
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            return pageText;
          });
        });
      });
      textPromises.push(promise);
    }

    try {
      const pageTexts = await Promise.all(textPromises);
      const extractedText = pageTexts.join(" ");

      await setFileText(extractedText);
      console.log("extractedText==========", extractedText);
    } catch (error) {
      console.error("Failed to extract PDF text:", error);
    }
    setDocumentLoaded(true);
    setShowDialog(true);
    setShowDialogLocal(true);
    setNumPages(numPages);
  }

  const [scanning, setScanning] = React.useState(false);

  const [scanSuccess, setScanSuccess] = React.useState(false);

  const scanPdfForText = async () => {
    if (!file) return;
    setScanning(true);
    await fetch("/api/convert-pdf-to-text", {
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
        console.error("Failed to extract PDF ==== text:", error);
      });

    setScanning(false);
    setRecommendScan(false);
    setScanSuccess(true);
  };

  const setFileText = async (text: string) => {
    if (!file) return;
    await setDoc(
      doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/uploads`,
        file.id
      ),
      {
        ...file,
        text: text,
      },
      {
        merge: true,
      }
    );
  };

  const getTextFromJSON = async () => {
    if (!file) return;
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
      await setFileText(text);
    } catch (e) {
      console.log("error", e);
    }
  };

  const router = useRouter();

  const {currentUser, unSubscribedUserId} = useAuth()!;

  async function goToNewProject(file: LocalUploadType) {
    const id = Math.random().toString(36).substring(7);

    await setDoc(
      doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/projects`,
        id
      ),
      {
        id: id,
        uploadId: file.id,
        chat: null,
        createdAt: serverTimestamp(),
      }
    );
    handleCloseDialog();
    router.push(`/chat/${id}`);
  }

  const onDocumentLoadSuccess2 = async () => {
    setIsLoadingUpload(false);
  };

  const [showDialogLocal, setShowDialogLocal] = React.useState(false);

  const handleCloseDialog = () => {
    setShowDialogLocal(false);
    setShowDialog(false);
  };

  return (
    <>
      {file && (
        <>
          <Document
            className={`invisible fixed pointer-events-none`}
            file={file.path}
            onLoadSuccess={onDocumentLoadSuccess}
          />

          <Dialog open={showDialogLocal} onOpenChange={handleCloseDialog}>
            <DialogContent className={`max-w-none w-fit `}>
              <div
                className={`flex  gap-10 items-center md:flex-row flex-col `}
              >
                {file && (
                  <Document
                    className={`h-[400px] aspect-[1/1.4]  mx-auto rounded-lg relative  z-10 

                `}
                    file={file.path}
                    onLoadSuccess={onDocumentLoadSuccess2}
                    loading={
                      <Skeleton className="h-[400px] aspect-[1/1.4] absolute z-30 bg-primary/40"></Skeleton>
                    }
                  >
                    {/* <Skeleton className="h-[400px] aspect-[1/1.4] absolute z-30 bg-primary/40"></Skeleton> */}
                    {documentLoaded && (
                      <Page
                        height={400}
                        className={"shadow-lg h-fit border rounded-lg  p-1 "}
                        pageNumber={currentPage}
                      />
                    )}
                    {scanning && (
                      <div className="scanBar absolute  left-1/2 -translate-x-1/2 w-[110%] h-[40px] rounded-md bg-theme-blue/80 blurBack " />
                    )}
                    {documentLoaded && !scanning && (
                      <div className="z-20 absolute bottom-4 left-1/2 -translate-x-1/2 w-fit bg-car  flex items-center gap-4">
                        <Button
                          onClick={() => {
                            if (currentPage > 1)
                              setCurrentPage(currentPage - 1);
                          }}
                          variant={"outline"}
                          size="sm"
                          className="p-1"
                        >
                          <Icons.chevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="p-2 border border-border rounded-md bg-card">
                          {currentPage}/{numPages}
                        </div>
                        <Button
                          onClick={() => {
                            if (currentPage < numPages)
                              setCurrentPage(currentPage + 1);
                          }}
                          variant={"outline"}
                          size="sm"
                          className="p-1"
                        >
                          <Icons.chevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </Document>
                )}
                {recommendScan ? (
                  <>
                    {scanning ? (
                      <div className="flex flex-col items-center  md:items-start min-w-[400px] ">
                        <DialogHeader className="font-bold text-lg ">
                          Scanning Your Document for text
                        </DialogHeader>
                        <DialogDescription>
                          This will only take a few minutes
                        </DialogDescription>
                        <Button className="bg-theme-blue hover:bg-theme-blue text-white mt-4 ">
                          <Icons.spinner className="h-5 w-5 mr-3 animate-spin" />
                          Scanning document
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center  md:items-start min-w-[400px] ">
                        <DialogHeader className="font-bold text-lg ">
                          We didn&apos;t find any text in your pdf. Would you
                          like us to scan it?
                        </DialogHeader>
                        <DialogDescription>
                          This will allow moltar to read your upload
                        </DialogDescription>
                        <Button
                          className="bg-theme-blue hover:bg-theme-blue/60 text-white mt-4"
                          onClick={scanPdfForText}
                        >
                          <Icons.scan className="h-5 w-5 mr-3" />
                          Scan document
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center  md:items-start min-w-[400px]  ">
                    <DialogHeader className="font-bold  text-lg ">
                      Successfully
                      {scanSuccess ? " scanned " : " uploaded "}
                      👍
                    </DialogHeader>
                    <DialogDescription className="text-center md:text-left">
                      Your file will be in the upload panel. You can click on it
                      to anytime start a project
                    </DialogDescription>
                    <Button
                      className="bg-theme-blue hover:bg-theme-blue/60 text-white mt-4"
                      onClick={() => goToNewProject(file)}
                    >
                      Start a new project
                      <Icons.chevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

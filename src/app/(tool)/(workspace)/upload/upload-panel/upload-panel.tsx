import React, {useEffect} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {useRouter} from "next/navigation";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  UploadType,
  ProjectType,
  UrlScrapeUpload,
  PDFUpload,
  YoutubeScrapeUpload,
} from "@/types";

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
import {useAuth} from "@/context/user-auth";
import {Skeleton} from "@/components/ui/skeleton";
import {useNavbar} from "@/context/navbar-context";
import {useUploads} from "@/context/upload-context";
import {useToast} from "@/components/ui/use-toast";
import {UploadPanelProvider} from "./context/upload-panel-context";
import {UploadRow} from "./components/upload-row";
import {UrlUpload} from "./upload types /website";
import {PdfUpload} from "./upload types /pdf";
import {YoutubeUpload} from "./upload types /youtube";
import {useProjects} from "@/context/projects-context";
import {toastLong} from "@/components/ui/use-toast-long";

import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

import {Link, Youtube, FileText} from "lucide-react";

const UploadsPanel = () => {
  const {uploadList, DeleteUpload, ReNameUpload, filterList} = useUploads()!;
  const {currentUser, unSubscribedUserId} = useAuth()!;

  const {projects} = useProjects()!;

  async function createNewProject(file: UploadType) {
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
        upload: file,
        createdAt: serverTimestamp(),
      }
    );

    return id;
  }

  const router = useRouter();

  const {setShowLoginModal} = useAuth()!;

  async function goToNewProject(file: UploadType) {
    if (
      projects &&
      projects?.length > 1 &&
      (!currentUser || !currentUser?.uid)
    ) {
      toastLong({
        title: "You've reached the limit without an account",
        description:
          "Create an account to continue chatting, don't worry it's free!",
      });
      setShowLoginModal(true);
      return;
    }
    const projectId = await createNewProject(file);
    router.push(`/chat/${projectId}`);
  }

  const [openRename, setOpenRename] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const [selectedFile, setSelectedFile] = React.useState<
    UrlScrapeUpload | PDFUpload | YoutubeScrapeUpload | null
  >(null);
  const {collapsed} = useNavbar()!;

  const pdfUploads = uploadList?.filter(
    (file) => file.type === "pdf"
  ) as PDFUpload[];
  const urlUploads = uploadList?.filter(
    (file) => file.type === "url"
  ) as UrlScrapeUpload[];

  const youtubeUploads = uploadList?.filter(
    (file) => file.type === "youtube"
  ) as YoutubeScrapeUpload[];

  // const youtubeUploads = dummyYoutubeVideos;

  return (
    <UploadPanelProvider
      setSelectedFile={setSelectedFile}
      selectedFile={selectedFile}
      goToNewProject={goToNewProject}
      setShowDeleteDialog={setShowDeleteDialog}
      setOpenRename={setOpenRename}
    >
      <div className="   h-fit items-center  pb-20  md:bg-background  w-full absolute -top-2 ">
        {youtubeUploads && youtubeUploads.length > 0 && (
          <UploadRow
            title="Youtube Videos"
            Icon={Youtube}
            color="253,12,8"
            collapsed={collapsed}
          >
            <>
              {[...youtubeUploads]
                .reverse()
                .map((file: YoutubeScrapeUpload) => (
                  <YoutubeUpload
                    file={file}
                    filterList={filterList}
                    key={file.id}
                  />
                ))}
            </>
          </UploadRow>
        )}
        {pdfUploads && pdfUploads.length > 0 && (
          <UploadRow
            title="PDFs"
            Icon={FileText}
            color="145,100,240"
            collapsed={collapsed}
          >
            {[...pdfUploads].reverse().map((file: PDFUpload) => (
              <PdfUpload file={file} filterList={filterList} key={file.id} />
            ))}
          </UploadRow>
        )}

        {urlUploads && urlUploads.length > 0 && (
          <UploadRow
            title="Websites"
            Icon={Link}
            color="53,142,244"
            collapsed={collapsed}
          >
            <>
              {[...urlUploads].reverse().map((file: UrlScrapeUpload) => (
                <UrlUpload file={file} filterList={filterList} key={file.id} />
              ))}
            </>
          </UploadRow>
        )}
        {selectedFile && (
          <>
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
                  <Button
                    variant={"outline"}
                    onClick={() => setOpenRename(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-theme-blue hover:bg-theme-blue/60 text-white"
                    onClick={() => {
                      ReNameUpload(
                        selectedFile.id,
                        nameRef.current?.value || ""
                      );
                      setOpenRename(false);
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    If you delete this upload you will be permanently deleting
                    any chats or projects associated with it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      DeleteUpload(selectedFile.id, selectedFile.type);
                      setShowDeleteDialog(false);
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </UploadPanelProvider>
  );
};
export default UploadsPanel;

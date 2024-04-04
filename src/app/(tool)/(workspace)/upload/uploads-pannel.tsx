import React, {useEffect} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {useRouter} from "next/navigation";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {UploadType, ProjectType, UrlScrapeUpload, PDFUpload} from "@/types";
import {uploadTypes} from "@/config/data";
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
import {useToast} from "@/components/ui/use-toast";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const UploadsPanel = () => {
  const {
    uploadList,
    DeleteUpload,
    ReNameUpload,
    filterList,
    setUploadedFileLocal,
    setIsLoadingUpload,
  } = useUploads()!;
  const {currentUser, unSubscribedUserId} = useAuth()!;

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

  async function goToNewProject(file: UploadType) {
    const projectId = await createNewProject(file);
    router.push(`/chat/${projectId}`);
  }

  const [openRename, setOpenRename] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const [selectedFile, setSelectedFile] = React.useState<
    UrlScrapeUpload | PDFUpload | null
  >(null);
  const {collapsed} = useNavbar()!;

  const [textView, setTextView] = React.useState(false);

  const [fileDate, setFileDate] = React.useState<UploadType | null>(null);
  const [uploadQueue, setUploadQueue] = React.useState<File[]>([]);
  const {uploadFile, setUploadedFile, setShowDialog} = useUploads()!;
  const {toast} = useToast();

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files); // Convert FileList to an array
      setUploadQueue(files); // Set the initial queue
      setUploadedFileLocal(files[0]);
      setIsLoadingUpload(true);

      for (let file of files) {
        if (file.size > 10000000) {
          toast({
            title: `${file.name} is too large`,
            description: "Please upload a file less than 10MB",
            variant: "destructive",
          });
        } else {
          const fileData = await uploadFile(file); // Upload the file to firebase
          setUploadedFile(fileData);
          setShowDialog(true);
          setUploadQueue((currentQueue) =>
            currentQueue.filter((f) => f !== file)
          );
        }
      }
    }
  };

  const pdfUploads = uploadList?.filter(
    (file) => file.type === "pdf"
  ) as PDFUpload[];
  const urlUploads = uploadList?.filter(
    (file) => file.type === "url"
  ) as UrlScrapeUpload[];

  return (
    <UploadPanelProvider
      setSelectedFile={setSelectedFile}
      selectedFile={selectedFile}
      goToNewProject={goToNewProject}
      setShowDeleteDialog={setShowDeleteDialog}
      setOpenRename={setOpenRename}
    >
      <div className="  overflow-scroll h-full items-center  pb-20   w-full absolute p-6 ">
        <input
          multiple
          id="newUploadInputMobile"
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          style={{display: "none"}}
          className="bg-theme-blue hover:bg-theme-blue/60 text-white"
        />
        <Button
          onClick={() =>
            document.getElementById("newUploadInputMobile")?.click()
          }
          className="bg-theme-blue hover:bg-theme-blue/60 text-white  w-full mb-4  rounded-full aspect-square md:hidden "
        >
          <Icons.add className="h-4 w-4" />
          Add File
        </Button>

        {urlUploads && urlUploads.length > 0 && (
          <div className="flex flex-col gap-6">
            <h1 className="font-bold text-lg w-full text-center pb-2 border-b border-b-border md:text-left ">
              Websites
            </h1>

            <div
              className={`grid  items-center w-fit mx-auto h-fit gap-4   pb-6
      ${
        collapsed
          ? "md:grid-cols-4 grid-cols-1 "
          : "md:grid-cols-3 grid-cols-1 "
      }
      `}
            >
              {urlUploads.map((file: UrlScrapeUpload) => (
                <div
                  key={file.id}
                  className={` cursor-pointer w-full h-fit overflow-hidden relative group border-border hover:border-theme-blue border-4 rounded-lg bg-border
            ${
              filterList && filterList.includes(file.id) ? "visible" : "hidden"
            } `}
                >
                  <UrlUpload file={file} />
                </div>
              ))}
            </div>
          </div>
        )}

        {pdfUploads && pdfUploads.length > 0 && (
          <div className="flex flex-col gap-6">
            <h1 className="font-bold text-lg w-full text-center pb-2 border-b border-b-border md:text-left ">
              PDFs
            </h1>
            <div
              className={`grid  items-center w-fit mx-auto h-fit gap-4   pb-6
      ${
        collapsed
          ? "md:grid-cols-6 grid-cols-2 "
          : "md:grid-cols-5 grid-cols-2 "
      }
      `}
            >
              {pdfUploads.map((file: PDFUpload) => (
                <div
                  key={file.id}
                  className={` cursor-pointer w-full h-fit overflow-hidden relative group border-border hover:border-theme-blue border-4 rounded-lg bg-border
            ${
              filterList && filterList.includes(file.id) ? "visible" : "hidden"
            } `}
                >
                  <PdfUpload file={file} />
                </div>
              ))}
            </div>
          </div>
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

const UrlUpload = ({file}: {file: UrlScrapeUpload}) => {
  const {goToNewProject, setSelectedFile, setShowDeleteDialog, setOpenRename} =
    React.useContext(UploadPanelContext)!;

  const Icon = uploadTypes.find((type) => type.value === file.type)?.icon;

  return (
    <>
      {/* {Icon && (
        <div className=" absolute z-30 top-0 left-0 p-1 bg-muted/80 rounded-br-md ">
          <Icon className="h-6 w-6" />
        </div>
      )} */}
      <button
        onClick={() => goToNewProject(file)}
        className="absolute z-20 top-0 left-0 h-full w-full group"
      />
      <div className="grid grid-cols-[24px_1fr] gap-1 relative  group mx-auto rounded-t-lg overflow-x-hidden text-ellipsis   max-w-full  z-10 bg-theme-blue/20 whitespace-nowrap p-2 pr-6">
        <img src={file.fav} className="h-6 w-6 rounded-md" />
        <span className="w-full overflow-hidden text-ellipsis">{file.url}</span>
      </div>
      <div className="pr-6 z-20   border-t-border border-t h-fit  bg-card  top-full  w-full  relative  group-hover:  transition-transform">
        <div
          onClick={() => goToNewProject(file)}
          className="p-2 text-primary  text-sm text-left  font- overflow-hidden text-ellipsis relative z-10 "
        >
          {file.title}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="z-50 flex items-center justify-center hover:opacity-60 absolute top-2 right-0 rounded-md  ">
            <Icons.ellipsis className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-border bg-card">
            <DropdownMenuItem
              onSelect={() => {
                setSelectedFile(file);
                setOpenRename(true);
              }}
              className=" gap-2 cursor-pointer focus:bg-primary/20"
            >
              <Icons.pencil className="h-4 w-4 " />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-theme-red cursor-pointer focus:bg-theme-red/20 focus:text-theme-red gap-2 "
              onClick={() => {
                setSelectedFile(file);
                setShowDeleteDialog(true);
              }}
            >
              <Icons.trash className="h-4 w-4 " />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

const PdfUpload = ({file}: {file: PDFUpload}) => {
  const [loading, setLoading] = React.useState(true);

  const documentRef = React.useRef<HTMLDivElement>(null);
  const {uploadFile, setUploadedFile, setShowDialog} = useUploads()!;

  const {goToNewProject, setSelectedFile, setShowDeleteDialog, setOpenRename} =
    React.useContext(UploadPanelContext)!;
  const Icon = uploadTypes.find((type) => type.value === file.type)?.icon;

  return (
    <>
      {/* {Icon && (
        <div className=" absolute z-30 top-0 left-0 p-1 bg-muted/80 rounded-br-md ">
          <Icon className="h-6 w-6" />
        </div>
      )} */}
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
        <DropdownMenu>
          <DropdownMenuTrigger className="z-30 flex items-center justify-center  hover:opacity-60 absolute top-2 right-2 rounded-md  ">
            <Icons.ellipsis className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-border bg-card">
            <DropdownMenuItem
              onSelect={() => {
                setSelectedFile(file);
                setOpenRename(true);
              }}
              className=" gap-2 cursor-pointer focus:bg-primary/20"
            >
              <Icons.pencil className="h-4 w-4 " />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-theme-red cursor-pointer focus:bg-theme-red/20 focus:text-theme-red gap-2 "
              onClick={() => {
                setSelectedFile(file);
                setShowDeleteDialog(true);
              }}
            >
              <Icons.trash className="h-4 w-4 " />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

type UploadPanelContextType = {
  selectedFile: UrlScrapeUpload | PDFUpload | null;
  setSelectedFile: React.Dispatch<
    React.SetStateAction<UrlScrapeUpload | PDFUpload | null>
  >;
  goToNewProject: (file: UploadType) => void;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRename: React.Dispatch<React.SetStateAction<boolean>>;
};

const UploadPanelContext = React.createContext<UploadPanelContextType | null>(
  null
);

interface UploadPanelProviderProps {
  children: React.ReactNode;
  setSelectedFile: React.Dispatch<
    React.SetStateAction<UrlScrapeUpload | PDFUpload | null>
  >;
  selectedFile: UrlScrapeUpload | PDFUpload | null;
  goToNewProject: (file: UploadType) => void;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRename: React.Dispatch<React.SetStateAction<boolean>>;
}

// Provider component
export const UploadPanelProvider = ({
  children,
  selectedFile,
  setSelectedFile,
  goToNewProject,
  setShowDeleteDialog,
  setOpenRename,
}: UploadPanelProviderProps) => {
  return (
    <UploadPanelContext.Provider
      value={{
        selectedFile,
        setSelectedFile,
        goToNewProject,
        setShowDeleteDialog,
        setOpenRename,
      }}
    >
      {children}
    </UploadPanelContext.Provider>
  );
};

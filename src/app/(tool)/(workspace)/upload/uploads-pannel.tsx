import React from "react";
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
import {db} from "@/config/firebase";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";

import {useUploads} from "@/context/upload-context";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const UploadsPanel = () => {
  const {uploadList, FileUpload, DeleteUpload, ReNameUpload, filterList} =
    useUploads();

  async function createNewProject(file: UploadType) {
    const id = Math.random().toString(36).substring(7);

    await setDoc(doc(db, "users/h9h731yJGLdovlUrQgmEDB2ehr23/projects", id), {
      id: id,
      uploadId: file.id,
      chat: null,
      upload: file,
      createdAt: serverTimestamp(),
    });

    return id;
  }
  console.log("render ==");

  const router = useRouter();
  async function goToNewProject(file: UploadType) {
    const projectId = await createNewProject(file);
    router.push(`/chat/${projectId}`);
  }

  console.log("uploadList", uploadList);

  const [openRename, setOpenRename] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  return (
    <div className="  overflow-scroll h-full items-center relative pb-20   w-full p-6 ">
      <div className="grid grid-cols-4 h-fit gap-4  pb-6">
        {uploadList.map((file: UploadType) => (
          <div
            key={file.id}
            className={` cursor-pointer w-full overflow-hidden relative group border-border hover:border-theme-blue border-4 rounded-lg 
            ${filterList.includes(file.id) ? "visible" : "hidden"} `}
          >
            <button
              onClick={() => goToNewProject(file)}
              className="absolute  z-20 top-0 left-0 h-full w-full group"
            />
            <Document
              className={
                " relative overflow-hidden group mx-auto  aspect-[1/1.2] w-full "
              }
              onLoadSuccess={() => console.log("PDF loaded successfully")}
              file={file.path}
              onLoadError={(error) => console.log("Inside Error", error)}
              loading={
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icons.spinner className="animate-spin h-10 w-10 mx-auto text-[#4DA6E0]" />
                </div>
              }
            >
              <Page
                className={
                  " rounded-lg  p-1 shadow-lg scale-[.35] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                }
                pageNumber={1}
              />
            </Document>
            <div className="grid grid-cols-[1fr_50px] relative z-30">
              <div className="p-2 text-primary text-left whitespace-nowrap font-bold overflow-hidden text-ellipsis ">
                {file.title}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="z-30 flex items-center justify-center relative hover:opacity-60 s rounded-md  ">
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
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

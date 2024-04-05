import {useState, useCallback, useEffect, useRef} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {useToast} from "@/components/ui/use-toast";
import {useUploads} from "@/context/upload-context";

export const FileInput = ({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) => {
  const [dragging, setDragging] = useState(false);
  const {
    uploadFile,
    setShowDialog,
    isLoadingUpload,
    setIsLoadingUpload,
    setUploadedFile,
    uploadedFileLocal,
    setUploadedFileLocal,
  } = useUploads()!;

  const [dropError, setDropError] = useState(false);
  const {toast} = useToast();
  const dragContainer = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: DragEvent) => {
    console.log("dragging");
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);

      // Handle the dropped files here
      if (e.dataTransfer === null) return;
      const files = Array.from(e.dataTransfer.files);
      const pdfFiles = files.filter(
        (file: File) => file.type === "application/pdf"
      );
      setUploadedFileLocal(pdfFiles[0]);
      setIsLoadingUpload(true);
      setIsOpen(false);

      for (let file of pdfFiles) {
        // get the total words in the pdf file
        if (file.size > 10000000) {
          toast({
            title: `${file.name} is too large`,
            description: "Please upload a file less than 10MB",
            variant: "destructive",
          });
        } else {
          const fileData = await uploadFile(file);
          setUploadedFile(fileData);
          setShowDialog(true);
        }
      }
    },
    [uploadFile, toast, setShowDialog, setUploadedFile]
  );

  useEffect(() => {
    const currentDragContainer = dragContainer.current;
    if (!currentDragContainer) return;

    currentDragContainer.addEventListener("dragover", handleDragOver);
    currentDragContainer.addEventListener("dragleave", handleDragLeave);
    currentDragContainer.addEventListener("drop", handleDrop);

    return () => {
      currentDragContainer.removeEventListener("dragover", handleDragOver);
      currentDragContainer.removeEventListener("dragleave", handleDragLeave);
      currentDragContainer.removeEventListener("drop", handleDrop);
    };
  }, [handleDrop, handleDragOver, handleDragLeave, dragContainer]); // Assuming `handleDrop` is stable or wrapped with useCallback

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // setIsOpen(false);

    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files); // Convert FileList to an array
      setUploadedFileLocal(files[0]);
      setIsLoadingUpload(true);
      setIsOpen(false);

      for (let file of files) {
        if (file.size > 10000000) {
          toast({
            title: `${file.name} is too large`,
            description: "Please upload a file less than 10MB",
            variant: "destructive",
          });
        } else {
          const fileData = await uploadFile(file);
          setUploadedFile(fileData);
          setShowDialog(true);
        }
      }
    }
  };

  return (
    <>
      <div
        ref={dragContainer}
        className={`w-full h-[200px] rounded-md bg-card border border-dashed sm:flex hidden flex-col items-center justify-center 
        ${dragging ? "border-theme-blue" : "border-transparent"}
        `}
      >
        <Icons.uploadCloud className="h-20 w-20 " />
        <h1 className="font-bold text-base">Drag & and drop a PDF file here</h1>
        <input
          multiple
          id="selectedFile"
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          style={{display: "none"}}
        />
        <Button
          onClick={() => document.getElementById("selectedFile")?.click()}
          className="text-primary text-sm bg-transparent  w-fit bg-gradient-to-l from-theme-purple via-theme-green to-theme-blue p-[2px] mt-4"
        >
          <span className=" bg-card hover:bg-card/80 text-primary px-6 w-fit h-full rounded-md flex items-center justify-center hover:opacity-90">
            Click to browse
          </span>
        </Button>
      </div>
    </>
  );
};

"use client";
import {useState, useCallback, useEffect, useRef} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import cheerio from "cheerio";
import axios from "axios";
import {LinkButton} from "@/components/ui/link";
import Link from "next/link";
import {useAuth} from "@/context/user-auth";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {db, app} from "@/config/firebase";
import {ScrapeResult, UrlScrapeUpload} from "@/types";
import {useToast} from "@/components/ui/use-toast";
import {useUploads} from "@/context/upload-context";
import {useRouter} from "next/navigation";
export const UploadDialog = ({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const [scraping, setScraping] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const [scrapeText, setScrapeText] = useState<ScrapeResult>();

  const scrapeUrl = async () => {
    setScraping(true);
    await fetch("/api/scrape-text", {
      method: "POST",
      body: JSON.stringify({url: urlInput}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.text)
          setScrapeText({
            success: true,
            text: data.text,
            title: data.title,
            favicon: data.favicon,
          });
        else
          setScrapeText({
            success: false,
            text: "",
            title: "",
            favicon:
              "https://firebasestorage.googleapis.com/v0/b/moltar-bc665.appspot.com/o/website.png?alt=media&token=19ac6d99-82e9-469d-badb-bdf0c39f626f",
          });
        setScraping(false);
        setIsOpen(false);
        setOpenScrapeDialog(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setScraping(false);
      });
  };

  const [openScrapeDialog, setOpenScrapeDialog] = useState(false);

  const goBackFunction = () => {
    setOpenScrapeDialog(false);
    setIsOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>File Upload</DialogTitle>
            <DialogDescription>
              Upload a PDF file or enter a URL to start using Moltar
            </DialogDescription>
          </DialogHeader>
          <div className="bg-primary/10 p-4 flex flex-col gap-6">
            <FileInput setIsOpen={setIsOpen} />

            <Button
              onClick={() => document.getElementById("selectedFile")?.click()}
              className="text-primary text-sm bg-transparent  w-full bg-gradient-to-l from-theme-purple via-theme-green to-theme-blue p-[2px] sm:hidden"
            >
              <span className=" bg-card hover:bg-card/80 text-primary w-full h-full rounded-md flex items-center justify-center hover:opacity-90">
                Click to upload
              </span>
            </Button>
            <div className="w-[20%] mx-auto grid grid-cols-[1fr_25px_1fr] items-center">
              <span className="w-full h-[1px] bg-primary/60"></span>
              <span className="w-full flex justify-center">or</span>
              <span className="w-full h-[1px] bg-primary/60"></span>
            </div>
            <div className="w-full relative h-fit  bg-gradient-to-l from-theme-purple via-theme-green to-theme-blue p-[2px] rounded-md ">
              <Input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    scrapeUrl();
                  }
                }}
                value={urlInput}
                placeholder="Enter A URL"
                className="border-none rounded-md focus-visible:ring-theme-blue focus-visible:border-transparent pr-10"
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button
                onClick={scrapeUrl}
                className="rounded-full absolute top-1/2 right-2 -translate-y-1/2  aspect-square h-fit w-fit p-1 bg-theme-purple hover:bg-theme-purple/70 "
              >
                {scraping ? (
                  <Icons.loader className="h-4 w-4 text-white animate-spin" />
                ) : (
                  <Icons.arrowRight className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <WebsiteScrape
        open={openScrapeDialog}
        setIsOpen={setOpenScrapeDialog}
        scrapeResult={scrapeText}
        url={urlInput}
        goBackFunction={goBackFunction}
      />
    </>
  );
};

const FileInput = ({setIsOpen}: {setIsOpen: (value: boolean) => void}) => {
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
      {/* <div
        className={`h-full w-full absolute p-2 left-0 top-0 z-40 pointer-events-none  ${
          dragging ? " opacity-1" : "opacity-1 "
        }`}
      >
        <div className="h-full  pointer-events-none w-full border-2 border-dashed border-theme-blue bg-theme-blue/10 blurBack rounded-xl z-40 flex items-center justify-center flex-col">
          <div className="flex items-center flex-col justify-center p-4 rounded-lg ">
            <Icons.uploadCloud className="h-20 w-20 text-theme-blue" />
            <h1 className="font-bold text-2xl text-theme-blue">
              Drag & Drop files here
            </h1>
          </div>
        </div>
      </div> */}

      <div
        ref={dragContainer}
        className={`w-full h-[200px] rounded-md bg-card border border-dashed sm:flex hidden flex-col items-center justify-center 
      ${dragging ? "border-theme-blue" : "border-transparent"}
      `}
      >
        <Icons.uploadCloud className="h-20 w-20 " />
        <h1 className="font-bold text-base">
          Drag & and drop a PDF file here
          {/* Drag & Drop or{" "}
      <button className="underline text-theme-blue hover:text-theme-blue/80">
        Choose files{" "}
      </button>{" "}
      here */}
        </h1>
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

export const WebsiteScrape = ({
  open,
  setIsOpen,
  url,
  scrapeResult,
  goBackFunction,
}: {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  url: string;
  scrapeResult: ScrapeResult | undefined;
  goBackFunction: () => void;
}) => {
  const [title, setTitle] = useState(scrapeResult?.title);
  const [text, setText] = useState(scrapeResult?.text);

  const {currentUser, unSubscribedUserId} = useAuth()!;

  const [savingIsLoading, setSavingIsLoading] = useState(false);

  async function saveAsUpload() {
    const id = Math.random().toString(36).substring(7);
    const file = {
      id: id,
      title: title,
      type: "url",
      text: text,
      url: url,
      fav: scrapeResult?.favicon,
    };
    await setDoc(
      doc(
        db,
        `users/${
          currentUser?.uid ? currentUser?.uid : unSubscribedUserId
        }/uploads`,
        id
      ),
      file
    );
    return file as UrlScrapeUpload;
  }

  useEffect(() => {
    setTitle(scrapeResult?.title);
    setText(scrapeResult?.text);
  }, [scrapeResult]);

  const Router = useRouter();

  const [creatingIsLoading, setCreatingIsLoading] = useState(false);

  const createNewProject = async () => {
    setCreatingIsLoading(true);
    const file = await saveAsUpload();
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
    Router.push(`/chat/${id}`);
    setCreatingIsLoading(false);
  };

  return (
    <>
      {url && scrapeResult && (
        <Dialog open={open} onOpenChange={setIsOpen}>
          <DialogContent className="">
            {scrapeResult.success ? (
              <>
                <DialogHeader>
                  <DialogTitle>Here&apos;s the text we found</DialogTitle>
                  <DialogDescription>
                    If it looks good you can start a project feel free to edit
                    it
                  </DialogDescription>
                </DialogHeader>
                <Link
                  href={url}
                  className="grid grid-cols-[24px_1fr] group gap-2 max-w-full p-4 bg-background border border-border rounded-md items-center"
                  target="_blank"
                >
                  <img
                    src={scrapeResult.favicon}
                    alt="favicon"
                    className="h-6 w-6 "
                  />
                  <span className="w-full whitespace-nowrap text-ellipsis overflow-hidden group-hover:opacity-65">
                    {url}
                  </span>
                </Link>
                <div className=" flex  items-center">{title}</div>
                <Textarea
                  style={{resize: "none"}}
                  className="h-[300px] overflow-scroll border border-border rounded-md p-2"
                  onChange={(e) => setText(e.target.value)}
                  value={text}
                />

                <DialogFooter>
                  <Button onClick={goBackFunction} variant={"ghost"}>
                    <Icons.arrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Upload
                  </Button>
                  <Button
                    onClick={() => {
                      setSavingIsLoading(true);
                      saveAsUpload();
                      setSavingIsLoading(false);

                      setIsOpen(false);
                    }}
                    className="bg-theme-blue hover:bg-theme-blue/70 text-white"
                  >
                    Save as Upload
                    {savingIsLoading ? (
                      <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Icons.save className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      createNewProject();
                    }}
                    className="bg-theme-purple hover:bg-theme-purple/70 text-white"
                  >
                    Create Project
                    {creatingIsLoading ? (
                      <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Icons.arrowRight className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>
                    Sorry we were&apos;nt able to find any text from{" "}
                    <Link
                      href={url}
                      className="underline text-theme-blue hover:text-theme-blue/60"
                      target="_blank"
                    >
                      this link
                    </Link>
                  </DialogTitle>
                  <DialogDescription>
                    We recommend you copy and paste the text from the website
                    manually
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give this project a title"
                />
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{resize: "none"}}
                  placeholder="Manually copy and paste text here"
                  className="h-[300px] overflow-scroll border border-border rounded-md p-2"
                ></Textarea>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    variant={"ghost"}
                  >
                    <Icons.arrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Back to Upload
                  </Button>
                  <Button
                    onClick={() => {
                      saveAsUpload();
                      setIsOpen(false);
                    }}
                    className="bg-theme-blue hover:bg-theme-blue/70 text-white"
                  >
                    Save as Upload
                    <Icons.save className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    className="bg-theme-purple hover:bg-theme-purple/70 text-white"
                  >
                    Create Project
                    <Icons.arrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

const dummyURl =
  "https://abcnews.go.com/US/trumps-lawyers-push-recusal-judge-juan-merchan-hush/story?id=108748916";

const dummyText =
  "More than 80,000 women get an abortion in Florida in a typical year — accounting for about 1 in 12 abortions in the country.Now, most of those women will need to find somewhere else to go.With the Florida Supreme Court’s decision Monday night upholding an existing 15-week ban and allowing a strict new six-week ban to take effect in 30 days, the court has cut off nearly all abortion access across the South, where all other states have either implemented similar bans or outlawed abortion entirely since Roe v. Wade was overturned.The new law will affect more women seeking abortions in the first trimester than any other single abortion ban to date, upending an already precarious new landscape for abortion access that has developed in the wake of the June 2022 U.S. Supreme Court ruling.The Florida justices issued a separate ruling Monday that greenlighted an initiative to put abortion on the ballot in November.But even if voters decide to establish a constitutional right to abortion in the state, thousands of women will have to reckon with unwanted pregnancies in the eight months between May 1, when the new ban will take effect, and next January, when such an amendment could be added to the constitution.Anya Cook, who nearly died after she was denied an abortion under Florida’s existing 15-week ban in 2022, had a message Monday for women in the Sunshine State who now encounter pregnancy complications after the six-week mark.“Run,” she said. “Run, because you have no help here.”The closest clinic where abortion will now be legal after the six-week mark for someone living at Florida’s southernmost tip will be a 14-hour drive away in Charlotte. A patient whose pregnancy has progressed beyond 12 weeks, the point at which North Carolina bans abortion, will have to drive 17 hours, to southern Virginia.“I think the minority [of patients] are going to be able to do that,” said Chelsea Daniels, a doctor and abortion provider with Planned Parenthood of South, East and North Florida. “There are certain types of patients who will always be able to access care and others who will not.”As has happened in other states where abortion is illegal, many people in Florida are expected to order abortion pills online rather than making the journey to a bricks-and-mortar clinic — an experience that some find simple, but for others can be confusing and scary amid a fraught legal landscape.Before Monday’s ruling, Florida had long been a refuge for people seeking abortions across the South, with its Supreme Court upholding protections for the procedure under a 1980 amendment to the state constitution that established a right to privacy. Even before Roe fell, Florida required patients to comply with significantly fewer restrictions than other states in the region, permitting abortions later in pregnancy than its neighbors and allowing patients to receive care without first scheduling an initial consultation at least 24 hours before their procedure.That reputation as a destination for women seeking to terminate a pregnancy frustrated antiabortion advocates, who focused in recent years on changing on the ideological makeup of the state Supreme Court. Since taking office, Gov. Ron DeSantis (R) has remade the court into a conservative stronghold, appointing several justices with deep ties to the antiabortion movement. The court ruled 6-1 on Monday that the existing constitution does not protect the right to abortion.John Stemberger, a longtime antiabortion advocate in Florida, celebrated the triumph over what he called the “older, activist Florida Supreme Court.”“We were right about this all along,” said Stemberger, the recently appointed president of Liberty Counsel Action, a conservative advocacy group. “It’s a huge victory.”Florida’s existing law, passed in the spring of 2022, allows abortions up to 15 weeks into pregnancy, a time period in which the vast majority of abortions take place. The new six-week ban — which includes exceptions for rape, incest, medical emergencies and “fatal fetal abnormalities” — outlaws the procedure before many people know they’re pregnant.Across the country on Monday night, abortion rights advocates were already imagining how a surge of patients from populous Florida could further strain clinics in Democratic-led states that have seen a spike in traffic since Roe fell.“The concern isn’t where Alabamians are going to go without Florida,” said Robin Marty, the executive director of the West Alabama Women’s Center, a former abortion clinic that has remained open providing other health-care services after Alabama made almost all abortions illegal. “It’s where are Floridians going to go — because they have no place to go.”The Alamo Women’s Clinic of Illinois — an abortion clinic that reopened in southern Illinois after locations were forced to shutter in Oklahoma and Texas — currently sees between 400 and 500 patients a month, said Andrea Gallegos, who runs the clinic. The location, a 17-hour drive from Miami, is ready to expand its hours, she said, to absorb more patient traffic from Florida.“I don’t know what our limit is,” said Gallegos. “Right now it’s just important to take it one day at a time and see as many people as we can.”While the clinic is currently able to see patients within a week after they seek an appointment, Gallegos said she expects wait times will lengthen once the six-week ban takes effect in Florida. That’s what happened at the clinic in Oklahoma after Texas enacted a six-week ban in the fall of 2021, nine months before Roe fell.“We tripled our caseload then,” she recalled. “The days became longer, and we just had to adapt.”About 50,000 people got an abortion every year in Texas before Roe fell, according to the Texas Health and Human Services Commission. That’s significantly fewer than the 84,000 who received abortion care in Florida last year, numbers compiled by the Florida Agency for Health Care Administration.Many people in Florida were already forced to leave the state for abortions under the 15-week ban that took effect soon after Roe was overturned, including some who experienced pregnancy complications that doctors said they could no longer treat.Almost every day at the clinic, Daniels said, she has to turn someone away who is beyond the 15-week mark. When they ask her where they can go, she said, she refers them to clinics in Virginia or Maryland.“I have no words for the looks on their faces,” she said. “It’s not a reality I think most people are prepared for.”Those conversations will become far more frequent once the six-week ban takes effect, Daniels said.Cook was turned away from a hospital in December 2022 when her water broke around 16 weeks of pregnancy, long before a fetus is viable. Less than 24 hours later, she hemorrhaged on the floor of a hair salon — a harrowing experience she recounted in an interview in The Washington Post. Her friend Shanae Smith-Cunningham was turned away from a different hospital with the same complication less than a week later.Over a year after that experience, Cook is pregnant again — and consumed by anxiety over what might happen.“I’m terrified that my life is still at risk,” said Cook, who has been on full bed rest during her pregnancy, determined to take every precaution.She is furious at the Republican politicians who passed the new law, as well as the Supreme Court justices who ruled to allow it to go into effect.“They see the complications that come from their decisions. But nothing is going to make them change their minds,” she said.Many advocates in Florida are hopeful that voters will turn out in November to secure abortion rights in the state, which would require over 60 percent of voters to agree to amend the state constitution.“When voters head to the polls this November, they will send a message to Florida politicians that decisions about whether to have an abortion should be between a patient and a provider, not a constituent and their politician,” said Lauren Brenzel, the campaign director for Floridians Protecting Freedom, the group organizing the efforts to pass the ballot measure.Beth Reinhard contributed to this report.A previous version of this article incorrectly said the Florida Supreme Court ruled unanimously that the Florida Constitution does not protect the right to an abortion. The ruling was 6-1. The article has been corrected. Tracking abortion access in the United States: Since the Supreme Court struck down Roe v. Wade, the legality of abortion has been left to individual states. The Washington Post is tracking states where abortion is legal, banned or under threat. Abortion and the 2024 election: Voters in a dozen states in 2024 could decide the fate of abortion rights with constitutional amendments on the ballot in a pivotal election year. One of the country’s strictest abortion bans will take effect in Florida on May 1, but the state Supreme Court also ruled that an amendment to enshrine abortion rights in the state’s constitution can go on the November ballot.New study: The number of women using abortion pills to end their pregnancies on their own without the direct involvement of a U.S.-based medical provider rose sharply in the months after the Supreme Court eliminated a constitutional right to abortion, according to new research.Abortion pills: The Supreme Court seemed unlikely to limit access to the abortion pill mifepristone. Here’s what’s at stake in the case and some key moments from oral arguments. For now, full access to mifepristone will remain in place. Here’s how mifepristone is used and where you can legally access the abortion pill.";

"use client";

import React, {use, useEffect} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {db} from "@/config/firebase";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {useChat} from "@/context/chat-context2";
import {ChatLog, UploadType} from "@/types";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";
import ReactMarkdown from "react-markdown";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {useProjects} from "@/context/projects-context";
import {toast} from "@/components/ui/use-toast";
import "./chat-style.css";
const Chat = () => {
  const {responseLoading, project} = useChat()!;

  // useEffect(() => {
  //   setChat(chat);
  // }, [chat]);
  const chatContainer = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (responseLoading) {
      // scroll to the bottom of the chat container

      chatContainer.current?.scrollTo({
        top: chatContainer.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [responseLoading]);

  useEffect(() => {
    if (project?.chat) {
      // scroll to the bottom of the chat container
      chatContainer.current?.scrollTo({
        top: chatContainer.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [project?.chat]);

  return (
    <>
      {!project?.chat || project.chat?.length === 0 ? (
        <div className="flex flex-col  items-center justify-center mt-16 md:mt-0  flex-grow  w-full  relative  z-10 ">
          <div className="px-4 ">
            <div className="flex flex-col gap-2 items-center mt-auto">
              <h2 className="font-bold mt-auto text-theme-blue">
                Enter your prompt here
              </h2>
              <Icons.chevronDown className="h-6 w-6 text-theme-blue animate-bounce" />
            </div>
            <ChatBox />
            <PresetChat />
          </div>
        </div>
      ) : (
        <>
          <div className="w-full h-full flex-grow  justify-between  md:relative md:dark:bg-white/10 flex flex-col gap-0 items-center  p-0  ">
            <Header />

            <div
              ref={chatContainer}
              className="flex-grow overflow-scroll p-6 pt-4 pb-[230px] md:pb-[180px] w-full gap-4 flex flex-col"
            >
              {project.chat.map((message: ChatLog, index: number) => (
                <div key={index}>
                  {message.sender === "human" ? (
                    <HumanMessage message={message.text} />
                  ) : (
                    <AiMessage message={message.text} />
                  )}
                </div>
              ))}
              {responseLoading && <AiMessageRender />}
            </div>
            <div className="h-fit  overflow-hidden w-full fixed md:absolute bottom-0 z-20  chat-box-bg-gradient px-4 pb-2  pt-6">
              <BigChatBox />
              <p className="text-[12px] text-muted-foreground text-center mt-2 ">
                Moltar can make mistakes. Consider checking important
                information.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Chat;

const Header = () => {
  const {project} = useChat()!;

  const {projects, ChangeProjectName, ChangeProjectColor} = useProjects()!;

  const tagColors = ["#358EF4", "#4AAB67", "#9164F0", "#E5560A", "#ED8D16"];

  const [openMenu, setOpenMenu] = React.useState(false);

  const nameRef = React.useRef<HTMLInputElement>(null);

  const openProject = projects.find((p) => p.id === project?.id);

  function onSave() {
    const inputValue = nameRef.current?.value;
    // Update the name if the conditions are met
    if (openProject?.id && inputValue && inputValue !== openProject?.name) {
      ChangeProjectName(openProject?.id, inputValue);
    }

    // Update the color if a color is selected and we have a project ID
    if (selectedColor && openProject?.id) {
      ChangeProjectColor(openProject?.id, selectedColor);
    }
  }

  const [selectedColor, setSelectedColor] = React.useState<string>(
    openProject?.color || ""
  );

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
  async function goToNewProject() {
    const projectId = await createNewProject(project?.upload as UploadType);
    router.push(`/chat/${projectId}`);
  }

  return (
    <div className=" w-full p-4     h-fit  z-30 relative border-b border-border dark:border-none dark:border-white  bg-primary/5 md:bg-card md:dark:bg-[#444748] ">
      <Button
        className="absolute left-4 top-1/2 -translate-y-1/2"
        variant={"ghost"}
        onClick={goToNewProject}
      >
        <Icons.chevronLeft className="h-6 w-6 text-primary" />
      </Button>

      <button
        onClick={() => setOpenMenu(true)}
        className="flex w-fit gap-2 items-center mx-auto justify-center hover:opacity-60"
      >
        <div
          className="h-4 w-4 rounded-full"
          style={{backgroundColor: openProject?.color || "#358EF4"}}
        />

        <h1 className="font-bold  whitespace-nowrap capitalize ">
          {openProject?.name || "no name"}
        </h1>
      </button>
      <Dialog open={openMenu} onOpenChange={setOpenMenu}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename this chat</DialogTitle>
            <DialogDescription>
              Rename your upload to something more meaningful
            </DialogDescription>
          </DialogHeader>
          <Input
            ref={nameRef}
            className="bg-card border-border"
            placeholder="Enter new name"
          />
          <div className="flex flex-col gap-2">
            {/* <h1 className="font-bold ">Tag color</h1>
             */}
            <DialogTitle>Tag color</DialogTitle>
            <DialogDescription>
              Choose a color to tag this chat
            </DialogDescription>
            <div className="flex gap-2 border border-border p-2 rounded-md w-fit">
              {tagColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 hover:border-primary  
                ${
                  selectedColor === color
                    ? "border-primary"
                    : "border-transparent"
                }
                
                `}
                  style={{backgroundColor: color}}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant={"outline"} onClick={() => setOpenMenu(false)}>
              Cancel
            </Button>
            <Button
              className="bg-theme-blue hover:bg-theme-blue/60 text-white"
              onClick={() => {
                onSave();
                setOpenMenu(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AiMessageRender = () => {
  return (
    <div className="rounded-[8px_8px_8px_0px] shadow-lg bg-theme-blue/20 w-fit p-[10px] flex flex-row gap-[5px]">
      <span className="relative flex h-[10px] w-[10px] ">
        <span className="animate-ping  absolute inline-flex h-full w-full rounded-full bg-theme-blue opacity-75"></span>
        <span className="relative inline-flex rounded-full h-[10px] w-[10px]  bg-theme-blue"></span>
      </span>
      <span className="relative flex h-[10px] w-[10px]  ">
        <span className="animate-ping delay-150 absolute inline-flex h-full w-full rounded-full bg-theme-blue opacity-75"></span>
        <span className="relative inline-flex rounded-full h-[10px] w-[10px]  bg-theme-blue"></span>
      </span>
      <span className="relative flex h-[10px] w-[10px]  ">
        <span className="animate-ping delay-300 absolute inline-flex h-full w-full rounded-full bg-theme-blue opacity-75"></span>
        <span className="relative inline-flex rounded-full h-[10px] w-[10px]  bg-theme-blue"></span>
      </span>
    </div>
  );
};

const AiMessage = ({message}: {message: string}) => {
  const {responseLoading} = useChat()!;

  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      variant: "blue",
    });
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="max-w-full  w-fit rounded-[8px_8px_8px_0px] shadow-lg bg-theme-blue/20  mr-auto  relative group prose">
      <ReactMarkdown className={"gap-2 p-4 px-6 flex flex-col items-start"}>
        {message}
      </ReactMarkdown>

      <button
        onClick={copyToClipboard}
        className="hidden group-hover:block absolute top-3 right-3 hover:opacity-80 fade-in-fast"
      >
        {copied ? (
          <Icons.check className="h-4 w-4 primary" />
        ) : (
          <Icons.copy className="h-4 w-4 primary" />
        )}
      </button>
    </div>
  );
};

const HumanMessage = ({message}: {message: string}) => {
  return (
    <div className="max-w-[85%] w-fit rounded-[8px_8px_0px_8px] shadow-lg  bg-theme-orange/20 p-3 ml-auto">
      {message}
    </div>
  );
};

const ChatBox = () => {
  const {setPrompt} = useChat()!;
  const promptRef = React.useRef<HTMLTextAreaElement>(null);

  const sendMessage = () => {
    setPrompt(promptRef.current?.value ?? "");
    promptRef.current!.value = "";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents inserting a new line
      sendMessage();
    }
  };

  return (
    <div className="w-full p-0 pt-0  px-0 s ">
      <div className="grid grid-cols-[1fr_42px] items-center  border-gradient  p-[4px] shadow-xl ">
        <textarea
          ref={promptRef}
          placeholder="Enter your prompt here..."
          className="w-full p-2 rounded-l-lg h-[42px]  textarea-no-resize bg-card dark:bg-[#444748] "
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className=" p-2 h-[42px] w-[42px] flex items-center justify-center rounded-r-lg bg-card dark:bg-[#444748]"
        >
          <Icons.send className="h-6 w-6 text-theme-green " />
        </button>
      </div>
    </div>
  );
};
const BigChatBox = () => {
  const {setPrompt} = useChat()!;

  const promptRef = React.useRef<HTMLTextAreaElement>(null);

  const sendMessage = () => {
    setPrompt(promptRef.current?.value ?? "");
    promptRef.current!.value = "";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents inserting a new line
      sendMessage();
    }
  };

  return (
    <div className="w-full  h-fit">
      <div className="grid grid-cols-[1fr_42px] items-center  border-gradient  p-[2px] shadow-xl ">
        <textarea
          ref={promptRef}
          placeholder="Enter your prompt here..."
          className="w-full p-2 rounded-l-lg h-[84px]  textarea-no-resize bg-card dark:bg-[#444748] "
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className=" p-2 h-[84px] w-[42px] flex items-center justify-center rounded-r-lg bg-card dark:bg-[#444748]"
        >
          <Icons.arrowUp className="h-6 w-6 text-theme-green " />
        </button>
      </div>
    </div>
  );
};

const PresetChat = () => {
  const {setPrompt} = useChat()!;

  const selectPreset = (message: string) => {
    setPrompt(message);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-4 w-full">
        <button
          onClick={() => setPrompt("Create a detailed note outline")}
          className="border border-border hover:border-theme-blue w-full rounded-lg  h-20 p-4 flex flex-row items-center justify-between cursor-pointer"
        >
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-green/40 p-2 rounded-md flex justify-center items-center">
              <Icons.newspaper className="h-6 w-6 text-theme-green" />
            </div>
            <h1 className="font-bold capitalize">
              Create a detailed note outline
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </button>
        <button
          onClick={() => setPrompt("Create 5 questions to help me study")}
          className="border border-border hover:border-theme-blue w-full group rounded-lg  h-20 p-4 flex flex-row items-center justify-between cursor-pointer"
        >
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-blue/40 p-2 rounded-md flex justify-center items-center">
              <Icons.pencil className="h-6 w-6 text-theme-blue" />
            </div>
            <h1 className="font-bold capitalize ">
              Create 5 questions to help me study
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6 " />
        </button>
        <button
          onClick={() => setPrompt("list the main points")}
          className="border border-border hover:border-theme-blue w-full rounded-lg  h-20 p-4 flex flex-row items-center justify-between cursor-pointer"
        >
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-orange/40 p-2 rounded-md flex justify-center items-center">
              <Icons.chart className="h-6 w-6 text-theme-orange" />
            </div>
            <h1 className="font-bold capitalize">List the main points</h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </button>
        <button
          onClick={() => setPrompt("Create a short summary")}
          className="border border-border hover:border-theme-blue w-full rounded-lg  h-20 p-4 flex flex-row items-center justify-between cursor-pointer"
        >
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-purple/40 p-2 rounded-md flex justify-center items-center">
              <Icons.bookText className="h-6 w-6 text-theme-purple" />
            </div>
            <h1 className="font-bold capitalize">Give me a short summary</h1>
          </div>

          <Icons.chevronRight className="h-6 w-6" />
        </button>
      </div>
    </>
  );
};

const dummyMessage = ` # Video Series Ideas from the Document

## "Whiskey 101 / Whiskey for Dummies"
- Explain different types of whiskeys in individual videos
  - Single malt
  - Blended malt
  - Etc.
- Include most popular/favorite brands within each type for potential sponsorships
- Explain nuances of whiskey 
- Cover common misconceptions

## "Behind the Bottle"
- Give background history of individual distilleries
- Think about most interesting part of each story to use as hook
- Potential to use archived footage/images to tell story
- Opportunity for sponsorship by focusing on specific bottle
- Example hook given for "Buffalo Trace" distillery

## "Whiskey Routine" Satisfying Video
- Show process of pouring and preparing a glass of whiskey
- Break into cut shots of each step 
- Emphasize audio for ASMR feel
- Keep pace fast
- Final shot of drinking whiskey
- Example shot list provided

# Additional Tips for Video Content
- Have a strong hook in first 5 seconds (page 1)
- Create content you'd watch yourself (page 1)  
- Be consistent with regular posting schedule (page 1)
- Leverage the set/location with good lighting (page 1)  
- Build a professional brand for monetization (page 1)`;

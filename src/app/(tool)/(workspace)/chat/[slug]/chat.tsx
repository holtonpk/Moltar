"use client";

import React, {useEffect} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {db} from "@/config/firebase";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {useChat} from "@/context/chat-context2";
import {ChatLog, UploadType} from "@/types";
import {useRouter} from "next/navigation";

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
const Chat = () => {
  const {responseRendering, project} = useChat()!;

  // useEffect(() => {
  //   setChat(chat);
  // }, [chat]);

  return (
    <div className="flex flex-col  items-center justify-center h-full w-full  relative   z-10">
      {!project?.chat || project.chat?.length === 0 ? (
        <div className="px-4">
          <div className="flex flex-col gap-2 items-center mt-auto">
            <h2 className="font-bold mt-auto text-theme-blue">
              Enter your prompt here
            </h2>
            <Icons.chevronDown className="h-6 w-6 text-theme-blue animate-bounce" />
          </div>
          <ChatBox />
          <DefaultChat />
        </div>
      ) : (
        <>
          <div className="w-full h-full  justify-between overflow-hidden  dark:bg-white/5 flex flex-col gap-0 items-center  p-0  ">
            <Header />
            <div className="p-6 pt-4 pb-36  flex-grow overflow-scroll z-10 relative gap-4 flex flex-col w-full ">
              {project.chat.map((message: ChatLog, index: number) => (
                <div key={index}>
                  {message.sender === "human" ? (
                    <HumanMessage message={message.text} />
                  ) : (
                    <AiMessage message={message.text} />
                  )}
                </div>
              ))}
              {responseRendering && <AiMessageRender />}
            </div>

            <div className="h-fit overflow-hidden w-full absolute bottom-0 z-20  chat-box-bg-gradient px-4 pb-2  pt-6">
              <BigChatBox />
              <p className="text-[12px] text-muted-foreground text-center mt-2">
                Moltar can make mistakes. Consider checking important
                information.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
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
  // useEffect(() => {
  //   if (!openProject?.name) {
  //     if (project?.id) generateNewProject(project?.id);
  //   }
  // }, [openProject, project]);

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
  async function goToNewProject() {
    const projectId = await createNewProject(project?.upload as UploadType);
    router.push(`/chat/${projectId}`);
  }

  return (
    <div className=" w-full p-4     h-fit  z-30 relative border-b border-border dark:border-none dark:border-white  bg-card dark:bg-[#444748] ">
      <Button
        className="absolute left-4 top-1/2 -translate-y-1/2"
        variant={"ghost"}
        onClick={goToNewProject}
      >
        <Icons.chevronLeft className="h-6 w-6 text-primary" />
      </Button>

      <button
        onClick={() => setOpenMenu(true)}
        className="flex gap-2 items-center w-full justify-center hover:opacity-60"
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
  const {responseLoading, animatedMessage} = useChat()!;

  return (
    <>
      {responseLoading ? (
        <span className="relative flex h-3 w-3 mr-auto">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-blue opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-theme-blue"></span>
        </span>
      ) : (
        <div className="max-w-[85%] w-fit rounded-[8px_8px_8px_0px] shadow-lg bg-theme-blue/20 p-3 flex items-center mr-auto">
          {animatedMessage}
        </div>
      )}
    </>
  );
};

const AiMessage = ({message}: {message: string}) => {
  return (
    <div className="max-w-[85%] w-fit rounded-[8px_8px_8px_0px] shadow-lg bg-theme-blue/20 p-3 mr-auto">
      {message}
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
    <div className="w-full  ">
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

const DefaultChat = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-4 mt-4 w-full">
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-red/40 p-2 rounded-md flex justify-center items-center">
              <Icons.Youtube className="h-6 w-6" />
            </div>
            <h1 className="font-bold capitalize">Summarize a YouTube Video</h1>
          </div>

          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-green/40 p-2 rounded-md flex justify-center items-center">
              <Icons.newspaper className="h-6 w-6 text-theme-green" />
            </div>
            <h1 className="font-bold capitalize">
              Get The Cliff Notes of a blog
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-blue/40 p-2 rounded-md flex justify-center items-center">
              <Icons.pencil className="h-6 w-6 text-theme-blue" />
            </div>
            <h1 className="font-bold capitalize">
              Create a detailed note outline
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
        <div className="border w-full rounded-lg shadow-lg h-20 p-4 flex flex-row items-center justify-between cursor-pointer">
          <div className="flex gap-2 w-fit items-center">
            <div className="h-10  aspect-square bg-theme-orange/40 p-2 rounded-md flex justify-center items-center">
              <Icons.flask className="h-6 w-6 text-theme-orange" />
            </div>
            <h1 className="font-bold capitalize">
              Explain the method used in the study
            </h1>
          </div>
          <Icons.chevronRight className="h-6 w-6" />
        </div>
      </div>
    </>
  );
};

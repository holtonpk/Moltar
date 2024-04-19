"use client";

import React, {use, useEffect} from "react";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {db} from "@/config/firebase";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";
import {useChat} from "@/context/chat-context";
import {ChatLog, UploadType} from "@/types";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";
import ReactMarkdown from "react-markdown";
import {BookText, Newspaper, Pencil, List} from "lucide-react";
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
import {toastLong} from "@/components/ui/use-toast-long";
import {color, motion} from "framer-motion";
import NavBackground from "@/components/nav-background";
import "./chat-style.css";
const Chat = () => {
  const {responseLoading, project, chatError} = useChat()!;

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
        <div className="flex flex-col   items-center justify-center mt-4 md:mt-0   flex-grow  w-full  relative  z-10 ">
          <div className="w-[90%]  md:w-[85%]  min-w-[300px] ">
            <div className="flex flex-col gap-4 mb-4 md:p-  pb-0 rounded-lg">
              <div className="  rounded-md  flex-col gap-2 items-center mt-auto hidden md:flex">
                {/* <h2 className="font-bold mt-auto text-theme-blue">
                Enter your prompt here
              </h2>
              <Icons.chevronDown className="h-6 w-6 text-theme-blue animate-bounce" /> */}
                <Icons.logo className="h-16 w-16 text-theme-blue" />
                <p className="font-bold text-2xl poppins-bold">
                  How can Moltar help?
                </p>
              </div>
              <ChatBox />
            </div>
            <PresetChat />
          </div>
        </div>
      ) : (
        <>
          {/* desktop -------- */}
          <div className="w-full h-full  md:flex hidden justify-between rounded-l-lg md:relative md:dark:bg-white/10 flex-col gap-0 items-center  p-0  ">
            <Header />

            <div
              ref={chatContainer}
              className="flex-grow overflow-scroll p-6 pt-[76px] md:pt-4 pb-[130px]  md:pb-[180px] w-full gap-4 flex flex-col"
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

              {chatError && <ChatError />}
            </div>

            <div className=" h-fit  overflow-hidden w-full absolute bottom-0 z-20  chat-box-bg-gradient px-4 pb-2  pt-6">
              <BigChatBox />
              <p className="text-[12px] text-muted-foreground text-center mt-2   poppins-regular">
                Moltar can make mistakes. Consider checking important
                information.
              </p>
            </div>
          </div>
          {/* mobile -------- */}

          <div className="w-full h-fit  md:hidden  justify-between  rounded-l-lg  md:relative md:dark:bg-white/10 flex flex-col gap-0 items-center  p-0  ">
            <Header />
            <div
              ref={chatContainer}
              className="h-fit p-6 pt-[76px] md:pt-4 pb-[130px]  md:pb-[180px] w-full gap-4 flex flex-col"
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

              {chatError && <ChatError />}
            </div>
            <div className="h-fit bg-card/50 blurBack overflow-hidden w-full fixed  bottom-0 z-20 px-4 pb-2  pt-4">
              <BigChatBox />
              <p className="text-[12px] text-muted-foreground text-center mt-2   poppins-regular">
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

const ChatError = () => {
  return (
    <div className=" w-fit max-w-[85%] rounded-[8px_8px_8px_8px] shadow-lg flex flex-col items-start  bg-theme-red/20 border border-theme-red p-3  ">
      Sorry Moltar isn&apos;t working right now. The Moltar team has been
      notified
    </div>
  );
};

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
  async function goToNewProject() {
    const projectId = await createNewProject(project?.upload as UploadType);
    console.log("goToNewProject", project?.upload);
    router.push(`/chat/${projectId}`);
  }

  return (
    <div className=" w-full p-4 flex justify-center items-center   poppins-bold  h-16  z-30 fixed md:relative border-b border-border dark:border-none dark:border-white blurBack bg-primary/5 md:bg-card md:dark:bg-[#444748] ">
      {currentUser && currentUser?.uid && (
        <button
          className="absolute pr-4 left-4 top-1/2 -translate-y-1/2 text-primary hover:opacity-60"
          onClick={goToNewProject}
        >
          <Icons.chevronLeft className="h-6 w-6 text-primary" />
        </button>
      )}
      {openProject?.name ? (
        <button
          onClick={() => setOpenMenu(true)}
          className="grid grid-cols-[16px_1fr] pl-[35px] pr-[0px] md:pr-[35px]  w-fit gap-2 items-center mx-auto justify-center hover:opacity-60 text-fade-in "
        >
          <div
            className="h-4 w-4 rounded-full"
            style={{backgroundColor: openProject?.color || "#358EF4"}}
          />

          <h1 className="font-bold  whitespace-nowrap capitalize w-full overflow-hidden text-ellipsis ">
            {openProject?.name}
          </h1>
        </button>
      ) : (
        <h1 className="font-bold  mx-auto w-fit  whitespace-nowrap capitalize  overflow-hidden text-ellipsis ">
          New Chat
        </h1>
      )}

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
    <div className="bg p-[1px] shadow-lg rounded-[8px_8px_8px_0px] overflow-hidden  border-gradient-chat w-fit mr-auto">
      <div className="max-w-full  w-fit rounded-[8px_8px_8px_0px] bg-background md:dark:bg-[#444748] border border-border    relative group prose">
        <ReactMarkdown
          className={"gap-2 p-4 px-6 flex flex-col items-start   "}
        >
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
        {/* <NavBackground /> */}
      </div>
    </div>
  );
};

const HumanMessage = ({message}: {message: string}) => {
  return (
    <div className="max-w-[85%] w-fit rounded-[8px_8px_0px_8px] shadow-lg  border border-theme-blue bg-theme-blue/20 p-3 ml-auto ">
      {message}
    </div>
  );
};

const ChatBox = () => {
  const {setPrompt, chat} = useChat()!;
  const [inputValue, setInputValue] = React.useState<string>("");
  const {projects} = useProjects()!;
  const {currentUser} = useAuth()!;

  const sendMessage = () => {
    if (
      projects &&
      projects?.length > 1 &&
      (!currentUser || !currentUser?.uid)
    ) {
      toastLong({
        title: "You've reached the limit without an account",
        description:
          "Create an account to continue chatting, don't worry it's free!",
        variant: "blue",
      });
      return;
    }

    setPrompt(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents inserting a new line
      sendMessage();
    }
  };

  // useEffect(() => {
  //   document.getElementById("prompt-input")?.focus();

  //   // return () => {
  // }, []);

  return (
    <div className="w-full p-0 pt-0  px-0 s ">
      <div className="grid grid-cols-[1fr_42px] items-center  border-gradient p-[1px] md:p-[4px] shadow-xl ">
        <input
          autoFocus
          id="prompt-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full p-2 rounded-l-lg h-fit rounded-r-none   poppins-regular textarea-no-resize bg-background md:bg-card  "
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          disabled={inputValue === ""}
          className={`p-2 h-full w-[42px] flex items-center justify-center rounded-r-lg bg-background md:bg-card 
          
          `}
        >
          <Icons.send
            className={`h-6 w-6 text-theme-green 
          ${inputValue === "" ? "opacity-30 " : ""}
          
          `}
          />
        </button>
      </div>
    </div>
  );
};
const BigChatBox = () => {
  const {setPrompt, chat} = useChat()!;

  const {setShowLoginModal, currentUser} = useAuth()!;

  const promptRef = React.useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    console.log("chat", currentUser);
    if (chat && chat?.length >= 2 && (!currentUser || !currentUser?.uid)) {
      toastLong({
        title: "You've reached the limit without an account",
        description:
          "Create an account to continue chatting, don't worry it's free!",
        variant: "blue",
      });
      setShowLoginModal(true);
      return;
    }
    setPrompt(promptRef.current?.value ?? "");
    promptRef.current!.value = "";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents inserting a new line
      sendMessage();
    }
  };

  return (
    <div className="w-full  h-fit">
      <div className="grid grid-cols-[1fr_42px] items-center  border-gradient p-[1px] md:p-[2px] shadow-xl ">
        <input
          ref={promptRef}
          placeholder="Enter your prompt here..."
          className="w-full p-2 rounded-l-lg h-[42px]  poppins-regular textarea-no-resize bg-background md:bg-card md:dark:bg-[#444748] "
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className=" p-2 h-[42px] w-[42px] flex items-center justify-center rounded-r-lg bg-background md:bg-card md:dark:bg-[#444748]"
        >
          <Icons.arrowUp className="h-6 w-6 text-theme-green " />
        </button>
      </div>
    </div>
  );
};

const PresetChat = () => {
  const {setPrompt} = useChat()!;

  const container = {
    hidden: {opacity: 1, scale: 0},
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: {y: 20, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const presets = [
    {
      title: "Create a detailed note outline",
      icon: Newspaper,
      prompt: "Create a detailed note outline",
      color: "text-theme-green",
      bgColor: "bg-theme-green/40",
    },
    {
      title: "5 questions to help me study",
      icon: Pencil,
      prompt: "Create 5 questions to help me study",
      color: "text-theme-blue",
      bgColor: "bg-theme-blue/40",
    },
    {
      title: "List the main points",
      icon: List,
      prompt: "List the main points",
      color: "text-theme-orange",
      bgColor: "bg-theme-orange/40",
    },
    {
      title: "Give me a short summary",
      icon: BookText,
      prompt: "Create a short summary",
      color: "text-theme-purple",
      bgColor: "bg-theme-purple/40",
    },
  ];

  return (
    <>
      <motion.ul
        variants={container}
        className="flex flex-col items-center gap-2 md:gap-4 w-full poppins-regular  p-0 "
        initial="hidden"
        animate="visible"
      >
        {presets.map((preset, index) => {
          const Icon = preset.icon;

          return (
            <motion.div className="w-full" variants={item} key={index}>
              <button
                onClick={() => setPrompt(preset.prompt)}
                className="border border-border hover:bg-primary/5 w-full rounded-lg group   p-4 md:p-4 flex flex-row items-center justify-between cursor-pointer"
              >
                <div className="flex gap-3 w-fit items-center">
                  <div
                    className={`  aspect-square  p-1 md:p-2 rounded-md flex justify-center items-center ${preset.bgColor}`}
                  >
                    <Icon className={`h-5 w-5 md:h-6 md:w-6 ${preset.color}`} />
                  </div>
                  <h1 className=" capitalize text-[12px] md:text-lg">
                    {preset.title}
                  </h1>
                </div>
                <div className="rounded-md p-1 bg-card md:hidden md:group-hover:block">
                  <Icons.chevronUp className="h-4 w-4 md:h-6 md:w-6  " />
                </div>
              </button>
            </motion.div>
          );
        })}
      </motion.ul>
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

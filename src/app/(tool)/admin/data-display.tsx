"use client";
import {Icons} from "@/components/icons";
import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {ProjectType, UploadType} from "@/types";
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {db} from "@/config/firebase";
import {ChatLog} from "@/types";
import {toast} from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import {Input} from "@/components/ui/input";

const DataDisplay = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, `users`));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        // Added async here
        const userData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            // Used Promise.all and added async here
            const data = doc.data();

            const projectsQ = query(
              collection(db, `users/${data.uid}/projects`)
            );

            const projectSnapshot = await getDocs(projectsQ);
            const projects = projectSnapshot.docs.map((doc) => doc.data());

            const uploadsQ = query(
              collection(db, `users/${data.uid}/uploads`) // Corrected the path to uploads
            );

            const querySnapshot = await getDocs(uploadsQ);
            const uploads = querySnapshot.docs.map((doc) => doc.data());

            return {
              ...data,
              projects: projects,
              uploads: uploads,
            };
          })
        );

        setData(userData);
        setFilteredData(userData);
        setLoading(false);
      });

      // Cleanup this component
      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const [totalUsers, setTotalUsers] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);

  const totalPdfs = data.reduce((acc, user) => {
    return (
      acc + user.uploads.filter((upload: any) => upload.type === "pdf").length
    );
  }, 0);

  const totalUrls = data.reduce((acc, user) => {
    return (
      acc + user.uploads.filter((upload: any) => upload.type === "url").length
    );
  }, 0);

  const totalYoutube = data.reduce((acc, user) => {
    return (
      acc +
      user.uploads.filter((upload: any) => upload.type === "youtube").length
    );
  }, 0);

  const onSearch = (e: any) => {
    if (!e.target.value) {
      setFilteredData(data);
      return;
    }
    const value = e.target.value;
    const filtdData = data.filter((d) => {
      return (
        d.firstName.toLowerCase().includes(value.toLowerCase()) ||
        d.email.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredData(filtdData);
  };

  return (
    <div className="flex flex-col bg-background max-h-none h-screen w-screen dark ">
      <div className="grid grid-cols-5 gap-10 p-10 text-primary">
        <div className="border p-3 rounded-md text-xl w-full justify-center items-center text-center text-theme-blue border-theme-blue font-bold">
          Total Users: {data.length === 0 ? "--" : data.length}
        </div>
        <div className="border p-3 rounded-md text-xl w-full justify-center items-center text-center ">
          PDFs: {data.length === 0 ? "--" : totalPdfs}
        </div>
        <div className="border p-3 rounded-md text-xl w-full justify-center items-center text-center ">
          Urls: {data.length === 0 ? "--" : totalUrls}
        </div>
        <div className="border p-3 rounded-md text-xl w-full justify-center items-center text-center ">
          Youtube Videos: {data.length === 0 ? "--" : totalYoutube}
        </div>
      </div>
      <div className=" px-10 flex-grow text-primary grid grid-cols-[60%_40%] items-start pb-4 gap-6 ">
        <div className="flex flex-col gap-4">
          <div className="h-fit relative w-full bg-primary/5 rounded-md overflow-hidden">
            <Icons.search className="absolute top-1/2 left-2 -translate-y-1/2 text-primary/60 h-4 w-4" />
            <Input
              placeholder="find a user by name or email"
              className=" pl-7 bg-transparent"
              onChange={(e) => onSearch(e)}
            />
          </div>
          <div className="border border-border rounded-lg w-full flex flex-col ">
            <div className="w-full flex p-2 bg-primary/5">
              {/* <div className="w-[350px]">id</div> */}
              <div className="w-[200px]">Name</div>
              <div className="w-[300px]">email</div>
              <div className="w-[200px]">total projects</div>
              <div className="w-[200px]">total uploads</div>
            </div>
            <div className="h-[500px] w-full flex flex-col overflow-scroll ">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <Icons.spinner className="animate-spin h-10 w-10 " />
                  <p>this will take a bit to load</p>
                </div>
              ) : (
                <>
                  {filteredData.map((d, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedUser(d)}
                      className="w-full flex  border p-2 hover:bg-primary/5 cursor-pointer"
                    >
                      <div className="w-[200px] text-left ">
                        {d?.firstName + " " + d?.lastName || "not signed in"}
                      </div>
                      <div className="w-[300px]">
                        {d?.email || "not signed in"}
                      </div>
                      <div className="w-[200px]">
                        {d?.projects.filter((p: any) => p.name).length === 0
                          ? "--"
                          : d?.projects.filter((p: any) => p.name).length}
                      </div>
                      <div className="w-[200px]">
                        {d?.uploads.length === 0 ? "--" : d?.uploads.length}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="relative flex-grow  h-full max-h-screen overflow-hidden">
          <SelectedUser user={selectedUser} />
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;

const SelectedUser = ({user}: {user: any}) => {
  const [selectedChat, setSelectedChat] = useState<ProjectType | undefined>(
    undefined
  );

  const chatContainer = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedChat?.chat) {
      // scroll to the bottom of the chat container
      chatContainer.current?.scrollTo({
        top: chatContainer.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedChat?.chat]);

  console.log(selectedChat);
  return (
    <div className="w-full border rounded-md  h-full relative overflow-scroll   ">
      {!user ? (
        <div className="w-full h-full flex justify-center items-center">
          select a user to see data
        </div>
      ) : (
        <>
          {!selectedChat ? (
            <div className="flex flex-col p-4">
              <div className="font-bold text-xl">
                {user?.firstName + " " + user?.lastName || "not signed in"}
              </div>

              <div>Uid: {user.uid}</div>
              <div>{user.email}</div>
              {user.uploads.length > 0 ? (
                <>
                  <div className="font-bold  text-xl mt-4">
                    Uploads ({user.uploads.length})
                  </div>
                  <div className="flex flex-col gap-2 mt-2 max-h-[200px] overflow-scroll border rounded-md divide-y-2 divide-border">
                    {user.uploads
                      .sort((a: any, b: any) => b.createdAt - a.createdAt)
                      .map((upload: any) => (
                        <div
                          key={upload.id}
                          className="grid grid-cols-[20px_1fr_100px] gap-4 p-3 "
                        >
                          <span className=" text-sm flex items-center justify-center">
                            {upload.type == "youtube" ? "yt" : upload.type}
                          </span>
                          <Link
                            href={
                              upload?.type == "url"
                                ? upload?.url
                                : upload?.path || "/admin"
                            }
                            target="_blank"
                            className="hover:text-theme-blue overflow-hidden max-w-full break-words"
                          >
                            {upload.title}
                          </Link>
                          <span className=" text-sm flex items-center justify-center">
                            {formatTimeDifference(upload.createdAt)}
                          </span>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="text-red-500 w-full text-center mt-4">
                  no uploads
                </div>
              )}
              {user.projects.filter((p: any) => p.name).length > 0 ? (
                <>
                  <div className="font-bold  text-xl mt-4">
                    Projects ({user.projects.filter((p: any) => p.name).length})
                  </div>
                  <div className="flex flex-col gap-2 mt-2 max-h-[200px] overflow-scroll border rounded-md divide-y-2 divide-border ">
                    {user.projects
                      .filter((p: any) => p.name)
                      .sort((a: any, b: any) => b.createdAt - a.createdAt)
                      .map((project: ProjectType) => (
                        <button
                          onClick={() => setSelectedChat(project)}
                          key={project.name}
                          className="gap-4 p-3 grid grid-cols-[1fr_100px] hover:text-theme-blue items-center"
                        >
                          <div className="w-full text-left">
                            {project?.name || "null"}
                          </div>
                          <span className=" text-sm flex items-center justify-center">
                            {formatTimeDifference(
                              project.createdAt as Timestamp
                            )}
                          </span>
                        </button>
                      ))}
                  </div>
                </>
              ) : (
                <div className="text-red-500 w-full text-center mt-4">
                  no projects
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col  relative h-full justify-between">
              <Button
                onClick={() => setSelectedChat(undefined)}
                className="absolute top-1 left-1"
              >
                <Icons.chevronLeft />
                back
              </Button>
              <div className=" w-full p-4 flex justify-center items-center   poppins-bold  h-16  z-30 fixed md:relative border-b border-border dark:border-none dark:border-white blurBack bg-primary/5 md:bg-card md:dark:bg-[#444748] ">
                <button
                  className="absolute pr-4 left-4 top-1/2 -translate-y-1/2 text-primary hover:opacity-60"
                  onClick={() => setSelectedChat(undefined)}
                >
                  <Icons.chevronLeft className="h-6 w-6 text-primary" />
                </button>

                <div className="grid grid-cols-[16px_1fr] pl-[35px] pr-[0px] md:pr-[35px]  w-fit gap-2 items-center mx-auto justify-center hover:opacity-60 text-fade-in ">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{backgroundColor: selectedChat?.color || "#358EF4"}}
                  />

                  <h1 className="font-bold  whitespace-nowrap capitalize w-full overflow-hidden text-ellipsis ">
                    {selectedChat?.name}
                  </h1>
                </div>
              </div>
              {!selectedChat?.chat || selectedChat?.chat?.length < 1 ? (
                <div className="text-red-500">no chat</div>
              ) : (
                <div
                  ref={chatContainer}
                  className=" p-6 pt-[76px] md:pt-4  h-full overflow-scroll  md:pb-[180px] w-full gap-4 flex flex-col"
                >
                  {selectedChat.chat.map((message: ChatLog, index: number) => (
                    <div key={index}>
                      {message.sender === "human" ? (
                        <HumanMessage message={message.text} />
                      ) : (
                        <AiMessage message={message.text} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AiMessage = ({message}: {message: string}) => {
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

export const HumanMessage = ({message}: {message: string}) => {
  return (
    <div className="max-w-[85%] w-fit rounded-[8px_8px_0px_8px] shadow-lg  border border-theme-blue bg-theme-blue/20 p-3 ml-auto ">
      {message}
    </div>
  );
};

// Function to calculate time difference and format it
const formatTimeDifference = (timestamp: Timestamp): string => {
  const now = new Date();
  const timestampDate = timestamp.toDate();
  const diffMs = now.getTime() - timestampDate.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHrs = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHrs / 24);
  const diffWeeks = Math.round(diffDays / 7);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} min ago`;
  } else if (diffHrs < 24) {
    return `${diffHrs} hr${diffHrs === 1 ? "" : "s"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  } else {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  }
};

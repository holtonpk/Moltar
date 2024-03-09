"use client";
import * as React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useProjects} from "@/context/projects-context";
import {Input} from "@/components/ui/input";
import {ProjectType} from "@/types";
import {useSelectedLayoutSegments, useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";

export const UploadList = ({collapsed}: {collapsed: boolean}) => {
  const {displayedProjects, loading, addingNewAnimation} = useProjects()!;
  const {currentUser, setShowLoginModal, setNewUser} = useAuth()!;

  return (
    <>
      {currentUser ? (
        <>
          {loading ? (
            <div className="flex-grow  flex justify-center pt-20 ">
              <Icons.loader className="animate-spin h-6 w-6 text-white" />
            </div>
          ) : (
            <>
              {collapsed ? (
                <div className="flex flex-col items-start mx-auto w-6 ">
                  {displayedProjects.map((project) => (
                    <CollapsedProject key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div
                  className={`flex flex-col  relative   flex-grow overflow-scroll fade-in
    `}
                >
                  <div className="flex justify-between items-center pl-2">
                    <span className="text-sm font-bold text-white">
                      Your Chats
                    </span>
                  </div>
                  {displayedProjects.length === 0 && (
                    <div className="flex-grow flex items-center justify-center">
                      <p className="text-white text-lg">No chats yet</p>
                    </div>
                  )}
                  <div className="flex flex-col items-start  mt-2">
                    {addingNewAnimation ? (
                      <>
                        <NewProject project={displayedProjects[0]} />
                        {displayedProjects
                          .slice(1)
                          .map((project: ProjectType) => (
                            <Project key={project.id} project={project} />
                          ))}
                      </>
                    ) : (
                      <>
                        {displayedProjects.map((project: ProjectType) => (
                          <Project key={project.id} project={project} />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {!collapsed && (
            <div className="flex-grow flex pt-10 fade-in">
              <div className="h-fit w-full  rounded-lg  flex flex-col gap-4 p-4 bg-[#242728] border-white/30 border">
                <p className="text-lg text-center text-white">
                  Create an account to save your chats, projects and so much
                  more
                </p>

                <Button
                  onClick={() => {
                    setNewUser(true);
                    setShowLoginModal(true);
                  }}
                  className="text-white text-sm bg-transparent  w-full bg-gradient-to-b from-theme-purple via-theme-green to-theme-blue p-[2px]"
                >
                  <span className="bg-[#242728] w-full h-full rounded-md flex items-center justify-center hover:bg-opacity-80">
                    Sign up
                  </span>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

const NewProject = ({project}: {project: ProjectType}) => {
  const {addingNewAnimation, setAddingNewAnimation} = useProjects()!;

  const projectName = project?.name;

  const [displayName, setDisplayName] = React.useState("");

  // animation for new projects
  React.useEffect(() => {
    if (addingNewAnimation) {
      setDisplayName("");
      const animationInterval = setInterval(() => {
        setDisplayName((prevDisplayName) => {
          if (projectName.length > prevDisplayName.length) {
            return prevDisplayName + projectName[prevDisplayName.length];
          } else {
            clearInterval(animationInterval);
            setAddingNewAnimation(false);
            return prevDisplayName; // Ensure to return the current state to avoid unintended changes
          }
        });
      }, 70); // Adjust the speed of the animation here (milliseconds)

      return () => clearInterval(animationInterval);
    } else {
      setDisplayName(projectName);
    }
  }, [addingNewAnimation, projectName, setAddingNewAnimation]);

  return (
    <div
      className={`relative  w-full   group overflow-hidden  rounded-lg  bg-white/10 fade-in

    `}
    >
      <div className="z-10 relative w-full py-3 px-2 grid-cols-[18px_1fr] gap-2 grid items-start p-1">
        <span
          style={{backgroundColor: project.color}}
          className={`h-4 w-4 rounded-sm mt-1

        `}
        />
        <p className="text-card text-left whitespace-nowrap flex-grow text-ellipsis max-w-full overflow-hidden text-white relative z-10">
          {displayName}
        </p>
      </div>
    </div>
  );
};

const Project = ({project}: {project: ProjectType}) => {
  const {DeleteProject, ChangeProjectName, ChangeProjectColor} = useProjects()!;
  const [hovered, setHovered] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const ItemRef = React.useRef<HTMLDivElement>(null);
  const MenuRef = React.useRef(menuOpen);

  const segments = useSelectedLayoutSegments();

  React.useEffect(() => {
    const Item = ItemRef.current;
    if (Item === null) return;
    Item.addEventListener("mouseenter", () => {
      setHovered(true);
    });
    Item.addEventListener("mouseleave", () => {
      if (!MenuRef.current) {
        setHovered(false);
      }
    });

    return () => {
      Item.removeEventListener("mouseenter", () => {
        setHovered(true);
      });
      Item.removeEventListener("mouseleave", () => {
        if (!MenuRef.current) {
          setHovered(false);
        }
      });
    };
  }, []);

  React.useEffect(() => {
    MenuRef.current = menuOpen;
    if (!menuOpen) {
      setHovered(false);
    }
  }, [menuOpen]);

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const tagColors = ["#358EF4", "#4AAB67", "#9164F0", "#E5560A", "#ED8D16"];

  const [openMenu, setOpenMenu] = React.useState(false);
  const nameRef = React.useRef<HTMLInputElement>(null);

  const [selectedColor, setSelectedColor] = React.useState<string>(
    project?.color || ""
  );

  function onSave() {
    const inputValue = nameRef.current?.value;
    // Update the name if the conditions are met
    if (project?.id && inputValue && inputValue !== project?.name) {
      ChangeProjectName(project?.id, inputValue);
    }

    // Update the color if a color is selected and we have a project ID
    if (selectedColor && project?.id) {
      ChangeProjectColor(project?.id, selectedColor);
    }
  }

  const router = useRouter();

  const activeTab = segments.slice(-1)[0] === project.id;

  return (
    <div
      ref={ItemRef}
      className={`relative  w-full   group overflow-hidden  rounded-lg   
    ${activeTab ? "bg-white/10" : hovered ? "bg-white/5" : "bg-transparent"}

    `}
    >
      <Link
        href={"/chat/" + project.id}
        className="z-10 relative w-full py-3 px-2  grid-cols-[18px_1fr] gap-2 grid items-start p-1"
      >
        <span
          style={{backgroundColor: project.color}}
          className={`h-4 w-4 rounded-sm mt-1

        `}
        />
        <p className="text-card text-left whitespace-nowrap flex-grow text-ellipsis max-w-full overflow-hidden text-white relative z-10">
          {project?.name}
        </p>
      </Link>

      <div
        className={`flex absolute right-0  px-4 z-20 h-full top-1/2  w-16 -translate-y-1/2   items-center justify-end
      ${hovered ? "opacity-100" : "opacity-0"}
      ${
        activeTab
          ? "project-hover-bg-gradient-active opacity-100"
          : "project-hover-bg-gradient"
      }
      `}
      >
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger>
            <Icons.ellipsis className="h-4 w-4 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-border dark:border-gray-500 l">
            <DropdownMenuItem
              onSelect={() => setOpenMenu(true)}
              className=" gap-2 "
            >
              <Icons.pencil className="h-4 w-4 " />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-theme-red  focus:bg-theme-red/20 focus:text-theme-red gap-2 "
            >
              <Icons.trash className="h-4 w-4 " />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                  DeleteProject(project.id);
                  setShowDeleteDialog(false);

                  router.push("/upload");
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

const CollapsedProject = ({project}: {project: ProjectType}) => {
  const ItemRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    const itemRef = ItemRef.current; // Copy ItemRef.current to a variable inside the effect

    if (itemRef === null) return;

    const handleMouseEnter = () => {
      const toolTip = document.getElementById(project.id + "-toolTip");
      if (toolTip) {
        toolTip.classList.remove("hidden");
      }
    };

    const handleMouseLeave = () => {
      const toolTip = document.getElementById(project.id + "-toolTip");
      if (toolTip) {
        toolTip.classList.add("hidden");
      }
    };

    itemRef.addEventListener("mouseenter", handleMouseEnter);
    itemRef.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      itemRef.removeEventListener("mouseenter", handleMouseEnter);
      itemRef.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ItemRef, project.id]);

  const segments = useSelectedLayoutSegments();

  return (
    <Link
      href={"/chat/" + project.id}
      ref={ItemRef}
      className="h-[36px] grid grid-cols-[24px_1fr] fade-in w-fit   z-30 group relative"
    >
      <span
        className={`w-6 aspect-square rounded-md relative  cursor-pointer
        ${
          segments.slice(-1)[0] === project.id ? "border" : "group-hover:border"
        }
        `}
        style={{background: project.color}}
      />
      <div
        id={project.id + "-toolTip"}
        className="hidden fade-in-fast  bg-card text-primary ml-6  border z-[60] rounded-md p-2 h-fit w-fit min-w-[200px] max-w-[350px] text-sm"
      >
        {project.name}
      </div>
    </Link>
  );
};

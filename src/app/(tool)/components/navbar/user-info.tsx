import {Button} from "@/components/ui/button";
import {LinkButton} from "@/components/ui/link";
import {useAuth} from "@/context/user-auth";
import Image from "next/image";
import {useNavbar} from "@/context/navbar-context";
export const UserInfo = () => {
  const {collapsed} = useNavbar()!;
  const {currentUser} = useAuth()!;

  return (
    <>
      {currentUser ? (
        <div className="flex flex-col gap-4 items-center border-y border-border  relative  py-4 px-2 ">
          {!collapsed ? (
            <LinkButton
              href={"/settings"}
              className="grid grid-cols-[32px_1fr] gap-2 w-full items-center  group p-0 bg-background  hover:bg-background fade-in"
            >
              <div className="h-8 w-8 overflow-hidden relative rounded-full bg-primary/30">
                <Image
                  src={currentUser?.photoURL || ""}
                  alt={currentUser?.displayName || "User"}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col  cursor-pointer">
                <p className="text-[12px] font-bold text-primary group-hover:opacity-70">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-primary/60 text-[12px] group-hover:opacity-70">
                  {currentUser?.email || ""}
                </p>
              </div>
            </LinkButton>
          ) : (
            <div className="h-8 w-8 rounded-full bg-white/30 overflow-hidden relative">
              <Image
                src={currentUser?.photoURL || ""}
                alt={currentUser?.displayName || "User"}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
        </div>
      ) : (
        <>
          {!collapsed && (
            <div className="flex flex-col gap-4 items-center border-b border-border  relative mt-auto"></div>
          )}
        </>
      )}
    </>
  );
};

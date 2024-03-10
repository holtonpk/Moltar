import {Button} from "@/components/ui/button";
import {LinkButton} from "@/components/ui/link";
import {useAuth} from "@/context/user-auth";
import Image from "next/image";
export const UserInfo = ({collapsed}: {collapsed: boolean}) => {
  const {currentUser} = useAuth()!;

  return (
    <>
      {currentUser ? (
        <div className="flex flex-col gap-4 items-center border-y border-white/30  relative  py-4 px-2">
          {!collapsed ? (
            <LinkButton
              href={"/settings"}
              className="grid grid-cols-[32px_1fr] gap-2 w-full items-center  group p-0 "
            >
              <div className="h-8 w-8 overflow-hidden relative rounded-full bg-white/30">
                <Image
                  src={currentUser?.photoURL || ""}
                  alt={currentUser?.displayName || "User"}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col  cursor-pointer">
                <p className="text-[12px] font-bold text-white group-hover:opacity-70">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-white/60 text-[12px] group-hover:opacity-70">
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
            <div className="flex flex-col gap-4 items-center border-b border-white/30  relative mt-auto"></div>
          )}
        </>
      )}
    </>
  );
};

import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/user-auth";
import Image from "next/image";
export const UserInfo = ({collapsed}: {collapsed: boolean}) => {
  const {currentUser, logOut} = useAuth()!;

  async function sOut() {
    const log = await logOut();
  }

  return (
    <>
      {currentUser ? (
        <div className="flex flex-col gap-4 items-center border-y border-white/30  relative  p-4 ">
          {!collapsed ? (
            <div className="flex flex-row gap-2 w-full items-center   ">
              <div className="h-8 w-8 overflow-hidden relative rounded-full bg-white/30">
                <Image
                  src={currentUser?.photoURL || ""}
                  alt={currentUser?.displayName || "User"}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col group cursor-pointer">
                <p className="text-[12px] font-bold text-white group-hover:opacity-70">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-white/60 text-[12px] group-hover:opacity-70">
                  {currentUser?.email || ""}
                </p>
              </div>
              {/* <Button
                size={"sm"}
                className="text-white text-sm bg-transparent border-[#E4E4E7] border hover:bg-white/15"
              >
                Upgrade
              </Button> */}
            </div>
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
      <button className="absolute bg-red-500" onClick={sOut}>
        L
      </button>
    </>
  );
};

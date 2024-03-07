import {Button} from "@/components/ui/button";

export const UserInfo = ({collapsed}: {collapsed: boolean}) => {
  return (
    <div className="flex flex-col gap-4 items-center border-y border-white/30  relative  p-4 ">
      {!collapsed ? (
        <div className="flex flex-row gap-2 w-full items-center justify-between  ">
          {/* <div className="h-8 w-8 rounded-full bg-white/30"></div> */}
          <div className="flex flex-col group cursor-pointer">
            <p className="text-[12px] font-bold text-white group-hover:opacity-70">
              John Doe
            </p>
            <p className="text-white/60 text-[12px] group-hover:opacity-70">
              email@gmail.com
            </p>
          </div>
          <Button
            size={"sm"}
            className="text-white text-sm bg-transparent border-[#E4E4E7] border hover:bg-white/15"
          >
            Upgrade
          </Button>
        </div>
      ) : (
        <div className="h-8 w-8 rounded-full bg-white/30"></div>
      )}
    </div>
  );
};

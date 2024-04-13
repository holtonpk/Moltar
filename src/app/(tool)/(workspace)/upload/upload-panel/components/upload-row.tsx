import {Icons} from "@/components/icons";
import {ScrollArea, ScrollBar2} from "@/components/ui/scroll-area";
import {LucideIcon} from "lucide-react";

export const UploadRow = ({
  title,
  Icon,
  color,
  collapsed,
  children,
}: {
  title: string;
  Icon: LucideIcon;
  color: string;
  collapsed: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1 px-2 w-full">
      <div className="poppins-bold font-bold text-lg w-full text-center pl-6 pb-0 md:text-left  h-fit mb-2 mt-6  flex items-center gap-2">
        <div
          style={{background: `rgba(${color}, .2)`}}
          className="flex items-center justify-center p-1 rounded-md aspect-square bg-opacity-5"
        >
          <Icon
            style={{color: `rgba(${color})`}}
            className="h-5 w-5 inline-block "
          />
        </div>
        {title}
      </div>
      <div className="w-full h-f relative   rounded-lg  overflow-hidden border  border-border shadow-lg">
        <div className="absolute w-20 h-full right-0 top-0 upload-row-edge-grad-right z-30 pointer-events-none" />
        <div className="absolute w-10 h-full left-0 top-0 upload-row-edge-grad-left z-30 pointer-events-none" />
        <ScrollArea
          className={` w-full h-fit items-center    mx-auto   gap-4 bg-card  py-5  relative
        ${collapsed ? "md:flex grid grid-cols-1 " : "md:flex grid-cols-1 "}
        `}
        >
          <div className="w-fit flex gap-4 h-fit items-center px-6  z-10">
            {children}
          </div>
          <ScrollBar2
            orientation="horizontal"
            className="z-30 w-[90%]  mx-auto  rounded-full mb-1"
          />
        </ScrollArea>
      </div>
    </div>
  );
};

export const UploadRow = ({
  title,
  collapsed,
  children,
}: {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-lg w-full text-center pb-2  md:text-left p-6 px-3">
        {title}
      </h1>
      <div
        className={`grid  items-center  mx-auto h-fit gap-4 bg-primary/5  w-full overflow-scroll pb-6
        ${collapsed ? "md:flex grid grid-cols-1 " : "md:flex grid-cols-1 "}
        `}
      >
        <div className="w-fit flex gap-4  items-center px-6 py-3">
          {children}
        </div>
      </div>
    </div>
  );
};

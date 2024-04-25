import {Icons} from "@/components/icons";

const features = [
  {
    name: "Add your upload",
    description:
      "Simply select your upload or paste the URL of the content you want to analyze",
    icon: "upload" as keyof typeof Icons,
    image: "1.png",
  },
  {
    name: "Create a new project",
    description:
      "Select your upload to start a new project. Want to review your upload don't worry Moltar provides a clean view of your upload for easy review.",
    icon: "add" as keyof typeof Icons,
    image: "2.png",
  },
  {
    name: "Start Chatting",
    description:
      "Ask Moltar any question you have about the content you uploaded. Moltar will provide you with the best answer possible.",
    icon: "chat" as keyof typeof Icons,
    image: "3.png",
  },
];

const Steps = () => {
  return (
    <section
      id="features"
      className="flex flex-col items-center container mt-8"
    >
      <div className="mx-auto text-center flex flex-col items-center ">
        <span className="flex flex-col md:flex-row items-center gap-2 w-fit mx-auto font-display text-4xl font-extrabold leading-tight text-primary sm:text-5xl sm:leading-tight">
          As simple as
          <span className="bg-gradient-to-r to-theme-purple via-theme-green from-theme-blue bg-clip-text text-transparent">
            1,2,3
          </span>{" "}
        </span>
        {/* <p className="mt-5 text-muted-foreground sm:text-lg max-w-xl">
          Stay ahead of the curve with our advanced trend tracking features.
          Predict the market movement before it happens and position your
          dropshipping business for success with Moltar.
        </p> */}
      </div>
      <div className="grid  relative mt-8 ">
        <div className="flex flex-col justify-center  w-full  relative  items-center gap-8 md:gap-[2px]">
          <span className="w-[2px] h-[100px] bg-gradient-to-t  from-primary hidden md:block   " />
          {features.map((feature, indx) => (
            <FeatureCard
              key={indx}
              index={indx + 1}
              data={feature}
              reverse={indx % 2 !== 0}
            />
          ))}
          <span className="w-[2px] h-[260px]  bg-gradient-to-b from-primary hidden md:block " />
        </div>
      </div>
    </section>
  );
};

export default Steps;

interface FeatureCardProps {
  data: {
    name: string;
    description: string;
    icon: keyof typeof Icons;
    image: string;
  };
  index: number;
}
export const FeatureCard = ({
  data,
  index,
  reverse = false,
}: FeatureCardProps & {reverse?: boolean}) => {
  const Icon = Icons[data.icon];

  const baseClass = "relative overflow-visible rounded-lg h-fit px-4 ";
  const flexDirectionClass = reverse
    ? "md:items-center md:text-center"
    : "md:items-center md:text-center";

  return (
    <div className="grid md:grid-cols-2 gap-10 items-start  relative overflow-visible h-fit ">
      {!reverse && <div className="md:block hidden" />}

      <div className={baseClass}>
        <div
          className={`flex h-fit border-border  p-3 blurBack border flex-col items-center justify-between rounded-lg text-center ${flexDirectionClass} 
          ${
            index === 1
              ? "bg-theme-blue/20"
              : index === 2
              ? "bg-theme-green/20"
              : "bg-theme-purple/20"
          }
          `}
        >
          <div
            className={`p-3 flex items-center justify-center w-fit h-fit mb-2 rounded-md  
           ${
             index === 1
               ? "bg-theme-blue/20"
               : index === 2
               ? "bg-theme-green/20"
               : "bg-theme-purple/20"
           }`}
          >
            <Icon
              className={` ${
                index === 1
                  ? "text-theme-blue"
                  : index === 2
                  ? "text-theme-green"
                  : "text-theme-purple"
              }`}
            />
          </div>

          <h3 className="font-bold text-center text-base md:text-xl">
            {data.name}
          </h3>
          <p className="text-[12px] md:text-sm text-muted-foreground w-full">
            {data.description}
          </p>
          <div className="h-[100px] w-full relative overflow-visible mt-6 p-2">
            <div
              className={`w-full bg-muted border-2 border-theme-blue rounded-md aspect-[1920/1080] left-1/2 -translate-x-1/2 overflow-hidden absolute
            ${
              index === 1
                ? "border-theme-blue"
                : index === 2
                ? "border-theme-green"
                : "border-theme-purple"
            }
            `}
            >
              <img src={`/steps/${data.image}`} />
            </div>
          </div>
        </div>
      </div>
      <DashLine index={index} reverse={reverse} />
    </div>
  );
};

const DashLine = ({index, reverse}: {index: number; reverse: boolean}) => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full items-center flex-col hidden md:flex w-[50px] ">
      <span className=" h-[20px] border border-dashed border-primary " />
      <span
        className={`flex items-center justify-center p-1 aspect-square border rounded-full font-bold text-3xl relative
      
      ${
        index === 1
          ? "border-theme-blue text-theme-blue"
          : index === 2
          ? "border-theme-green text-theme-green"
          : "border-theme-purple text-theme-purple"
      }
      
      `}
      >
        {index}
        <div
          className={`absolute  h-[1px] w-4 
          ${
            index === 1
              ? "from-theme-blue"
              : index === 2
              ? "from-theme-green"
              : "from-theme-purple"
          }
        ${
          !reverse
            ? "right-0 translate-x-full bg-gradient-to-r  to-border"
            : "left-0 -translate-x-full bg-gradient-to-l  to-border"
        }
        
        `}
        ></div>
      </span>
      <span className=" flex-grow border border-dashed border-primary " />
    </div>
  );
};

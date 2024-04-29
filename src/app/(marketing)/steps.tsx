"use client";
import {Icons} from "@/components/icons";
import {motion} from "framer-motion";

const features = [
  {
    name: "Add your upload",
    description:
      "Simply select your upload or paste the URL of the content you want to analyze",
    icon: "upload" as keyof typeof Icons,
    image: {dark: "1-dark.png", light: "1-light.png"},
  },
  {
    name: "Create a new project",
    description:
      "Select your upload to start a new project. Want to review your upload don't worry Moltar provides a clean view of your upload for easy review.",
    icon: "add" as keyof typeof Icons,
    image: {
      dark: "2-dark.png",
      light: "2-light.png",
    },
  },
  {
    name: "Start Chatting",
    description:
      "Ask Moltar any question you have about the content you uploaded. Moltar will provide you with the best answer possible.",
    icon: "chat" as keyof typeof Icons,
    image: {
      dark: "3-dark.png",
      light: "3-light.png",
    },
  },
];

const Steps = () => {
  return (
    <section
      id="features"
      className="flex flex-col items-center container mt-8"
    >
      <motion.div
        initial={{opacity: 0, y: 10}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true, amount: 0.4}}
        className="mx-auto text-center flex flex-col items-center "
      >
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
      </motion.div>
      <div className="grid  relative mt-8 ">
        <div className="flex flex-col justify-center  w-full  relative  items-center gap-10 md:gap-[2px]">
          <span className="w-[2px] h-[100px] bg-gradient-to-t  dark:from-primary from-primary/70 hidden md:block   " />
          {features.map((feature, indx) => (
            <FeatureCard
              key={indx}
              index={indx + 1}
              data={feature}
              reverse={indx % 2 !== 0}
            />
          ))}
          <span className="w-[2px] h-[260px]  bg-gradient-to-b dark:from-primary from-primary/70  hidden md:block " />
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
    image: {
      dark: string;
      light: string;
    };
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
        <motion.div
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.3}}
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
          <h1
            className={`md:hidden absolute right-0 left-0 -translate-x-1/2 -translate-y-1/2 font-bold border rounded-full aspect-square text-background h-12 w-12 text-xl flex items-center justify-center 
          ${
            index === 1
              ? "bg-theme-blue border-theme-blue"
              : index === 2
              ? "bg-theme-green border-theme-green"
              : "bg-theme-purple border-theme-purple"
          }
          
          `}
          >
            {index}
          </h1>
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
          <div className="md:h-[100px] w-full relative overflow-visible mt-6 p-2">
            <div
              className={`w-full bg-muted border-2 border-theme-blue rounded-md aspect-[1920/1080] md:left-1/2 md:-translate-x-1/2 overflow-hidden md:absolute relative
            ${
              index === 1
                ? "border-theme-blue"
                : index === 2
                ? "border-theme-green"
                : "border-theme-purple"
            }
            `}
            >
              <img className="dark:hidden" src={`/steps/${data.image.light}`} />
              <img
                className="dark:block hidden"
                src={`/steps/${data.image.dark}`}
              />
            </div>
          </div>
        </motion.div>
      </div>
      <DashLine index={index} reverse={reverse} />
    </div>
  );
};

const DashLine = ({index, reverse}: {index: number; reverse: boolean}) => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full items-center flex-col hidden md:flex w-[50px] ">
      <span className=" h-[20px] border border-dashed dark:border-primary border-primary/70 " />
      <div
        className={` flex items-center justify-center p-1 aspect-square border rounded-full font-bold text-3xl relative
      
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
      </div>
      <span className=" flex-grow border border-dashed dark:border-primary border-primary/70 " />
    </div>
  );
};

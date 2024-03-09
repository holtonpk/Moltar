import React from "react";
import HeroHeader from "@/src/app/(marketing)/hero-header";
import {Icons} from "@/components/icons";

const features = [
  {
    name: "Simplified Account Growth Visualization",
    description:
      "Enjoy a user-friendly interface that allows for effortless monitoring and visualization of account growth, promoting data-driven decision-making.",
    icon: "analytics" as keyof typeof Icons,
  },
  {
    name: "Understand High-Performing Content",
    description:
      "Gain valuable insights into the dynamics of the most successful content in your niche, allowing you to adapt your strategies and improve your content quality.",
    icon: "media" as keyof typeof Icons,
  },
  {
    name: "Brand Analysis",
    description:
      "Utilize our advanced tools to conduct a detailed analysis of your branding strategies, empowering you to understand and optimize your brand's positioning in the market.",
    icon: "search" as keyof typeof Icons,
  },
];

const Analyze = () => {
  return (
    <section id="features" className="flex flex-col items-center container">
      <div className="mx-auto text-center flex flex-col items-center ">
        <span className="flex flex-col md:flex-row items-center gap-2 w-fit mx-auto font-display text-4xl font-extrabold leading-tight text-primary sm:text-5xl sm:leading-tight">
          Master market
          <span className="bg-gradient-to-r to-amber-400 via-orange-500 from-red-500 bg-clip-text text-transparent">
            trends
          </span>{" "}
        </span>
        <p className="mt-5 text-muted-foreground sm:text-lg max-w-xl">
          Stay ahead of the curve with our advanced trend tracking features.
          Predict the market movement before it happens and position your
          dropshipping business for success with Moltar.
        </p>
      </div>
      <div className="grid  relative py-10">
        <div className="flex flex-col justify-center  w-full  relative  items-center gap-8 md:gap-[2px]">
          <span className="w-[2px] h-[60px] bg-gradient-to-t  from-accent hidden md:block   " />
          {features.map((feature, indx) => (
            <FeatureCard key={indx} data={feature} reverse={indx % 2 !== 0} />
          ))}
          <span className="w-[2px] h-[160px]  bg-gradient-to-b from-accent hidden md:block " />
        </div>
      </div>
    </section>
  );
};

export default Analyze;

interface FeatureCardProps {
  data: {
    name: string;
    description: string;
    icon: keyof typeof Icons;
  };
}
export const FeatureCard = ({
  data,
  reverse = false,
}: FeatureCardProps & {reverse?: boolean}) => {
  const Icon = Icons[data.icon];

  const baseClass = "relative overflow-hidden rounded-lg h-fit md:p-2 ";
  const flexDirectionClass = reverse
    ? "md:items-end md:text-right "
    : "md:items-start md:text-left";

  return (
    <div className="grid md:grid-cols-2 gap-8 relative overflow-hidden h-fit ">
      {!reverse && <div className="md:block hidden" />}

      <div className={baseClass}>
        <div
          className={`flex h-fit flex-col items-center justify-between rounded-md text-center ${flexDirectionClass}`}
        >
          <div className="bg-muted p-3 flex items-center justify-center w-fit h-fit mb-2 rounded-md border-accent border ">
            <Icon className="text-muted-foreground" />
          </div>

          <h3 className="font-bold text-center text-base md:text-xl">
            {data.name}
          </h3>
          <p className="text-[12px] md:text-sm text-muted-foreground w-full">
            {data.description}
          </p>
        </div>
      </div>

      {reverse && <div className="md:block hidden" />}
      <DashLine />
    </div>
  );
};

const DashLine = () => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full items-center flex-col hidden md:flex">
      <span className=" h-[20px] border border-dashed border-accent " />
      <span className="h-4 w-4 border rounded-full border-accent " />
      <span className=" flex-grow border border-dashed border-accent " />
    </div>
  );
};

"use client";
import React from "react";
import HeroHeader from "@/app/(marketing)/hero-header";
import { Icons } from "@/components/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FeatureCard } from "./analyze";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const Discover = () => {
  return (
    <section id="discover" className="flex flex-col items-center ">
      <HeroHeader
        gradient="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400"
        lineColor=" from-sky-500 "
        lineHeight="h-[300px]"
        number="1"
        title="Discover"
        subtitle="Explore 500+ active sellers"
        description={`Immerse yourself in ${siteConfig.name}'s vast network of over 500 active sellers. `}
      />
      <div className="lg:grid lg:grid-cols-2 gap-10 items-center grid lg:w-[90%] mt-16 ">
        <div className="absolute lg:flex  flex-col items-center h-[580px] lg:h-[600px] hidden gap-[1px]  md:h-[600px] left-1/2 -translate-x-1/2">
          <span className="w-[1px] h-[50px] bg-gradient-to-t  from-accent " />
          <span className="h-4 w-4 border rounded-full border-accent " />
          <span className="w-[1px] h-[180px] border border-dashed border-accent " />
          <span className="h-4 w-4 border rounded-full border-accent" />
          <span className="w-[1px] h-[180px] border border-dashed border-accent " />
          <span className="h-4 w-4 border rounded-full border-accent" />
          <span className="w-[1px] h-[180px] bg-accent border-accent " />
        </div>
        <div className=" lg:w-full w-[80%] mx-auto lg:mx-0 h-[500px] sm:h-[600px]   lg:h-[600px]  md:h-[600px] relative ">
          <div className="lg:w-[80%] w-[95%]  max-h-[400px] relative aspect-[1.2/1] md:aspect-[1.4/1] rounded  ">
            <div className="absolute w-full h-full blur-[20px] opacity-10 bg-primary"></div>
            <div className="relative z-10 w-full h-full rounded-md overflow-hidden bg-primary/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur">
              <div className="top-0 h-10 border-b relative">
                <div className="flex gap-2 w-fit top-0 left-0 p-3">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                </div>
                <div className="h-6  w-[50%] text-sm px-7 text-primary rounded-md bg-muted-foreground/20 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center">
                  <Icons.lock className="h-3 w-3  absolute left-2 top-1/2 -translate-y-1/2" />
                  <h1 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {`${siteConfig.url}/accounts/accountDatabase`}
                  </h1>
                  <Icons.rotate className="h-3 w-3  absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="h-full w-full p-4">
                <div className="flex gap-4">
                  <div className="w-1/2 h-6 rounded-md bg-muted"></div>
                  <div className="w-10 h-6 rounded-md bg-muted"></div>
                  <div className="w-10 h-6 rounded-md bg-muted"></div>
                </div>
                <div className="gap-4 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5  w-full mx-auto pt-4   ">
                  <span className="bg-accent h-[100px] w-full rounded-md relative">
                    <Icons.mousePointer className="h-6 w-6 absolute fill-black top-[30%] left-[55%] -translate-x-1/2 -translate-y-1/2" />
                  </span>
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                  <span className="bg-muted h-[100px] w-full rounded-md" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[80%] w-[95%] z-20  relative h-fit    rounded   lg:translate-x-[20%] translate-x-[5%] sm:-translate-y-[40%]   -translate-y-[20%] bg-background  ">
            <div className="absolute w-full h-full blur-[20px] opacity-10 bg-primary" />
            <div className="relative w-full h-full z-20  rounded-md overflow-hidden  ">
              <div className="top-0 h-10 border-b relative bg-background/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur">
                <div className="flex gap-2 w-fit top-0 left-0 p-3">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                </div>
                <div className="h-6  w-[50%] text-sm px-7 text-primary rounded-md bg-muted-foreground/20 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center">
                  <Icons.lock className="h-3 w-3  absolute left-2 top-1/2 -translate-y-1/2" />
                  <h1 className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {`${siteConfig.url}/accounts/viewAccount`}
                  </h1>
                  <Icons.rotate className="h-3 w-3  absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="h-full w-full p-4 relative bg-background">
                <div className="flex w-full gap-4">
                  <span className=" h-16 w-16 bg-muted rounded-md relative overflow-hidden border">
                    <Image
                      src="/image/account-avatar.webp"
                      alt="img"
                      fill
                      objectFit="contain"
                    />
                  </span>
                  <div className="flex flex-col ">
                    <h1 className=" rounded-md text-lg ">Juice-O-Matic</h1>
                    <h2 className=" rounded-md text-muted-foreground">
                      @juice.o.matic
                    </h2>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 relative">
                  <span className="sm:h-40 w-full border rounded-md  h-[100px] relative overflow-hidden">
                    <div className="absolute  w-[105%] -bottom-1 h-full  left-1/2 -translate-x-1/2  mt-auto">
                      <Graph
                        labels={[1, 2, 3, 4, 5, 6, 7]}
                        data={[5, 8, 15, 12, 13, 28, 35]}
                      />
                    </div>
                  </span>
                  <span className="md:h-40 w-full border rounded-md h-[100px] relative overflow-hidden">
                    <div className="absolute  w-[105%] -bottom-1 h-full  left-1/2 -translate-x-1/2  mt-auto">
                      <Graph
                        labels={[1, 2, 3, 4, 5, 6, 7]}
                        data={[17, 17, 15, 17, 26, 20, 22]}
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col  p-6 justify-between h-full lg:h-[600px] relative">
          {features.map((feature, i) => (
            <FeatureCard key={i} data={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Discover;

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

const Graph = ({ labels, data }: any) => {
  const chartRef = React.useRef<any>();
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );

  type StyleType = {
    getPropertyValue: (prop: string) => string;
  };

  var style: StyleType;

  if (typeof window !== "undefined") {
    style = getComputedStyle(document.body);
  } else {
    style = {
      getPropertyValue: () => "", // default function that returns an empty string
    };
  }

  const configGradient = React.useCallback(() => {
    if (chartRef.current) {
      const chartInstance = chartRef.current;
      const ctx = chartInstance.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, chartInstance.height);
      const h = style.getPropertyValue("--primary-h");
      const s = style.getPropertyValue("--primary-s");
      const l = style.getPropertyValue("--primary-l");

      gradient.addColorStop(
        0,
        `hsla(${h},${s},${l} 
            , 0.1)`
      );
      gradient.addColorStop(
        1,
        `hsla(${h},${s},${l} 
            , 0.01)`
      );

      chartInstance.data.datasets[0].backgroundColor = gradient;
      chartInstance.update();
    }
  }, [style]);

  React.useEffect(() => {
    configGradient();
  }, [configGradient]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      y: {
        display: false,
        ticks: {
          display: false,
        },
        grid: {
          drawBorder: false,
          display: false,
        },
      },
      x: {
        display: false,
        ticks: {
          display: false,
        },
        grid: {
          drawBorder: false,
          display: false,
        },
      },
    },
    layout: {},
    elements: {
      point: {
        radius: 0,
        borderWidth: 0,
      },
    },
  };

  const dataObject = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: data,
        fill: true,
        borderColor: `hsl(${style.getPropertyValue("--primary")})`,
        lineTension: 0.2,
      },
    ],
  };

  return <Line ref={chartRef} options={options} data={dataObject} />;
};

"use client";

import Link from "next/link";

import {Icons} from "@/components/icons";
import {useState, useEffect} from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {AnimatePresence, motion} from "framer-motion";
// import { useLinkQRModal } from "#/ui/modals/link-qr-modal";
// import { DEFAULT_LINK_PROPS } from "#/lib/constants";
// import { useAddEditLinkModal } from "#/ui/modals/add-edit-link-modal";
import {Link2} from "lucide-react";

const featureList = [
  {
    key: "Account Database",
    title: "Account Database",
    description:
      "Leverage our comprehensive database featuring over 500 active sellers to perform detailed market analysis and glean valuable insights.",
    icon: "accounts" as keyof typeof Icons,

    demo: "https://firebasestorage.googleapis.com/v0/b/tikdrop-788d3.appspot.com/o/demo%2Faccount-datbase-demo.mp4?alt=media&token=c511e3f3-8faa-4a30-9aec-fa7c85716b1a",
    thumbnail: "/_static/features/AccountDatabase.png",
  },
  {
    key: "Top Account",
    title: "Top Account",
    description:
      "Effortlessly access a clear, daily ranking of top-performing accounts to stay updated with leading market players and their strategies.",
    icon: "rank" as keyof typeof Icons,
    demo: "https://firebasestorage.googleapis.com/v0/b/tikdrop-788d3.appspot.com/o/demo%2Ftop-accounts-demo.mp4?alt=media&token=fdbb4d64-c483-4a13-8741-4271c16ce986",
    thumbnail: "/_static/features/TopAccounts.png",
  },
  {
    key: "Account Collections",
    title: "Account Collections",
    description:
      "Utilize our Account Tracker to monitor account growth, analyze trend patterns, and make informed decisions based on this data.",
    icon: "crosshair" as keyof typeof Icons,
    demo: "https://firebasestorage.googleapis.com/v0/b/tikdrop-788d3.appspot.com/o/demo%2Faccount-collections-demo.mp4?alt=media&token=9eb039b1-3939-4dcf-990c-183999c2cc85",
    thumbnail: "/_static/features/AccountCollections.png",
  },
  {
    key: "Product Database",
    title: "Product Database",
    description:
      "Harness our extensive Product Database to identify top-selling items and understand the dynamics behind their success.",
    icon: "database" as keyof typeof Icons,
    demo: "https://firebasestorage.googleapis.com/v0/b/tikdrop-788d3.appspot.com/o/demo%2Fproduct-databse-demomp4.mp4?alt=media&token=327ba09f-c401-47ca-942f-a58060b1f3fe",
    thumbnail: "/_static/features/ProductDatabase.png",
  },
  {
    key: "Product Tracker",
    title: "Product Tracker",
    description:
      "Discover trending products, track their performance, and gain a competitive edge by understanding the factors contributing to their popularity.",
    icon: "analytics" as keyof typeof Icons,
    demo: "https://firebasestorage.googleapis.com/v0/b/tikdrop-788d3.appspot.com/o/demo%2Fproduct-tracker-demomp4.mp4?alt=media&token=0b9780a6-470b-46d6-8f68-2bc65fd4447c",
    thumbnail: "/_static/features/ProductTracker.png",
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);

  //   const { setShowAddEditLinkModal, AddEditLinkModal } = useAddEditLinkModal({
  //     props: DEFAULT_LINK_PROPS,
  //     homepageDemo: true,
  //   });
  //   const { setShowLinkQRModal, LinkQRModal } = useLinkQRModal({
  //     props: {
  //       key: "github",
  //       url: "https://github.com/steven-tey/dub",
  //     },
  //   });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div id="features">
      {featureList.map(({key, demo}) => (
        // preload videos
        <link key={key} rel="preload" as="video" href={demo} />
      ))}
      <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20 pb-10 pt-24">
        <div className="mx-auto text-center ">
          <span className="flex flex-col md:flex-row items-center gap-2 w-fit mx-auto font-display text-4xl font-extrabold leading-tight text-primary sm:text-5xl sm:leading-tight">
            Leverage the{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              power{" "}
            </span>{" "}
            of Moltar
          </span>
          <p className="mt-5 text-muted-foreground sm:text-lg">
            Unleash the potential of Moltar robust tools designed to empower
            your dropshipping business.
          </p>
        </div>

        <div className="my-10  w-full overflow-hidden rounded-xl border border-border bg-background/10 shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur ">
          <div className="grid grid-cols-1 gap-10 p-5 lg:grid-cols-3">
            <Accordion
              type="single"
              defaultValue="analytics"
              onValueChange={(e) => {
                setActiveFeature(featureList.findIndex(({key}) => key === e));
              }}
            >
              {featureList.map(({key, title, description, icon}) => (
                <Feature
                  key={key}
                  title={title}
                  description={description}
                  icon={icon}
                />
              ))}
            </Accordion>
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {featureList.map((feature, index) => {
                  if (index === activeFeature) {
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{
                          y: 10,
                          opacity: 0,
                        }}
                        animate={{y: 0, opacity: 1}}
                        exit={{
                          y: -10,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.15,
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="relative w-full h-fit overflow-hidden whitespace-nowrap rounded-2xl bg-background shadow-2xl lg:mt-10 lg:w-[700px] "
                      >
                        <video
                          autoPlay={isClient && window.innerWidth > 768}
                          muted
                          loop
                          width={700}
                          height={400}
                          poster={feature.thumbnail}
                        >
                          <source src={feature.demo} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </motion.div>
                    );
                  }
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Feature = ({title, description, icon}: any) => {
  const Icon = Icons[icon];

  return (
    <AccordionItem value={title}>
      <AccordionTrigger>
        <div className="flex items-center space-x-3 p-3">
          <Icon name={icon} className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-base font-semibold text-muted-foreground">
            {title}
          </h3>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-3">
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

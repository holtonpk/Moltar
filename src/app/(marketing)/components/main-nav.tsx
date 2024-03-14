"use client";

import Link from "next/link";
import Image from "next/image";
import {useParams, useSelectedLayoutSegment} from "next/navigation";
import useScroll from "@/lib/hooks/use-scroll";
import clsx from "clsx";
import {Icons} from "@/components/icons";

// import { siteConfig } from "@/config/site";
import {LinkButton} from "@/components/ui/link";
// import { marketingConfig } from "@/config/marketing";
import {cn} from "@/lib/utils";

const navItems = ["pricing", "changelog"];

const transparentHeaderSegments = new Set(["metatags", "pricing"]);

const mainNav = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
];

export default function Nav() {
  const {domain = "dub.sh"} = useParams() as {domain: string};

  const scrolled = useScroll(20);
  const segment = useSelectedLayoutSegment();

  return (
    <div
      className={clsx(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
        "border-order border-b bg-card/75 backdrop-blur-lg": scrolled,
        "border-order border-b bg-background":
          segment && !transparentHeaderSegments.has(segment),
      })}
    >
      <div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
        <div className="flex h-20 items-center justify-between w-full">
          <div className="flex justify-between md:justify-start  w-full items-end sticky  md:gap-10 ">
            <div className="grid grid-cols-[32px_1fr]  gap-2 ">
              <Icons.logoSolid className="h-8 w-8 " />

              <span className="font-bold  text-3xl  leading-[32px] fade-in text-primary">
                Moltar
              </span>
            </div>

            <nav className="hidden gap-6 md:flex ">
              {mainNav?.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${segment}`)
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center space-x-6 sm:flex">
            <LinkButton
              href="/login"
              variant="outline"
              size="sm"
              className="px-4 mr-2 whitespace-nowrap"
            >
              Login
            </LinkButton>
            <LinkButton
              href="/register"
              variant="default"
              size="sm"
              className="px-4 whitespace-nowrap "
            >
              Sign up
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}

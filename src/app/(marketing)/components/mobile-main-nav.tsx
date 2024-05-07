"use client";

import {motion, useCycle} from "framer-motion";
import Link from "next/link";
import {useParams} from "next/navigation";
import {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {Icons} from "@/components/icons";
import {LinkButton} from "@/components/ui/link";
// import { marketingConfig } from "@/config/marketing";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(0px at 100% 0)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const mainNav = [
  {
    title: "Features",
    href: "/#features",
  },
];

const navItems = ["pricing", "changelog"];

export default function MobileNav() {
  const {domain = "dub.sh"} = useParams() as {domain: string};

  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const {height} = useDimensions(containerRef);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    // Return nothing to avoid the type error
  }, [isOpen]);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      className={`absolute inset-0 z-50 w-full sm:hidden ${
        isOpen ? "" : "pointer-events-none"
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-background"
        variants={sidebar}
      />
      <motion.div
        variants={variants}
        className="absolute grid w-full gap-3 px-10 py-16"
      >
        {mainNav.map((item, i) => (
          <div key={i} className="grid gap-3">
            <MenuItem>
              <Link
                href={item.href}
                onClick={() => toggleOpen()}
                className="flex w-full font-semibold capitalize text-center text-theme-blue text-2xl rounded-md  p-3"
              >
                {item.title}
              </Link>
            </MenuItem>
            {/* <MenuItem className="my-3 h-px w-full bg-gray-300" /> */}
          </div>
        ))}

        <MenuItem key="Login">
          <LinkButton
            href="/login"
            variant="outline"
            className="flex w-full font-semibold capitalize "
          >
            Log in
          </LinkButton>
        </MenuItem>

        <MenuItem key="Signup">
          <LinkButton
            href="/register"
            className="flex w-full font-semibold capitalize p-2 items-center justify-center rounded-md"
          >
            Sign Up
          </LinkButton>
        </MenuItem>
      </motion.div>
      <MenuToggle toggle={toggleOpen} isOpen={isOpen} />
    </motion.nav>
  );
}

const MenuToggle = ({toggle, isOpen}: {toggle: any; isOpen: boolean}) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute right-5 -translate-y-1/2 top-10 z-20 text-primary"
  >
    {isOpen ? (
      <Icons.close className="w-6 h-6" />
    ) : (
      <Icons.menu className="w-6 h-6" />
    )}
  </button>
);

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.span variants={MenuItemVariants} className={className}>
      {children}
    </motion.span>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: {stiffness: 1000, velocity: -100},
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: {stiffness: 1000},
      duration: 0.04,
    },
  },
};

const variants = {
  open: {
    transition: {staggerChildren: 0.04, delayChildren: 0.2},
  },
  closed: {
    transition: {staggerChildren: 0.02, staggerDirection: -1},
  },
};

const useDimensions = (ref: any) => {
  const dimensions = useRef({width: 0, height: 0});

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return dimensions.current;
};

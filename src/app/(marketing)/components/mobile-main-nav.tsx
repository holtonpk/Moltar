"use client";

import {motion, useCycle} from "framer-motion";
import Link from "next/link";
import {useParams} from "next/navigation";
import {ReactNode, useEffect, useMemo, useRef, useState} from "react";
import {Icons} from "@/components/icons";
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
  {
    title: "Pricing",
    href: "/pricing",
  },
];

const navItems = ["pricing", "changelog"];

export default function MobileNav() {
  const {domain = "dub.sh"} = useParams() as {domain: string};

  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const {height} = useDimensions(containerRef);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      className={`fixed inset-0 z-50 w-full sm:hidden ${
        isOpen ? "" : "pointer-events-none"
      }`}
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 right-0 w-full bg-background"
        variants={sidebar}
      />
      <motion.ul
        variants={variants}
        className="absolute grid w-full gap-3 px-10 py-16"
      >
        {/* {mainNav.map((item, i) => (
          <div key={i} className="grid gap-3">
            <MenuItem>
              <Link
                href={item.href}
                onClick={() => toggleOpen()}
                className="flex w-full font-semibold capitalize"
              >
                {item.title}
              </Link>
            </MenuItem>
            <MenuItem className="my-3 h-px w-full bg-gray-300" />
          </div>
        ))} */}

        <MenuItem key="Login">
          <Link href="/login" className="flex w-full font-semibold capitalize">
            Log in
          </Link>
        </MenuItem>
        <MenuItem className="my-3 h-px w-full bg-gray-300" />

        <MenuItem key="Signup">
          <Link
            href="/onboarding/register"
            className="flex w-full font-semibold capitalize"
          >
            Sign Up
          </Link>
        </MenuItem>
      </motion.ul>
      <MenuToggle toggle={toggleOpen} isOpen={isOpen} />
    </motion.nav>
  );
}

const MenuToggle = ({toggle, isOpen}: {toggle: any; isOpen: boolean}) => (
  <button
    onClick={toggle}
    className="pointer-events-auto absolute right-5 -translate-y-1/2 top-10 z-20 text-primary"
  >
    {/* <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg> */}
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
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
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

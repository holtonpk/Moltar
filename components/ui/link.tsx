import * as React from "react";
import {VariantProps, cva} from "class-variance-authority";
import {cn} from "@/lib/utils";
import Link, {LinkProps} from "next/link";
import {HTMLProps, FC} from "react";
import {buttonVariants} from "@/components/ui/button";

export interface LinkButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  href: string;
  children?: React.ReactNode;
  target?: string;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({className, variant, size, children, target, ...props}, ref) => {
    return (
      <Link
        {...props}
        target={target}
        className={cn(
          buttonVariants({variant, size}),
          className,
          "cursor-pointer"
        )}
        ref={ref}
      >
        {children}
      </Link>
    );
  }
);
LinkButton.displayName = "LinkButton";

export {LinkButton};

import * as React from "react";
import {Icons} from "../icons";
import {cn} from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, ...props}, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className="relative w-full  h-fit">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-blue focus-visible:ring-offset-2   disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className="absolute right-0 top-0 h-10 w-10 flex justify-center items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Icons.hidePassword className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Icons.showPassword className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "Input";

export {PasswordInput};

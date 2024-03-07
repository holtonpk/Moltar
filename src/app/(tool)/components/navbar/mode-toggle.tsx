"use client";
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import {cn} from "@/lib/utils";
import {Icons} from "@/components/icons";
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";

export const ModeToggle = () => {
  const {setTheme, theme} = useTheme();

  const [checked, setChecked] = React.useState<boolean>(theme === "light");

  React.useEffect(() => {
    if (checked) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [checked, setTheme]);

  return (
    <div className="flex  gap-2 items-center  p-2 rounded-lg">
      <Switch
        defaultChecked={checked}
        checked={checked}
        onCheckedChange={setChecked}
        aria-readonly
      />
    </div>
  );
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({className, ...props}, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-white data-[state=unchecked]:bg-white/20",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none  h-5 w-5 flex items-center group justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    >
      <Icons.moon className="h-3 w-3 text-white group-data-[state=checked]:hidden" />
      <Icons.sun className="h-3 w-3 text-white group-data-[state=unchecked]:hidden" />
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export {Switch};

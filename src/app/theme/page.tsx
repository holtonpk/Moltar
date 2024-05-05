import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {ModeToggle} from "@/components/ui/mode-toggle";
import {Button} from "@/components/ui/button";
const Page = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex flex-col gap-10 p-20 ">
        <ModeToggle />
        <div className="grid grid-cols-10 gap-4 p-3 text-[12px] rounded-lg ">
          <div className=" h-full aspect-square rounded-full bg-theme-red">
            red
          </div>
          <div className="h-full aspect-square rounded-full bg-theme-orange">
            orange
          </div>
          <div className="h-full aspect-square rounded-full bg-theme-yellow">
            yellow
          </div>
          <div className="h-full aspect-square rounded-full bg-theme-green">
            green
          </div>
          <div className="h-full aspect-square rounded-full bg-theme-blue">
            blue
          </div>
          <div className="h-full aspect-square rounded-full bg-theme-purple">
            purple
          </div>
          <div className="h-full aspect-square rounded-full bg-background">
            main-background
          </div>
          <div className="h-full aspect-square rounded-full bg-foreground">
            foreground
          </div>
          <div className="h-full aspect-square rounded-full bg-card">card</div>
          <div className="h-full aspect-square rounded-full bg-card-foreground">
            card-foreground
          </div>
          <div className="h-full aspect-square rounded-full bg-popover">
            popover
          </div>
          <div className="h-full aspect-square rounded-full bg-primary">
            primary
          </div>
          <div className="h-full aspect-square rounded-full bg-primary-foreground">
            primary-foreground
          </div>
          <div className="h-full aspect-square rounded-full bg-secondary">
            secondary
          </div>
          <div className="h-full aspect-square rounded-full bg-secondary-foreground">
            secondary-foreground
          </div>
          <div className="h-full aspect-square rounded-full bg-accent">
            accent
          </div>
          <div className="h-full aspect-square rounded-full bg-accent-foreground">
            accent-foreground
          </div>
          <div className="h-full aspect-square rounded-full bg-destructive">
            destructive
          </div>
          <div className="h-full aspect-square rounded-full bg-destructive-foreground">
            destructive-foreground
          </div>
          <div className="h-full aspect-square rounded-full bg-border">
            border
          </div>
          <div className="h-full aspect-square rounded-full bg-input">
            input
          </div>
          <div className="h-full aspect-square rounded-full bg-ring">ring</div>
          <div className="h-full aspect-square rounded-full bg-radius">
            radiuss
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant={"default"}>Default</Button>
          <Button variant={"destructive"}>Destructive</Button>
          <Button variant={"outline"}>Outline</Button>
          <Button variant={"secondary"}>Secondary</Button>
          <Button variant={"ghost"}>Ghost</Button>
          <Button variant={"link"}>Link</Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Page;

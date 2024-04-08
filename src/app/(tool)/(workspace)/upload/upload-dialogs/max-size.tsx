import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Icons} from "@/components/icons";

export type MaxSizeMessage = {
  title: string;
  description: string;
};

const MaxSizeDialog = ({
  open,
  setIsOpen,
  goBackFunction,
  maxSizeMessage,
  setMaxSizeMessage,
}: {
  open: boolean;
  setIsOpen: (value: boolean) => void;
  goBackFunction: () => void;
  maxSizeMessage: MaxSizeMessage;
  setMaxSizeMessage: (value: MaxSizeMessage) => void;
}) => {
  const onOpenChange = (value: boolean) => {
    setIsOpen(value);
    if (!value) {
      setMaxSizeMessage({title: "", description: ""});
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-theme-red/10 blurBack border-theme-red text-white">
        <DialogHeader>
          <DialogTitle>{maxSizeMessage.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-white/60">
          {maxSizeMessage.description}
        </DialogDescription>
        <DialogFooter>
          <Button
            onClick={goBackFunction}
            className="bg-white hover:bg-white/70 text-black"
          >
            {/* <Icons.chevronLeft className="h-5 w-5 mr-2" /> */}
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MaxSizeDialog;

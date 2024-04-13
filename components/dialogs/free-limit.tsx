"use client";

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
import {Button} from "../ui/button";

const FreeLimitDialog = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You need to create an account to continue</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Don&apos;t worry, it's free and only takes a few seconds
        </DialogDescription>
        <DialogFooter>
          <button>Close</button>
          <Button>Upgrade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FreeLimitDialog;

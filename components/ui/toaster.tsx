"use client";
import React, {useEffect, useState} from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import {useToast} from "@/components/ui/use-toast";
import {useToastLong} from "@/components/ui/use-toast-long";

export function Toaster() {
  const {toasts} = useToast();
  const {toastsLong} = useToastLong();

  // get screen width
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, [window.innerWidth]);

  return (
    <>
      <ToastProvider>
        {toasts.map(function ({id, title, description, action, ...props}) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastProvider>
      <ToastProvider duration={width > 768 ? 30000 : 5000}>
        {toastsLong.map(function ({id, title, description, action, ...props}) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1 ">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastProvider>
    </>
  );
}

"use client";

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
      <ToastProvider duration={30000}>
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

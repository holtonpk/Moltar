import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {Metadata} from "next";
// import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = "Moltar",
  description = "Upload and ask away, Moltar will do the rest!",
  image = `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
}: {
  title?: string;
  description?: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon-16x16.png`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
    metadataBase: new URL("https://moltar.ai"),
    themeColor: "#FFF",
  };
}

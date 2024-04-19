import "../../globals.css";
import {Analytics} from "@vercel/analytics/react";

export const metadata = {
  title: "Moltar ai",
  description: "Simplify you reading",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      ></meta>
      <Analytics />
      <body className="bg-background">{children}</body>
    </html>
  );
}

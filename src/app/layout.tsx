import "../../globals.css";
import {Analytics} from "@vercel/analytics/react";

export const metadata = {
  title: "Moltar ai",
  description: "Simplify you reading",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <Analytics />
      <body className="">{children}</body>
    </html>
  );
}

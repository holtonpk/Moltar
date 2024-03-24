import "../../globals.css";

export const metadata = {
  title: "Moltar ai",
  description: "Moltar is a ....",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="max-h-screen overflow-hidden">{children}</body>
    </html>
  );
}

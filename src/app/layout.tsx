import "../../globals.css";

export const metadata = {
  title: "Moltar ai",
  description: "Moltar is a ....",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

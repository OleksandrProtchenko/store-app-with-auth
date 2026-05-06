import type { Metadata } from "next";
import "./globals.css";
import "modern-normalize/modern-normalize.css";
import "reset.css";
import Header from "@/components/Layout/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: "Store App with Authentication",
  description:
    "A simple store application with user authentication built using Next.js and NextAuth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <header className="header">
            <Header />
          </header>
          <main className="main">{children}</main>
        </TanStackProvider>
      </body>
    </html>
  );
}

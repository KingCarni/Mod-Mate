import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/globals.css";
import Providers from "@/app/providers";

export const metadata: Metadata = {
  title: "Mod-Mate",
  description: "Build your own modular AI companion for any world.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

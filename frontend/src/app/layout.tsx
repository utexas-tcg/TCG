import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { CommandPalette } from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "TCG Platform | Tech Consulting Group",
  description: "Internal operations platform for TCG @ UT Austin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <CommandPalette />
        </QueryProvider>
      </body>
    </html>
  );
}

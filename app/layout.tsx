import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QAA | Development workflow",
  description: "Interactive development workflow",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}

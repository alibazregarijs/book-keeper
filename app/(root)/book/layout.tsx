import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar/Navbar";
import ClientSessionProvider from "../signup/ClientSessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientSessionProvider>{children}</ClientSessionProvider>;
}

import ClientSessionProvider from "../signup/ClientSessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientSessionProvider>{children}</ClientSessionProvider>;
}

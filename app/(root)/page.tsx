import React from "react";
import { Navbar } from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import "@/app/(root)/globals.css";
import ClientSessionProvider from "./signup/ClientSessionProvider";
import Book from "./book/page";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  return (
    <div>
      <ClientSessionProvider>
        <Hero query={query} />
      </ClientSessionProvider>
    </div>
  );
};

export default page;

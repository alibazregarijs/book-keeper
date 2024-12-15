import React from "react";
import { Navbar } from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import "@/app/(root)/globals.css";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  return (
    <div>
      <Navbar query={query} />
      <Hero/>
    </div>
  );
};

export default page;

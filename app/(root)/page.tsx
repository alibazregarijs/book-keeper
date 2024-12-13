import React from "react";

import { Navbar } from "@/components/navbar/Navbar";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const query = (await searchParams).query;

  return (
    <div>
      <Navbar query={query} />
    </div>
  );
};

export default page;

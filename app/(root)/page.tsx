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
     
    </div>
  );
};

export default page;

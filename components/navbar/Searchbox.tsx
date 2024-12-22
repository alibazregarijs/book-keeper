import React from "react";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { headers } from "next/headers";
import { SearchNormal1 } from "iconsax-react";
import { Button } from "../ui/button";

import SearchResetForm from "./SearchResetForm";
export const Searchbox = async({ query }: { query?: string }) => {
  const headersList = await headers(); // Fetch headers on the server
  const currentUrl = headersList.get("referer") || "";
  console.log(currentUrl,"current")
  return (
    <div className="relative w-full">
      <Form action={currentUrl} scroll={false} id="search-form">
        <Input
          id="search-input"
          placeholder="Search Books"
          defaultValue={query}
          className="pl-10"
          name="query"
        />

        <div className="absolute inset-y-0 left-3 flex items-center">
          <Button className="hidden" id="btnSubmit" type="submit"></Button>
          <label htmlFor="btnSubmit" className="cursor-pointer">
            <SearchNormal1 size="20" color="#000" /> 
          </label>
        </div>
        {query && <SearchResetForm />}
      </Form>
    </div>
  );
};

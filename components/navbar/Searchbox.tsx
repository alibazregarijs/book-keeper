import React from "react";
import { Input } from "@/components/ui/input";
import Form from "next/form";

import { SearchNormal1 } from "iconsax-react";
import { Button } from "../ui/button";

import SearchResetForm from "./SearchResetForm";
export const Searchbox = ({ query }: { query?: string }) => {
  return (
    <div className="relative w-full">
      <Form action="/" scroll={false} id="search-form">
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
            <SearchNormal1 size="20" color="#fff" /> 
          </label>
        </div>
        {query && <SearchResetForm />}
      </Form>
    </div>
  );
};

import { getServerSession } from "next-auth";
import Image from "next/image";
import { Searchbox } from "./Searchbox";
import Link from "next/link";
import { Button } from "../ui/button";
import { NavLink } from "./CustomeNavLink";
import { AddBookModal } from "./AddBookModal";
import { redirect } from "next/navigation";
import { Profile } from "./Profile";
import { authOptions } from "@/app/api/auth/[...nextauth]/lib/authOptions";


export const Navbar = async ({ query }: { query?: string }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="flex justify-between items-center m-2">
      <div className="flex relative">
        <Profile session={session} />
      </div>
      <div className="w-1/3">
        <Searchbox query={query} />
      </div>
      <div className="flex items-center space-x-4">
        <NavLink href="/book">Books</NavLink>
        <NavLink href="/explore">Explore</NavLink>
        <AddBookModal />
      </div>
    </div>
  );
};

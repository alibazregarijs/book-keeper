import { getServerSession } from "next-auth";
import Image from "next/image";
import { Searchbox } from "./Searchbox";
import Link from "next/link";
import { Button } from "../ui/button";
import { NavLink } from "./CustomeNavLink";
export const Navbar = async ({ query }: { query?: string }) => {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="flex justify-between items-center m-2"></div>
    )
  }
  return (
    <div className="flex justify-between items-center m-2">
      <div>
        <Image
          width={35}
          height={35}
          alt="avatar"
          src={session?.user?.image as string}
        />
      </div>
      <div className="w-1/3">
        <Searchbox query={query} />
      </div>
      <div className="flex items-center space-x-4">
        <NavLink href="/book">
          Books
        </NavLink>
        <NavLink href="/explore">
          Explore
        </NavLink>
        <NavLink href="/book/add">
          Add Book
        </NavLink>
      </div>
    </div>
  );
};

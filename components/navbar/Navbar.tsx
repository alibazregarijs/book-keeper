import { getServerSession } from "next-auth";
import Image from "next/image";
import { Searchbox } from "./Searchbox";

export const Navbar = async ({ query }: { query?: string }) => {
  const session = await getServerSession();

  return (
    <div className="flex justify-between items-center">
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
      <div></div>
    </div>
  );
};

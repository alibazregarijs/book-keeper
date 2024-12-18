import { Navbar } from "@/components/navbar/Navbar";
import ClientBooks from "@/components/book/ClientBooks";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/lib/authOptions";
import { getServerSession } from "next-auth";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const books = await prisma.book.findMany({
    include: {
      likes: {
        where: {
          userId: Number(userId),
        },
      },
      savedBy: {
        where: {
          userId: Number(userId),
        },
      },
    },
  });

  // Pass the fetched books as a prop to the client-side component
  return (
    <div>
      <Navbar />
      <ClientBooks books={books as any} />
    </div>
  );
};

export default Page;

import { Navbar } from "@/components/navbar/Navbar";
import ClientBooks from "@/components/book/ClientBooks";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/lib/authOptions";
import { getServerSession } from "next-auth";
import { getExploreBooks } from "@/lib/utils";
import CommentSection from "@/components/comment/CommentSection";

const Page = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? Number(session.user.id) : undefined;

  const books = await getExploreBooks({ userId });
  

  return (
    <div>
      <Navbar />
      <ClientBooks books={books as any} />
      <CommentSection />
    </div>
  );
};

export default Page;



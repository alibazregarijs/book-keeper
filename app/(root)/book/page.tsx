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
      likes: true,
      savedBy: true,
    },
  });

  const booksWithViews = await Promise.all(
    books.map(async (book) => {
      // For each book, get the sum of its views
      const views = await prisma.bookViews.aggregate({
        _sum: {
          views: true, // Assuming 'views' is the column representing the number of views
        },
        where: {
          bookId: book.id, // Filter the views by the specific book
        },
      });

      return {
        ...book,
        totalViews: views._sum.views || 0, // Include the total views in the book data
      };
    })
  );

  // Pass the fetched books as a prop to the client-side component
  return (
    <div>
      <Navbar />
      <ClientBooks books={booksWithViews as any} />
    </div>
  );
};

export default Page;

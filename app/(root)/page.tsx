import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { desc } from "drizzle-orm";

const Home = async () => {
  const result = await db.select().from(users);
  const session = await auth();

  const latestBooks = (await db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(10)) as Book[];

  // console.log(result);
  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1).map(book => ({ ...book }))}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;

import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { books } from "@/database/schema";
import React from "react";
import { redirect } from "next/navigation";
import BookOverview from "@/components/BookOverview";
import { auth } from "@/auth";
import BookVideo from "@/components/BookVideo";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const id = (await params).id;
  const [bookDetails] = await db.select().from(books).where(eq(books.id, id)).limit(1);
  if (!bookDetails) redirect("/");
  console.log(bookDetails);
  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />

      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h1>Summary</h1>
            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        {/* Similar books */}
      </div>
    </>
  );
};

export default Page;

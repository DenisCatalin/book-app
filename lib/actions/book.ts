"use server";

import { eq } from "drizzle-orm";
import dayjs from "dayjs";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";

export const borrowBook = async (params: BorrowBookParams) => {
  const { bookId, userId } = params;
  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);
    if (!book[0] || !book[0].availableCopies)
      return { success: false, error: "Book not available for borrowing" };

    const dueDate = dayjs().add(7, "day").toDate().toDateString();
    const record = await db
      .insert(borrowRecords)
      .values({ bookId, userId, dueDate, status: "BORROWED" });

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return { success: true, data: JSON.parse(JSON.stringify(record)) };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to borrow book" };
  }
};
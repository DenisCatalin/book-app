"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { borrowBook } from "@/lib/actions/book";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface BorrowBookProps {
  bookId: string;
  userId: string;
  borrowingEligibility: {
    isEligible: boolean;
    message: string;
  };
}

const BorrowBook = ({ bookId, userId, borrowingEligibility }: BorrowBookProps) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = useState(false);
  const { isEligible, message } = borrowingEligibility;

  const handleBorrow = async () => {
    if (!isEligible) {
      toast({
        title: "Borrowing Failed",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setBorrowing(true);
    try {
      const result = await borrowBook({ bookId, userId });
      if (result.success) {
        toast({
          title: "Borrowing Successful",
          description: "You have successfully borrowed the book",
        });
        router.push("/my-profile");
      } else {
        toast({
          title: "Borrowing Failed",
          description: "An error occurred while borrowing the book",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Borrowing Failed",
        description: "Failed to borrow the book",
        variant: "destructive",
      });
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <Button className="book-overview_btn" onClick={handleBorrow} disabled={borrowing}>
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {borrowing ? "Borrowing..." : "Borrow"}
      </p>
    </Button>
  );
};

export default BorrowBook;

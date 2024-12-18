"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { BookProps } from "./types";
import React, { memo } from "react";
import { Star1, Save2 } from "iconsax-react";
import { useSession } from "next-auth/react";
import { likeAction , saveBookAction } from "./action";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Book = memo(({ book }: { book: any }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [boldStars, setBoldStars] = useState<boolean[]>(Array(5).fill(false));
  const [saved, setSaved] = useState<boolean>(false);

  
  // Set the initial bold stars based on countOfLike

  useEffect(() => {
    const countOflike = book.likes[0]?.countOfLike || 0;
    const isSaved = book.savedBy[0]?.isSaved || false;
    const newBoldStars = [...boldStars];
    newBoldStars.fill(true, 0, countOflike);
    setBoldStars(newBoldStars);
    setSaved(isSaved);
  }, [userId]);

  const setRate = async (liked: boolean, index: number) => {
    // Update the stars state
    const newBoldStars = [...boldStars];
    if (!liked) {
      newBoldStars.fill(true, 0, index + 1);
    } else {
      newBoldStars.fill(false, index, 5);
    }

    setBoldStars(newBoldStars);
    const likedCount = newBoldStars.filter((value) => value === true).length;

    // Call the server action
    await likeAction({
      userId: userId as string,
      bookId: book.id,
      countOfLike: likedCount,
    });
  };

  const savedBook = async({bookId,isSaved}: {bookId: number,isSaved:boolean}) => {
    console.log(userId,"USERID", bookId,"BOOKID",isSaved);
    await saveBookAction({
      userId: Number(userId),
      bookId: bookId,
      isSaved:isSaved
    });
  }

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg m-5">
      <div className="relative">
        <Image
          src={book.imageUrl}
          alt="Card image"
          width={1000}
          height={1000}
          objectFit="cover"
          className="transition-all hover:scale-105 brightness-75"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-thin">
          <div className="flex justify-between items-center">
            {book.title}
            {saved ? (
              <Save2
                size="22"
                color="black"
                variant="Bold"
                onClick={() => {setSaved(false),savedBook({bookId:book.id,isSaved:false})}}
              />
            ) : (
              <Save2
                size="22"
                color="black"
                variant="Outline"
                onClick={() => {setSaved(true),savedBook({bookId:book.id,isSaved:true})}}
              />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{book.description}</p>
        <div className="flex items-center justify-center mt-3 space-x-5">
          {[...Array(5)].map((_, i) => (
            <span key={i}>
              <Star1
                size="20"
                variant={boldStars[i] ? "Bold" : "Outline"}
                color="black"
                onClick={() => setRate(boldStars[i], i)}
              />
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full bg-black text-white hover:bg-white hover:text-black transition-colors"
        >
          See Comments
        </Button>
      </CardFooter>
    </Card>
  );
});

export default Book;

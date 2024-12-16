"use client";
import { useState, useRef } from "react";
import { BookProps } from "./types";
import { DollarCircle, Message, Star1 } from "iconsax-react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Book = ({ book }: { book: BookProps }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [boldStars, setBoldStars] = useState<boolean[]>(Array(5).fill(false));
  const starRef = useRef(0);

  const setRate = (liked: boolean, index: number) => {
    setBoldStars((prevState) => {
      const newState = [...prevState];
      if (!liked){
      newState.fill(true, 0, index + 1);
      return newState;
      }

      newState.fill(false, index, 5);
      return newState;
    });
  };

  const handleLike = () => {
    console.log();
  };

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg m-5">
      <div className="relative">
        <Image
          src={book.imageUrl}
          alt="Card image"
          width={1000}
          height={1000}
          objectFit="cover"
          className="transition-all hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-thin">
          Monochrome Elegance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Embrace the timeless beauty of black and white. This card showcases
          the power of minimalist design, focusing on contrast and simplicity to
          create a striking visual impact.
        </p>
        <div className="flex items-center justify-center mt-3 space-x-5">
          {[...Array(5)].map((_, i) => (
            <span key={i}>
              <Star1
                size="20"
                variant={boldStars[i] ? "Bold" : "Outline"}
                color="black"
                onClick={() => {
                  console.log(boldStars[i],"boldstart")
                  setRate(boldStars[i], i);
                  handleLike();
                }}
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
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Book;

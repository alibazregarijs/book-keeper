import React from "react";
import { BookProps } from "./types";
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

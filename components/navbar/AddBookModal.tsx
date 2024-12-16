"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { AddBookAction } from "./action";
import { useRouter } from "next/router";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export function AddBookModal() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const userId = session?.user?.id;

  const [image, setImage] = useState<File>();
  const [formData, setFormData] = useState({
    title: "",
    genre: "love",
    pageCount: 0,
    price: 0,
    description: "",
    imageUrl: "",
  });

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenreChange = (value: string) => {
    setFormData({
      ...formData,
      genre: value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      genre: "love",
      pageCount: 0,
      price: 0,
      description: "",
      imageUrl: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert formData to FormData for server-side submission
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      dataToSend.append(key, value.toString());
    });

    try {
      dataToSend.append("image", (image as File) || "");
      dataToSend.append("userId", userId as string);
      const res = await AddBookAction(dataToSend);
      toast({
        description: res.message,
        className:"bg-green-500 text-white border-green-500",
      });
      resetForm();
      console.log("Book added successfully");
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add a New Book</DialogTitle>
            <DialogDescription>
              Fill out the form to add a new book to your collection.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleOnChange}
                className="col-span-3"
                placeholder="Book Title"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                required
                onChange={handleOnChange}
                className="col-span-3"
                placeholder="Description of the book"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right">
                Genre
              </Label>
              <Select value={formData.genre} required onValueChange={handleGenreChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="love">Love</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="drama">Drama</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                required
                type="number"
                min={0}
                value={formData.price}
                onChange={handleOnChange}
                className="col-span-3"
                placeholder="Price of the book"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pageCount" className="text-right">
                Page Count
              </Label>
              <Input
                id="pageCount"
                name="pageCount"
                min={0}
                required
                type="number"
                value={formData.pageCount}
                onChange={handleOnChange}
                className="col-span-3"
                placeholder="Number of pages"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <Input
                id="image"
                name="image"
                type="file"
                required
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0])}
                className="col-span-3"
                placeholder="Price of the book"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Book</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

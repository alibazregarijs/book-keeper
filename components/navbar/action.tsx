"use server";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { PrismaClient } from "@prisma/client";
import * as path from "path";

const prisma = new PrismaClient();

export async function AddBookAction(formData: FormData) {
  // Access form fields explicitly to avoid null-prototype objects

  
  const title = formData.get("title") as string;
  const genre = formData.get("genre") as string;
  const pageCount = parseInt(formData.get("pageCount") as string, 10);
  const userId = parseInt(formData.get("userId") as string, 10);
  const image = formData.get("image") as File | null;

  if (!image || typeof image.name !== "string") {
    return NextResponse.json({
      success: false,
      message: "No valid image file provided",
    });
  }

  // Convert image file to buffer
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Ensure the directory exists
  const dirPath = path.join(process.cwd(), "public", "uploads");
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error("Failed to create directory:", error);
    return NextResponse.json({ success: false, message: "Directory creation failed" });
  }

  // Define file name and path
  const fileName = `${Date.now()}-${image.name}`;
  const filePath = path.join(dirPath, fileName);

  try {
    // Write file to the target directory
    await writeFile(filePath, buffer);
    console.log(`File uploaded to ${filePath}`);

    // Save book info in the database
    console.log("fileName", fileName);
    console.log(title,"title")
    console.log(genre,"genre")
    console.log(pageCount,"pageCount")
    console.log(userId,"userId")


    const book = await prisma.book.create({
      data: {
        title,
        genre,
        pageCount,
        userId,
        imageUrl: `/uploads/${fileName}`,
      },
    });

    // Serialize the Prisma book object

    return {message:"Book added successfully",success:true}
  } catch (error) {
    return {message:"Error adding book",success:false}
  }
}

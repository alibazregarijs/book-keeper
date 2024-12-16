"use server";
import { Redirect } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    avatar: z.string().min(1, "Avatar is required"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  }); 

export async function SignUpAction(prevState: any, formData: FormData) {

  const data = Object.fromEntries(formData.entries());

  const parsedData = signupSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.flatten().fieldErrors;

    return {
      success: false,
      errors: errorMessages,
    };
  }

  const { name, email, password , avatar } = parsedData.data;

  console.log(avatar,"avatar")

  try {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email is already registered.",
      };
    }

    // Hash the password (using bcrypt, for example)
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        avatar,
        password: hashedPassword,
      },
    });

    
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
  redirect("/signin");
}

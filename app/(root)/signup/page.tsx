"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SignUpAction } from "./_actions";
import { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signupSchema, SignupSchema } from "./lib/types";
import Image from "next/image";
import { avatars } from "./lib/avatars";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fromJSON } from "postcss";
import Link from "next/link";

const SignupPage = () => {
  const [state, formAction, isPending] = useActionState(SignUpAction, null);
  const [avatar, setAvatar] = useState({ src: "", number: 0 });
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    mode: "onChange", // Validate on change
    reValidateMode: "onChange", // Revalidate on change
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: "",
    },
  });

  function getAvatarSrc(number: number) {
    setAvatar({ src: avatars[number].src, number });

    form.setValue("avatar", avatars[number].src);
    form.setValue("avatar", avatars[number].src, { shouldValidate: true });
  }

  useEffect(() => {
    if (state?.message) {
      toast({
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast]);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-4 border rounded-lg shadow-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Sign Up</h1>
        <Form {...form}>
          <form action={formAction} className="space-y-2">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Choose Avatar</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center items-center space-x-20">
              {avatars.map((avatarMap) => (
                <Image
                  width={80}
                  height={80}
                  key={avatarMap.number}
                  onClick={(e) => getAvatarSrc(avatarMap.number)}
                  className={` rounded-full border-4 ${
                    avatar.number === avatarMap.number
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  alt="avatar"
                  src={avatarMap.src}
                />
              ))}
            </div>
            {/* Submit Button */}
            <Button
              disabled={!form.formState.isValid || isPending}
              type="submit"
              className="w-full"
            >
              {isPending ? "Submitting..." : "Sign Up"}
            </Button>
            <div>
              <Link className="text-blue-500 underline" href="/signin">
                Signin
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signinSchema, SigninSchema } from "./lib/types";
import { signIn } from "next-auth/react";
import Link from "next/link";
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

const SigninPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    mode: "onChange", // Validate on change
    reValidateMode: "onChange", // Revalidate on change
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // The handleSignIn function now accepts the form data
  const handleSignIn = async (data: SigninSchema) => {
    setIsPending(true); // Indicate that the form is submitting
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          description: "Invalid credentials, please try again.",
          variant: "destructive",
        });
      } else {
        router.push("/");
        // Redirect or handle successful login here
      }
    } catch (error) {
      toast({
        description: "An error occurred during sign in.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false); // Reset the pending state
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-4 border rounded-lg shadow-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Sign In</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignIn)}
            className="space-y-4"
          >
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
            {/* Submit Button */}
            <Button
              disabled={isPending || !form.formState.isValid}
              type="submit"
              className="w-full"
            >
              {isPending ? "Submitting..." : "Sign In"}
            </Button>
            <div>
              <Link className="text-blue-500 underline" href="/signup">
                Signup
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SigninPage;

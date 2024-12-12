"use server";
import { signinSchema } from "../signin/lib/types";

import { signIn } from "next-auth/react";

export async function SignInAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsedData = signinSchema.safeParse(data);

  const apiResult = await signIn("credentials", {
    email: parsedData?.data?.email,
    password: parsedData?.data?.password,
    redirect: false,
  });

  console.log(apiResult);

  return apiResult;
}

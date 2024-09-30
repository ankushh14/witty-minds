"use client";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const Signin = () => {
  const { resolvedTheme } = useTheme();
  return (
    <main className="w-full h-dvh flex flex-col-reverse md:flex-row gap-4 justify-end md:justify-center items-center p-4">
      <SignIn
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
          elements: {
            rootBox: "pb-4",
          },
        }}
      />
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="text-base">
            Sign in as an Anonymous User
          </CardTitle>
          <CardDescription>
            If you would like to sign in as an anonymous user, please use the
            following credentials:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <strong>Email:</strong> <code>anonymoususer@gmail.com</code>
            </li>
            <li>
              <strong>Password:</strong> <code>AnonymousUser@14</code>
            </li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};

export default Signin;

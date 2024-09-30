"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const Signup = () => {
  const { resolvedTheme } = useTheme();
  return (
    <SignUp
      appearance={{
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        elements: {
          rootBox: "p-4",
        },
      }}
    />
  );
};

export default Signup;

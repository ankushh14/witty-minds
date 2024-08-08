"use client";

import { NavLogoComponent } from "@/components/navigation/Navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="w-full min-h-dvh flex justify-center items-center">
      <Card className={`w-[300px] md:w-[450px]`}>
        <CardHeader className="flex flex-row justify-center items-center">
          <NavLogoComponent />
        </CardHeader>
        <CardContent className="w-full flex flex-col space-y-6">
          <CardTitle className="text-center">{error.name}</CardTitle>
          <CardDescription className="text-center">
            Something went wrong!!
          </CardDescription>
        </CardContent>
        <CardFooter className="w-full flex flex-row space-x-3 justify-center items-center">
          <Button
            variant={"destructive"}
            aria-label="Reload page"
            onClick={() => reset()}
          >
            Reload
          </Button>
          <Link
            href={"/feed"}
            className={`${buttonVariants({ variant: "secondary" })}`}
            aria-label="Go to feed"
          >
            Go to Feed
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

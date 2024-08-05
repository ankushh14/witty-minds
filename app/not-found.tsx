import { NavLogoComponent } from "@/components/navigation/Navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function Custom404() {
  return (
    <main className="w-full min-h-dvh flex justify-center items-center">
      <Card className={`w-[300px] md:w-[450px]`}>
        <CardHeader className="flex flex-row justify-center items-center">
          <NavLogoComponent />
        </CardHeader>
        <CardContent className="w-full flex flex-col space-y-6">
          <CardTitle className="text-center">{404}</CardTitle>
          <CardDescription className="text-center flex flex-row justify-center items-center space-x-2">
            <Frown />
            <p>Page not found</p>
          </CardDescription>
        </CardContent>
        <CardFooter className="w-full flex flex-row space-x-3 justify-center items-center">
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

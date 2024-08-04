import { Button } from "@/components/ui/button";
import { projectDescription, projectName } from "@/lib/data";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      className={cn(
        "w-full h-full min-h-dvh flex flex-col space-y-4 justify-center items-center"
      )}
    >
      <header className={cn("flex flex-row")}>
        <h1 className="text-4xl font-bold font-mono text-center">
          {projectName}
        </h1>
      </header>
      <p className="text-center p-2">{projectDescription}</p>
      <Button asChild variant={"secondary"}>
        <Link href={"/feed"}>{"Go To Feed ->"}</Link>
      </Button>
    </main>
  );
}

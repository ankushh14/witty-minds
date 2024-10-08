"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { projectName } from "@/lib/data";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { AlignRight, Bookmark, LayoutList } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "../../public/witty-minds-240.svg";
import ThemeToggle from "../themetoggle/ThemeToggle";
import { Button, buttonVariants } from "../ui/button";

const Navigation = () => {
  const { resolvedTheme } = useTheme();
  const { user } = useUser();
  return (
    <nav
      className={`w-full p-2 sm:p-3 flex flex-ro justify-between items-center sticky top-0 backdrop-blur z-10`}
    >
      <NavLogoComponent />
      <div className="flex flex-1 flex-row justify-end items-center">
        <ThemeToggle />
        <NavSheet />
        <Button variant={"ghost"} size={"icon"} aria-label="User profile">
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
              }}
              userProfileUrl={`/profile/${user?.id}`}
            />
          </SignedIn>
        </Button>
      </div>
    </nav>
  );
};

const NavSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div
          className={`${buttonVariants({ variant: "ghost", size: "icon" })}`}
          aria-label="Open side navigation"
        >
          <AlignRight />
        </div>
      </SheetTrigger>
      <SheetContent
        className="border-none"
        aria-describedby="Side bar used to route to different pages"
      >
        <SheetHeader>
          <SheetTitle>
            <NavLogoComponent />
          </SheetTitle>
        </SheetHeader>
        <div className="w-full flex flex-col space-y-2 mt-12">
          <SideBarLink
            href={"/feed"}
            name="Feed"
            icon={<LayoutList size={16} />}
          />
          <SideBarLink
            href={"/bookmarks"}
            name="Bookmarks"
            icon={<Bookmark size={16} />}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const NavLogoComponent = () => {
  return (
    <Link
      href={"/feed"}
      className="w-fit flex flex-row space-x-2 justify-center items-center cursor-pointer"
    >
      <Image src={Logo} alt="Witty-minds logo" width={32} height={32} />
      <h1
        className="text-xl font-bold font-mono hidden sm:inline-block"
        aria-label={projectName}
      >
        {projectName}
      </h1>
    </Link>
  );
};

type SideBarButtonProps = {
  href: string;
  name: string;
  icon: React.ReactNode;
};

const SideBarLink = ({ href, name, icon }: SideBarButtonProps) => {
  const pathname = usePathname();
  return (
    <Link href={href} className="w-full" tabIndex={-1}>
      <SheetClose
        className="w-full flex flex-row justify-center items-center p-0"
        tabIndex={-1}
      >
        <Button
          variant={
            pathname.includes(name.toLocaleLowerCase()) ? "secondary" : "ghost"
          }
          className="w-full"
        >
          <span className="mr-2">{icon}</span>
          {name}
        </Button>
      </SheetClose>
    </Link>
  );
};

export default Navigation;

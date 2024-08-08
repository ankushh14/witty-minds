"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FeedToggle = () => {
  const pathname = usePathname();
  return (
    <div className="w-full flex p-3">
      <Tabs
        defaultValue={pathname.includes("following") ? "following" : "recent"}
        className="w-full"
      >
        <TabsList className="w-full">
          <Link href={"/feed"} className="w-full">
            <TabsTrigger value="recent" className="w-full">
              Discover
            </TabsTrigger>
          </Link>
          <Link href={"/feed/following"} className="w-full">
            <TabsTrigger value="following" className="w-full">
              Following
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default FeedToggle;

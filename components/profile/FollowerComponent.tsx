"use client";

import { User } from "@prisma/client";
import React from "react";
import { useDebounce } from "use-debounce";
import { Input } from "../ui/input";
import Userprofile from "./Userprofile";

const FollowComponent = ({ followers }: { followers: User[] }) => {
  const [followersState, setFollowersState] = React.useState(followers);
  const [search, setSearch] = React.useState("");
  const [value] = useDebounce(search, 500);

  const searchFunction = React.useCallback(() => {
    setFollowersState(
      followers.filter((item) =>
        item.name?.toLowerCase().includes(value.toLowerCase())
      )
    );
  }, [value, followers]);

  React.useEffect(() => {
    searchFunction();
  }, [searchFunction]);

  return (
    <div className="w-full flex flex-col space-y-5">
      <Input
        type="search"
        placeholder="Enter to search"
        name="search-bar"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <div
        className="w-full flex flex-row flex-wrap gap-3 justify-center"
        aria-label="Followers"
      >
        {followersState.length ? (
          followersState.map((item, index) => {
            return <Userprofile key={item.id} {...item} />;
          })
        ) : (
          <h1 className="text-xl py-6">Nothing to see here...</h1>
        )}
      </div>
    </div>
  );
};

export default FollowComponent;

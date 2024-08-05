"use client";

import { removeFollow } from "@/actions/users/mutateFollow.actions";
import { createToast } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";

const UnfollowButton = ({
  fromUserId,
  toUserId,
}: {
  fromUserId: string;
  toUserId: string;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    const response = await removeFollow({
      fromUserID: fromUserId,
      toUserID: toUserId,
    });
    if (!response.valid) {
      createToast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
      return setIsLoading(false);
    }
  };
  return (
    <Button
      variant={"secondary"}
      size={"lg"}
      disabled={isLoading}
      aria-disabled={isLoading}
      onClick={handleClick}
    >
      Unfollow
    </Button>
  );
};

export default UnfollowButton;

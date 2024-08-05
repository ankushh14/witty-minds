"use client";

import { addFollow } from "@/actions/users/mutateFollow.actions";
import { createToast } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";

const FollowButton = ({
  fromUserId,
  toUserId,
}: {
  fromUserId: string;
  toUserId: string;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    const response = await addFollow({
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
      Follow
    </Button>
  );
};

export default FollowButton;

"use client";

import { mutateLike } from "@/actions/posts/mutateLike";
import { Heart } from "lucide-react";
import React from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";

type LikeProps = {
  likeCount: number;
  setLikeCount: React.Dispatch<React.SetStateAction<number>>;
  postID: string;
  likedBy: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  currentUserId: string;
};

const LikeButton = ({
  likedBy,
  postID,
  currentUserId,
  likeCount,
  setLikeCount,
}: LikeProps) => {
  const [isLiked, setIsLiked] = React.useState(() => {
    if (likedBy.find((user) => user.id === currentUserId)) {
      return true;
    } else {
      return false;
    }
  });
  const [debouncedLike, callback] = useDebounce(isLiked, 500);
  const [notInitial, setNotInitial] = React.useState(false);

  const updateLike = React.useCallback(async () => {
    await mutateLike({
      postID,
      addLike: debouncedLike,
      userID: currentUserId,
    });
  }, [currentUserId, debouncedLike, postID]);

  const handleLikeClick = () => {
    setLikeCount((prev) => {
      if (prev <= likeCount && !isLiked) {
        return prev + 1;
      } else {
        return prev - 1;
      }
    });
    setIsLiked((prev) => !prev);
    setNotInitial(true);
  };

  React.useEffect(() => {
    if (notInitial) {
      updateLike();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLike]);

  return (
    <Button
      variant={"ghost"}
      className="flex flex-row space-x-1 w-full justify-center items-center"
      onClick={handleLikeClick}
      aria-label="like"
    >
      <Heart size={16} fill={isLiked ? "red" : ""} />
    </Button>
  );
};

export default LikeButton;

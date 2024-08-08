"use client";

import { mutateBookmarks } from "@/actions/posts/mutateBookmarks";
import { createToast } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import React from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";

type BookmarkSectionProps = {
  postID: string;
  bookmarkedBy: {
    id: string;
    name: string | null;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  bookmarkCount: number;
  setBookmarkCount: React.Dispatch<React.SetStateAction<number>>;
  currentUserId: string;
  title: string;
};

const BookmarksButton = ({
  bookmarkedBy,
  postID,
  bookmarkCount,
  setBookmarkCount,
  currentUserId,
  title,
}: BookmarkSectionProps) => {
  const [isBookmarked, setIsBookmarked] = React.useState(() => {
    if (bookmarkedBy.find((user) => user.id === currentUserId)) {
      return true;
    } else {
      return false;
    }
  });
  const [debouncedBookmark, callback] = useDebounce(isBookmarked, 500);
  const [notInitial, setNotInitial] = React.useState(false);

  const updateBookmark = React.useCallback(async () => {
    const response = await mutateBookmarks({
      postID,
      addBookmark: debouncedBookmark,
      userID: currentUserId,
    });

    createToast({
      title: response.message,
      variant: "default",
      description: title,
    });
  }, [currentUserId, debouncedBookmark, postID, title]);

  const handleBookmarkClick = () => {
    setBookmarkCount((prev) => {
      if (prev <= bookmarkCount && !isBookmarked) {
        return prev + 1;
      } else {
        return prev - 1;
      }
    });
    setIsBookmarked((prev) => !prev);
    setNotInitial(true);
  };

  React.useEffect(() => {
    if (notInitial) {
      updateBookmark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBookmark]);
  return (
    <Button
      variant={"ghost"}
      className="flex flex-row space-x-1 w-full"
      aria-label="bookmark"
      onClick={handleBookmarkClick}
    >
      <Bookmark size={16} fill={isBookmarked ? "white" : ""} />
    </Button>
  );
};

export default BookmarksButton;

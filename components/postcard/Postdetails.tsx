"use client";

import { User } from "@prisma/client";
import UserList from "../feed/UserList";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type Postdetailsprops = {
  likeCount: number;
  likedBy?: User[];
  bookmarkCount: number;
  bookmarkedBy?: User[];
};

const Postdetails = ({
  likeCount,
  likedBy,
  bookmarkCount,
  bookmarkedBy,
}: Postdetailsprops) => {
  return (
    <div className="w-full flex flex-row justify-between px-6 py-1">
      <Dialog>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-xs cursor-pointer">
                  {likeCount} {likeCount > 1 ? "likes" : "like"}
                </span>
              </TooltipTrigger>
              <TooltipContent>View likes</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="max-h-[400px] overflow-y-scroll">
          <DialogTitle className="sr-only">View likes here</DialogTitle>
          <UserList followers={likedBy!} />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-xs cursor-pointer">
                  {bookmarkCount} {bookmarkCount > 1 ? "bookmarks" : "bookmark"}
                </span>
              </TooltipTrigger>
              <TooltipContent>View bookmarks</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="max-h-[400px] overflow-y-scroll">
          <DialogTitle className="sr-only">View bookmarks here</DialogTitle>
          <UserList followers={bookmarkedBy!} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Postdetails;

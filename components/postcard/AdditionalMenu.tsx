"use client";

import { deletePost } from "@/actions/posts/createPost.actions";
import { createToast } from "@/lib/utils";
import { Postsprops } from "@/types";
import { useUser } from "@clerk/nextjs";
import { OctagonX } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import KebabMenu from "../ui/KebabMenu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

const AdditionalMenu = ({
  posttitle,
  postId,
  setPosts,
}: {
  posttitle: string;
  postId: string;
  setPosts: React.Dispatch<React.SetStateAction<Postsprops>>;
}) => {
  const [alert, setAlert] = useState(false);
  const { isLoaded, user } = useUser();
  const [isLoading, setIsloading] = useState(false);
  const handleDelete = async () => {
    if (!isLoaded) {
      return setAlert(false);
    }
    const id = postId;
    const userId = user?.id!;
    setIsloading(true);
    const response = await deletePost({ id, userId });
    if (!response.valid) {
      setIsloading(false);
      return createToast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
    setPosts((prev) => [...prev].filter((post) => post.postID !== id));
    setIsloading(true);
    createToast({
      title: "Delete successful!",
      description: response.message,
      variant: "default",
    });
    return setAlert(false);
  };

  return (
    <Popover>
      <PopoverTrigger aria-label="Additional options">
        <KebabMenu />
      </PopoverTrigger>
      <PopoverContent className="w-fit flex flex-col space-y-2">
        <h4 className="w-full font-semibold text-sm">Additional Options</h4>
        <Separator />
        <AlertDialog open={alert} onOpenChange={setAlert}>
          <AlertDialogTrigger>
            {" "}
            <div className={buttonVariants({ variant: "ghost" })}>
              <OctagonX size={17} fill="red" className="mr-1" />
              Delete post
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                `<strong>{posttitle}</strong>` will be deleted. This action
                cannot be undone. This will permanently delete your post.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant={"secondary"}
                disabled={isLoading}
                aria-disabled={isLoading}
                onClick={handleDelete}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PopoverContent>
    </Popover>
  );
};

export default AdditionalMenu;

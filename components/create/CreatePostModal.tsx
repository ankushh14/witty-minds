"use client";

import { createPost } from "@/actions/posts/createPost.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import CreatePostButton from "./CreatePostButton";

const CreatePostModal = () => {
  const [dialog, setDialog] = useState(false);

  const [state, formAction] = useFormState(createPost, {
    message: "",
    valid: false,
  });

  useEffect(() => {
    if (state.valid && state.message.length) {
      toast({
        "aria-atomic": "true",
        role: "alert",
        "aria-live": "assertive",
        title: state.message,
      });
      setDialog(false);
    } else if (!state.valid && state.message.length) {
      toast({
        "aria-atomic": "true",
        role: "alert",
        "aria-live": "assertive",
        title: state.message,
        variant: "destructive",
      });
    } else {
      return;
    }
  }, [state]);

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger>
        <CreatePostButton />
      </DialogTrigger>
      <DialogContent
        className="w-[90%] max-w-[500px]"
        aria-label="Create post modal"
        role="dialog"
      >
        <DialogHeader>
          <DialogTitle>Create post</DialogTitle>
          <DialogDescription>
            {"Add a title and a description"}
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full flex flex-col space-y-4 mt-2"
          action={formAction}
        >
          <div className="w-full flex flex-col space-y-6 justify-center items-center">
            <div className="w-full flex flex-col space-y-3">
              <Label htmlFor="title">Title of the post</Label>
              <Textarea
                id="title"
                name="title"
                placeholder="Type your title here"
                rows={2}
              />
            </div>
            <div className="w-full flex flex-col space-y-3">
              <Label htmlFor="description">Description of the post</Label>

              <Textarea
                id="description"
                name="description"
                placeholder="Type your description here"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={"secondary"}
      aria-disabled={pending}
      disabled={pending}
      className="px-4 w-full"
    >
      Post
    </Button>
  );
};

export default CreatePostModal;

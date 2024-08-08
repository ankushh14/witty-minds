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
import { createToast } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import CreatePostButton from "./CreatePostButton";

const CreatePostModal = () => {
  const [dialog, setDialog] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const [state, formAction] = useFormState(createPost, {
    message: "",
    valid: false,
  });

  useEffect(() => {
    if (state.valid && state.message.length) {
      createToast({
        variant: "default",
        title: state.message,
        description: titleRef.current?.value,
      });
      setDialog(false);
    } else if (!state.valid && state.message.length) {
      createToast({
        variant: "destructive",
        title: state.message,
        description: titleRef.current?.value,
      });
    } else {
      return;
    }
  }, [state]);

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger
        tabIndex={-1}
        className="fixed right-3 bottom-8 md:right-16 md:bottom-16"
      >
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
          ref={formRef}
        >
          <div className="w-full flex flex-col space-y-6 justify-center items-center">
            <div className="w-full flex flex-col space-y-3">
              <Label htmlFor="title">Title of the post</Label>
              <Textarea
                id="title"
                name="title"
                placeholder="Type your title here"
                rows={2}
                ref={titleRef}
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

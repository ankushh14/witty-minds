"use client";
import { updateDescription } from "@/actions/users/mutateDescription.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createToast } from "@/lib/utils";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button, buttonVariants } from "../ui/button";
import { Label } from "../ui/label";

const EditDescription = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [state, formAction] = useFormState(updateDescription, {
    message: "",
    valid: false,
  });
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (state.valid && state.message.length) {
      createToast({
        variant: "default",
        title: state.message,
        description: descriptionRef.current?.value,
      });
      setDialogOpen(false);
    } else if (!state.valid && state.message.length) {
      createToast({
        variant: "destructive",
        title: state.message,
        description: descriptionRef.current?.value,
      });
    } else {
      return;
    }
  }, [state]);
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        className={`${buttonVariants({ variant: "secondary" })} w-fit`}
      >
        Edit description
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your description</DialogTitle>
          <DialogDescription>
            Brief description about yourself
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="w-full flex flex-col space-y-2">
          <Label htmlFor="description">Your Description</Label>
          <Textarea
            placeholder="Enter description"
            rows={4}
            ref={descriptionRef}
            name="description"
          />
          <DialogFooter className="w-full flex flex-row justify-end items-center space-x-2 pt-4">
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
      className="w-full"
    >
      Confirm
    </Button>
  );
};

export default EditDescription;

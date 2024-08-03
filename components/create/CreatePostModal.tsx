import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import CreatePostButton from "./CreatePostButton";

const CreatePostModal = () => {
  return (
    <Dialog>
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
          <DialogDescription>{"Add a title and a quote"}</DialogDescription>
        </DialogHeader>
        <CreatePostBody />
        <DialogFooter>
          <Button type="submit" variant={"secondary"} className="px-4 w-full">
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CreatePostBody = () => {
  return (
    <div className="w-full flex flex-col space-y-3 justify-center items-center">
      <Textarea placeholder="Type your title here" rows={2} />
      <Textarea placeholder="Type your description here" rows={8} />
    </div>
  );
};

export default CreatePostModal;

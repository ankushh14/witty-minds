import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const CreatePostButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"secondary"}
            aria-label="Create post button"
            className="fixed right-3 bottom-8 md:right-16 md:bottom-16 rounded-full py-6"
          >
            <Plus size={24} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create new post</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CreatePostButton;

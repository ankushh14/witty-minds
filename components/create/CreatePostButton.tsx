import { Plus } from "lucide-react";
import { buttonVariants } from "../ui/button";
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
          <div
            aria-label="Create post button"
            className={`fixed right-3 bottom-8 md:right-16 md:bottom-16 py-6 ${buttonVariants(
              { variant: "secondary" }
            )} rounded-full`}
          >
            <Plus size={24} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create new post</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CreatePostButton;

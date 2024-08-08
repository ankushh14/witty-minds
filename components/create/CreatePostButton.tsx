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
            className={`py-6 ${buttonVariants({
              variant: "secondary",
            })} rounded-full`}
            tabIndex={0}
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

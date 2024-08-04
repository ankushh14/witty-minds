import { toast } from "@/components/ui/use-toast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createToast = ({
  variant,
  title,
  description,
}: {
  variant: "default" | "destructive" | null | undefined;
  title: string;
  description?: string;
}) => {
  return toast({
    "aria-atomic": "true",
    role: "alert",
    "aria-live": "assertive",
    title,
    variant,
    description,
  });
};

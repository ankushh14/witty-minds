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

export const getFolderNameFromUrl = (url: string) => {
  const urlObj = new URL(url);
  const path = decodeURIComponent(urlObj.pathname);
  const parts = path.split("/");
  if (parts.length > 2) {
    return parts.slice(2, parts.length - 1).join("/");
  }
  return null;
};

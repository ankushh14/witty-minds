"use client";
import { cn, createToast } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import React from "react";
import { Button } from "../button";
import { Input } from "../input";

type FileUploadContext = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  isFull: boolean;
  isFileTooBig: boolean;
  removeFileFromSet: (index: number) => void;
  addFileToSet: (files: File[]) => void;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  orientation: "horizontal" | "vertical";
  loadingState: boolean;
};

const fileUploadContext = React.createContext<FileUploadContext | null>(null);

export const useFileUpload = () => {
  const context = React.useContext(fileUploadContext);
  if (!context) {
    throw new Error("useFileUpload must be used within a FileUploaderProvider");
  }
  return context;
};

type FileUploaderProps = Pick<
  FileUploadContext,
  "files" | "setFiles" | "orientation"
> & {
  children: React.ReactNode;
  loadingState: boolean;
};

const fileOptions = {
  maxFiles: 4,
  maxSize: 10 * 1024 * 1024,
};

export const FileUploader = React.memo(
  ({
    files,
    setFiles,
    orientation,
    children,
    loadingState,
  }: FileUploaderProps) => {
    const [isFileTooBig, setIsFileTooBig] = React.useState(false);
    const [isFull, setIsFull] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(-1);
    const removeFileFromSet = React.useCallback(
      (i: number) => {
        if (!files) return;
        const newFiles = files.filter((_, index) => index !== i);
        setFiles(newFiles);
      },
      [files, setFiles]
    );
    const addFileToSet = React.useCallback(
      (filesList: File[]) => {
        if (filesList.length > fileOptions.maxFiles) {
          createToast({
            title: `Max of ${fileOptions.maxFiles} files can be uploaded`,
            description: `Exceeded limit of ${fileOptions.maxFiles}`,
            variant: "destructive",
          });
        }
        for (let i = 0; i < Math.min(filesList.length, 4); i++) {
          if (filesList[i].size > fileOptions.maxSize) {
            createToast({
              title: `File size exceeded`,
              description: `File ${filesList[i].name} larger than ${fileOptions.maxSize} cannot be uploaded`,
              variant: "destructive",
            });
          } else {
            setFiles((prev) => {
              if (prev.length >= fileOptions.maxFiles) {
                return prev;
              } else {
                return [...prev, filesList[i]];
              }
            });
          }
        }
      },
      [setFiles]
    );

    React.useEffect(() => {
      if (files.length >= fileOptions.maxFiles) {
        setIsFull(true);
      } else {
        setIsFull(false);
      }
    }, [files]);

    const ProviderValue: FileUploadContext = {
      files: files,
      setFiles: setFiles,
      activeIndex,
      isFileTooBig,
      isFull,
      orientation,
      setActiveIndex,
      removeFileFromSet,
      addFileToSet,
      loadingState,
    };
    return (
      <fileUploadContext.Provider value={ProviderValue}>
        {children}
      </fileUploadContext.Provider>
    );
  }
);

FileUploader.displayName = "FileUploader";

export const FileInput = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { isFull, addFileToSet } = useFileUpload();
  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files.length) {
      addFileToSet(Array.from(event.currentTarget.files));
    }
  };
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        type="button"
        ref={ref}
        {...props}
        className={`relative w-fit p-2  ${isFull ? "cursor-not-allowed" : ""}`}
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </Button>
      <Input
        disabled={isFull}
        className={`hidden`}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png"
        onChange={onValueChange}
        ref={inputRef}
      />
    </>
  );
});

FileInput.displayName = "FileInput";

type FileUploaderContentProps = {
  children: React.ReactNode;
};

export const FileUploaderContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { orientation } = useFileUpload();
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className={cn("w-full px-1")} ref={containerRef}>
      <div
        {...props}
        ref={ref}
        className={cn(
          "flex rounded-xl gap-1",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
});

FileUploaderContent.displayName = "FileUploaderContent";

export const FileUploaderItem = React.forwardRef<
  HTMLDivElement,
  { index: number } & React.HTMLAttributes<HTMLDivElement>
>(({ className, index, children, ...props }, ref) => {
  const { removeFileFromSet, loadingState } = useFileUpload();
  return (
    <div
      ref={ref}
      className={cn(
        "aspect-video justify-between cursor-pointer relative",
        className
      )}
      {...props}
    >
      <div className="w-full rounded-md justify-center items-center flex">
        {children}
      </div>
      <Button
        type="button"
        variant={"ghost"}
        size={"sm"}
        className={cn("absolute -right-2 -top-5 p-2 bg-black rounded-full")}
        onClick={() => removeFileFromSet(index)}
        disabled={loadingState}
        aria-disabled={loadingState}
      >
        <span className="sr-only">remove item {index}</span>
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  );
});

FileUploaderItem.displayName = "FileUploaderItem";

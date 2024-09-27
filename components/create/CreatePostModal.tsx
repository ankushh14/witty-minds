"use client";

import { createPost } from "@/actions/posts/createPost.actions";
import * as Dialog from "@/components/ui/dialog";
import { createToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import * as FileUpload from "../ui/file-upload/file-upload";
import * as Form from "../ui/form";
import { Textarea } from "../ui/textarea";
import CreatePostButton from "./CreatePostButton";

const formSchema = z.object({
  title: z.string().refine((str) => str.length, {
    message: "Title is required",
  }),
  description: z.string().refine((str) => str.length, {
    message: "Description is required",
  }),
});

const CreatePostModal = () => {
  const [dialog, setDialog] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    if (files) {
      files.forEach((item) => {
        formData.append("files", item);
      });
    }
    const response = await createPost(formData);
    if (response.valid) {
      createToast({
        variant: "default",
        title: response.message,
        description: values.description,
      });
      form.reset();
      setFiles([]);
      setDialog(false);
    } else {
      createToast({
        variant: "destructive",
        title: response.message,
        description: values.description,
      });
    }
    setLoading(false);
  };

  return (
    <Dialog.Dialog open={dialog} onOpenChange={setDialog}>
      <Dialog.DialogTrigger
        tabIndex={-1}
        className="fixed right-3 bottom-8 md:right-16 md:bottom-16"
      >
        <CreatePostButton />
      </Dialog.DialogTrigger>
      <Dialog.DialogContent
        className="w-[90%] max-w-[500px]"
        aria-label="Create post modal"
        role="dialog"
      >
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>Create post</Dialog.DialogTitle>
          <Dialog.DialogDescription>
            {"The created post will be visible to all users."}
          </Dialog.DialogDescription>
        </Dialog.DialogHeader>
        <Form.Form {...form}>
          <form
            className="w-full flex flex-col space-y-4 mt-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Form.FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <Form.FormItem className="h-[140px]">
                  <Form.FormLabel>Title of the post*</Form.FormLabel>
                  <Form.FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your title here"
                      rows={2}
                      className="resize-none"
                    />
                  </Form.FormControl>
                  <Form.FormMessage className="text-xs" />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <Form.FormItem className="h-[200px]">
                  <Form.FormLabel>Description of the post*</Form.FormLabel>
                  <Form.FormControl>
                    <Textarea
                      {...field}
                      placeholder="Type your description here"
                      rows={6}
                      className="resize-none"
                    />
                  </Form.FormControl>
                  <Form.FormMessage className="text-xs" />
                </Form.FormItem>
              )}
            />
            <div className="w-full flex flex-col">
              <FileUpload.FileUploader
                files={files}
                setFiles={setFiles}
                orientation="horizontal"
                loadingState={loading}
              >
                <FileUpload.FileUploaderContent className="flex items-center flex-row gap-2">
                  {files?.map((file, i) => (
                    <FileUpload.FileUploaderItem
                      key={i}
                      index={i}
                      className="w-[30%] p-0 rounded-md"
                      aria-roledescription={`${file.name}`}
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        height={80}
                        width={80}
                        className="w-full h-full max-h-12 md:max-h-24 object-contain"
                      />
                    </FileUpload.FileUploaderItem>
                  ))}
                </FileUpload.FileUploaderContent>
                <ToolBar />
              </FileUpload.FileUploader>
            </div>
            <Dialog.DialogFooter>
              <SubmitButton loading={loading} />
            </Dialog.DialogFooter>
          </form>
        </Form.Form>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
};

const SubmitButton = ({
  loading,
}: Readonly<{
  loading: boolean;
}>) => {
  return (
    <Button
      type="submit"
      variant={"secondary"}
      aria-disabled={loading}
      disabled={loading}
      className="px-4 w-full"
    >
      Post
    </Button>
  );
};

const ToolBar = () => {
  return (
    <section className="w-full flex gap-2">
      <FileUpload.FileInput className="w-fit p-2" aria-label="Upload images">
        <ImagePlus />
      </FileUpload.FileInput>
    </section>
  );
};

export default CreatePostModal;

import { createDropzone } from "@soorria/solid-dropzone";
import { Inbox } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import toast from "solid-toast";


export default function FileUpload() {

  const [isUploading, setIsUploading] = createSignal(false);

  const uploadToS3 = createMutation(() => ({
    mutationKey: ["upload"],
    mutationFn: async (file: File) => {
      setIsUploading(true);
      // check file size before upload
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File is too large. Maximum size is 10MB.");
      }

      // create FormData for server upload
      const formData = new FormData();
      formData.append("file", file);

      // send to server-side s3 endpoint
      const response = await fetch("/api/upload/s3", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Upload successful");
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Upload failed. ${error.message}`);
    },
    onSettled: () => {
      console.log("Upload complete.");
      setIsUploading(false);
    }
  }));

  const dropzone = createDropzone({
    accept: ['application/pdf'],
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]; // accept only the first file
      uploadToS3.mutate(file)
    }
  });

  return (
    <div class="p-2 bg-white rounded-xl">
      <div class="cursor-pointer border-dashed border-2 border-neutral-300 rounded-xl bg-neutral-50 py-8 justify-center items-center flex flex-col" {...dropzone.getRootProps()}>
        <input {...dropzone.getInputProps()} />
        <div class="flex flex-col gap-4 justify-center items-center px-5">
          <Show when={isUploading()} fallback={<>
            <Inbox class="size-10 text-secondary" />
            <p class="mt-2 text-sm text-neutral-400">Drag 'n' drop a file here, or click to select a file</p>
          </>}>
            <span class="loading loading-spinner loading-xl text-secondary size-10"></span>
            <p class="mt-2 text-sm text-neutral-400">Uploading file...</p>
          </Show>
        </div>
      </div>
    </div>
  );
}

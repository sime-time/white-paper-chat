import { createDropzone } from "@soorria/solid-dropzone";
import { Inbox } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import { createMutation } from "@tanstack/solid-query";

export default function FileUpload() {
  const [uploadStatus, setUploadStatus] = createSignal<string | null>(null);

  const uploadMutation = createMutation(() => ({
    mutationKey: ["upload"],
    mutationFn: async (file: File) => {
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
    onMutate: (file) => {
      setUploadStatus(`Uploading ${file.name}...`);
    },
    onSuccess: () => {
      setUploadStatus("Upload successful")
    },
    onError: (error) => {
      console.error(error);
      setUploadStatus(`Upload failed. ${error.message}`)
    },
    onSettled: () => {
      console.log("Upload complete.");
    }
  }));

  const uploadToS3 = async (acceptedFiles: File[]) => {
    console.table(acceptedFiles);
    const file = acceptedFiles[0];
    uploadMutation.mutate(file)
  };

  const dropzone = createDropzone({
    accept: ['application/pdf'],
    maxFiles: 1,
    onDrop: uploadToS3
  });

  return (
    <div class="p-2 bg-white rounded-xl">
      <div class="cursor-pointer border-dashed border-2 border-neutral-300 rounded-xl bg-neutral-50 py-8 justify-center items-center flex flex-col" {...dropzone.getRootProps()}>
        <input {...dropzone.getInputProps()} />
        <div class="flex flex-col gap-4 justify-center items-center px-5">
          <Inbox class="size-10 text-secondary" />
          {dropzone.isDragActive ? (
            <p class="mt-2 text-sm text-neutral-400">Drop the file here ...</p>
          ) : (
            <p class="mt-2 text-sm text-neutral-400">Drag 'n' drop a file here, or click to select a file</p>
          )}
        </div>
      </div>
      <Show when={uploadStatus()}>
        <div class="mt-2 text-sm text-center">
          {uploadStatus()}
        </div>
      </Show>
    </div>
  );
}

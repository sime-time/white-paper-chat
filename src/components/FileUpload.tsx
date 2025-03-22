import { createDropzone } from "@soorria/solid-dropzone";
import { Inbox } from "lucide-solid";

export default function FileUpload() {
  const dropzone = createDropzone({
    accept: ['application/pdf'],
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      console.table(acceptedFiles);
    },
  });

  return (
    <div class="p-2 bg-white rounded-xl">
      <div class="cursor-pointer border-dashed border-2 border-neutral-300 rounded-xl bg-neutral-50 py-8 justify-center items-center flex flex-col" {...dropzone.getRootProps()}>
        <input {...dropzone.getInputProps()} />
        <div class="flex flex-col gap-4 justify-center items-center px-5">
          <Inbox class="size-10 text-secondary" />
          {
            dropzone.isDragActive ?
              <p class="mt-2 text-sm text-neutral-400">Drop the file here ...</p> :
              <p class="mt-2 text-sm text-neutral-400">Drag 'n' drop a file here, or click to select a file</p>
          }
        </div>

      </div>
    </div>
  );
}

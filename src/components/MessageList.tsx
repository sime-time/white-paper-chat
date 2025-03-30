import { Message } from "@ai-sdk/solid";
import { For } from "solid-js";

interface MessageListProps {
  messages: Message[];
}
export default function MessageList(props: MessageListProps) {
  if (!props.messages) return <></>

  return (
    <div class="flex flex-col gap-2 px-4">
      <For each={props.messages}>
        {(message) => (
          <div class={`flex ${message.role === "user" ? "justify-end pl-10" : "justify-start pr-10"}`}>
            <div class={` rounded-field p-3 text-sm shadow-md ring-1 ring-gray-900/10
              ${message.role === "user" ? "bg-primary text-white" : "bg-neutral-200/80"}`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

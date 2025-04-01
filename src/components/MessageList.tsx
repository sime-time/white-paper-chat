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
          <div class={`chat ${message.role === "user" ? "chat-end" : "chat-start"}`}>
            <div class={`chat-bubble
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

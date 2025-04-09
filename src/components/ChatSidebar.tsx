import { A } from "@solidjs/router";
import { MessageCircle, PlusCircle } from "lucide-solid";
import { For } from "solid-js";
import { DrizzleChat } from "~/drizzle/schema/chat-schema";

interface ChatSidebarProps {
  chats: DrizzleChat[] | undefined,
  chatId: number,
}
export default function ChatSidebar(props: ChatSidebarProps) {
  return (
    <div class="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <A href="/">
        <button class="btn btn-ghost btn-block border border-white border-dashed rounded-field">
          <PlusCircle class="mr-1 size-4" />
          New Chat
        </button>
      </A>

      <div class="flex flex-col gap-2 mt-4">
        <For each={props.chats}>
          {(chat, index) => (
            <a href={`/chat/${chat.id}`}>
              <div class={`rounded-field flex items-center p-3 text-slate-300
                ${chat.id === props.chatId
                  ? "bg-primary text-white"
                  : "hover:text-white"
                }`}
              >
                <MessageCircle class="size-4 mr-2" />
                <p class="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">{chat.pdfName}</p>
              </div>
            </a>
          )}
        </For>
      </div>

      <div class="absolute bottom-4 left-4">
        <div class="flex items-center gap-2 text-sm text-slate-500 text-wrap">
          <A href="/">Home</A>
          <A href="/">Source</A>
          {/* Stripe Button */}
        </div>

      </div>
    </div>
  );
}

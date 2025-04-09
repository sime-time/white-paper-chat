import { A } from "@solidjs/router";
import { MessageCircle, PlusCircle } from "lucide-solid";
import { For } from "solid-js";
import { DrizzleChat } from "~/drizzle/schema/chat-schema";
import { authClient } from "~/lib/auth-client";

interface ChatSidebarProps {
  chatId?: number,
  chats: DrizzleChat[] | undefined,
}
export default function ChatSidebar(props: ChatSidebarProps) {
  const handleSignOut = async () => {
    console.log("signing out...");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  return (
    <div class="w-full h-screen p-4 text-gray-200 bg-gray-900 flex flex-col justify-between">
      <div>
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

      </div>

      <div class="flex items-center gap-2 text-sm text-slate-500 w-full text-wrap">
        <button onClick={() => handleSignOut()} class="btn btn-secondary btn-block">Sign Out</button>
      </div>
    </div>
  );
}

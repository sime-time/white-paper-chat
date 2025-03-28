import { A } from "@solidjs/router";
import { PlusCircle } from "lucide-solid";
import { DrizzleChat } from "~/drizzle/schema/chat-schema";

interface ChatSidebarProps {
  chats: DrizzleChat[] | undefined,
  chatId: number,
}
export default function ChatSidebar(props: ChatSidebarProps) {
  return (
    <div class="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <A href="/">
        <button class="btn btn-ghost btn-block border-white border-dashed">
          <PlusCircle class="mr-1 size-4" />
          New Chat
        </button>
      </A>
    </div>
  );
}

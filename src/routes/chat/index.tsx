import { Show } from "solid-js";
import { createAsync, } from "@solidjs/router"
import { useServerSessionOrNull } from "~/lib/use-server-session";
import ErrorPage from "~/components/ErrorPage";
import ChatSidebar from "~/components/ChatSidebar";
import ChatMessenger from "~/components/ChatMessenger";
import { getChats } from "~/lib/chat-queries";

export const route = {
  preload: async () => {
    await getChats();
  },
};

export default function ChatPage() {
  const session = createAsync(() => useServerSessionOrNull());
  const chats = createAsync(() => getChats());

  return <Show when={session()} fallback={<ErrorPage />}>
    <main class="flex">
      <div class="flex w-full">

        <div class="flex-[1.5] 2xl:flex-[1] max-w-xs">
          <ChatSidebar chats={chats()} />
        </div>

        <div class="max-h-screen px-4 pt-1 flex-[5] flex flex-col justify-center items-center">
          <h2 class="font-semibold text-primary text-3xl">Select a pdf to begin chatting!</h2>
        </div>

        <div class="flex-[3] border-1/4 border-l-slate-200 pt-1">
          <ChatMessenger messages={undefined} />
        </div>

      </div>
    </main>
  </Show>
}

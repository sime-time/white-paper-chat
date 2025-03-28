import { createSignal, createEffect, Show } from "solid-js";
import { useParams, createAsync } from "@solidjs/router"
import { useServerSession } from "~/lib/use-server-session";
import ErrorPage from "~/components/ErrorPage";
import { db } from "~/drizzle/db";
import { chat, DrizzleChat } from "~/drizzle/schema/chat-schema";
import { eq } from "drizzle-orm";
import ChatSidebar from "~/components/ChatSidebar";

const getChats = async (userId: string = "") => {
  "use server"
  const userChats = await db.select().from(chat).where(eq(chat.userId, userId))
  return userChats as DrizzleChat[];
}

export default function Chat() {
  const params = useParams();
  const session = createAsync(() => useServerSession());

  const [chats, setChats] = createSignal<DrizzleChat[]>([]);
  createEffect(async () => {
    const chats = await getChats(session()?.user.id);
    setChats(chats);
  });


  if (!chats()) {
    return <div>Chats not found</div>
  }

  return <Show when={session()} fallback={<ErrorPage />}>
    <main class="flex max-h-screen overflow-scroll">
      <div class="flex w-full max-h-screen overflow-scroll">

        <div class="flex-[1.5] 2xl:flex-[1] max-w-xs">
          <ChatSidebar chats={chats()} chatId={parseInt(params.chatId)} />
        </div>

        <div class="max-h-screen p-4 overflow-scroll flex-[5]">
          {/* pdf viewer*/}
        </div>

        <div class="flex-[3] border-1/4 border-l-slate-200">
          {/* chat component */}
        </div>

      </div>
    </main>
  </Show>
}

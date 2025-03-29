import { createSignal, createEffect, Show, onMount } from "solid-js";
import { useParams, createAsync, query } from "@solidjs/router"
import { useServerSession } from "~/lib/use-server-session";
import ErrorPage from "~/components/ErrorPage";
import { db } from "~/drizzle/db";
import { chat, DrizzleChat } from "~/drizzle/schema/chat-schema";
import { eq } from "drizzle-orm";
import ChatSidebar from "~/components/ChatSidebar";
import PDFView from "~/components/PDFView";
import { getSignedPdfUrl } from "~/lib/download-from-s3";

// server-side query for chats
const getChats = query(async () => {
  "use server";
  const session = await useServerSession();
  const userId = session.user.id;

  const userChats = await db.select().from(chat).where(eq(chat.userId, userId));
  return userChats as DrizzleChat[];
}, "chats");


// server-side query for pdfUrl
const getPdfUrl = query(async (chatId: string) => {
  "use server";
  const currentChat = await db.select().from(chat).where(eq(chat.id, parseInt(chatId))).limit(1);

  const signedUrl = await getSignedPdfUrl(currentChat[0].fileKey);
  return signedUrl;
}, "pdfUrl");

export const route = {
  preload: async () => {
    const params = useParams();
    await getChats();
    await getPdfUrl(params.chatId);
  },
};

export default function Chat() {
  const params = useParams();
  const session = createAsync(() => useServerSession());
  const chats = createAsync(() => getChats());
  const pdfUrl = createAsync(() => getPdfUrl(params.chatId));

  return <Show when={session()} fallback={<ErrorPage />}>
    <main class="flex max-h-screen overflow-scroll">
      <div class="flex w-full max-h-screen overflow-scroll">

        <div class="flex-[1.5] 2xl:flex-[1] max-w-xs">
          <ChatSidebar chats={chats()} chatId={parseInt(params.chatId)} />
        </div>

        <div class="max-h-screen p-4 overflow-scroll flex-[5]">
          <PDFView pdfUrl={pdfUrl() || ""} />
        </div>

        <div class="flex-[3] border-1/4 border-l-slate-200">
          {/* chat component */}
        </div>

      </div>
    </main>
  </Show>
}

import { Show } from "solid-js";
import { useParams, createAsync, } from "@solidjs/router"
import { useServerSession } from "~/lib/use-server-session";
import ErrorPage from "~/components/ErrorPage";
import ChatSidebar from "~/components/ChatSidebar";
import PDFView from "~/components/PDFView";
import ChatMessenger from "~/components/ChatMessenger";
import { getChats, getPastMessages, getPdfUrl } from "~/lib/chat-queries";

export const route = {
  preload: async () => {
    const params = useParams();
    await getChats();
    await getPdfUrl(params.chatId);
    await getPastMessages(params.chatId);
  },
};

export default function Chat() {
  const params = useParams();
  const session = createAsync(() => useServerSession());
  const chats = createAsync(() => getChats());
  const pdfUrl = createAsync(() => getPdfUrl(params.chatId));
  const pastMessages = createAsync(() => getPastMessages(params.chatId));

  return <Show when={session()} fallback={<ErrorPage />}>
    <main class="flex">
      <div class="flex w-full">

        <div class="flex-[1.5] 2xl:flex-[1] max-w-xs">
          <ChatSidebar chats={chats()} chatId={parseInt(params.chatId)} />
        </div>

        <div class="max-h-screen px-4 pt-1 flex-[5]">
          <PDFView pdfUrl={pdfUrl() || ""} />
        </div>

        <div class="flex-[3] border-1/4 border-l-slate-200 pt-1">
          <ChatMessenger chatId={parseInt(params.chatId)} messages={pastMessages()} />
        </div>

      </div>
    </main>
  </Show>
}

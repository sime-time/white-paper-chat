import { useChat, Message } from "@ai-sdk/solid"
import { Send } from "lucide-solid";
import MessageList from "./MessageList";
import { createEffect, Suspense } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getMessages } from "~/lib/get-messages";

interface ChatMessengerProps {
  chatId: number;
}
export default function ChatMessenger(props: ChatMessengerProps) {
  const pastMessages = createAsync(() => getMessages(props.chatId));

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    streamProtocol: "text",
    body: {
      chatId: props.chatId
    },
    initialMessages: pastMessages(),
  });

  createEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  });

  return (
    <div class="relative max-h-screen overflow-scroll" id="message-container">
      {/* header */}
      <div class="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 class="text-xl font-bold">Chat</h3>
      </div>

      {/* message list */}
      <Suspense fallback={<div>Loading messages...</div>}>
        <MessageList messages={messages()} />
      </Suspense>

      {/* submit new message */}
      <form onSubmit={handleSubmit} class="sticky bottom-0 inset-x-0 px-2 py-4 bg-white">
        <div class="flex justify-between">
          <input
            value={input()}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            class="flex-grow input"
          />
          <button class="btn btn-primary ml-2">
            <Send class="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

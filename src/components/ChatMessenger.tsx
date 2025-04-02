import { useChat, Message } from "@ai-sdk/solid"
import { Send } from "lucide-solid";
import MessageList from "./MessageList";
import { createEffect } from "solid-js";
import { createQuery } from "@tanstack/solid-query";

interface ChatMessengerProps {
  chatId: number;
}
export default function ChatMessenger(props: ChatMessengerProps) {
  const { data } = createQuery(() => ({
    queryKey: ["chat", props.chatId],
    queryFn: async () => {
      try {
        const response = await fetch("/api/get-messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: props.chatId
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch messages");
        }
        return await response.json() as Message[];

      } catch (err) {
        console.log("Failed to get messages")
        return [];
      }
    }
  }));

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    streamProtocol: "text",
    body: {
      chatId: props.chatId
    },
    initialMessages: data || [],
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
      <MessageList messages={messages()} />

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

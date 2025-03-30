import { useChat, useCompletion } from "@ai-sdk/solid"
import { Send } from "lucide-solid";
import MessageList from "./MessageList";

export default function ChatMessenger() {
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    streamProtocol: "text",
  });

  return (
    <div class="relative max-h-screen overflow-scroll">
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
            class="flex-grow"
          />
          <button class="btn btn-primary ml-2">
            <Send class="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

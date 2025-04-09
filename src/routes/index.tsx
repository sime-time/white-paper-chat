import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { LogIn } from "lucide-solid";
import { createAsync } from "@solidjs/router";
import { useServerSession } from "~/lib/use-server-session";
import FileUpload from "~/components/FileUpload";

export default function Home() {
  const session = createAsync(() => useServerSession());

  return (
    <main class="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-indigo-100">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="flex flex-col items-center text-center gap-4">
          <div class="flex items-center">
            <h1 class="text-5xl font-semibold">Chat with Crypto White Papers</h1>
          </div>

          <Show when={session()}>
            <a class="btn" href="/chat">Go to Chats</a>
          </Show>

          <p class="max-w-xl text-lg text-slate-600">
            Join thousands of traders, investors, and whales to instantly answer questions about cryptocurrencies with AI.
          </p>

          <div class="w-full">
            <Show when={!session()} fallback={<FileUpload />}>
              <A href="/sign-in" class="btn btn-neutral">
                Login to get started!
                <LogIn class="size-4 ml-1" />
              </A>
            </Show>
          </div>
        </div>
      </div>
    </main>
  );
}

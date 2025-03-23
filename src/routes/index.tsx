import { authClient } from "~/lib/auth-client";
import { Show, createSignal, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import { LogIn } from "lucide-solid";
import FileUpload from "~/components/FileUpload";


export default function Home() {
  const session = authClient.useSession();
  const [isAuth, setIsAuth] = createSignal<boolean>(false);

  createEffect(() => {
    setIsAuth(!!session().data?.session.userId);
  });

  return (
    <main class="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="flex flex-col items-center text-center">

          <div class="flex items-center">
            <h1 class="text-5xl font-semibold">Chat with Crypto White Papers</h1>
          </div>

          <div class="flex my-4">
            <Show when={isAuth()}>
              <button class="btn">Go to Chats</button>
            </Show>
          </div>

          <p class="max-w-xl text-lg text-slate-600">
            Join thousands of traders, investors, and whales to instantly answer questions and research cryptocurrencies with AI.
          </p>

          <div class="w-full mt-4">
            <Show when={!isAuth()} fallback={<FileUpload />}>
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

import { Title } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import { useServerSession } from "~/lib/use-server-session";

export default function Protected() {
  const session = createAsync(() => useServerSession());
  return (
    <main>
      <Title>Protected</Title>
      <h1 class="text-center text-3xl font-bold mt-20">Protected Page</h1>
      <Show when={session()}>
        <h2 class="text-center text-amber-600 text-2xl font-semibold mt-10">Hidden protected page message</h2>
      </Show>
    </main>
  );
}

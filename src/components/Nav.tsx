import { Show } from "solid-js";
import { A } from "@solidjs/router";
import { useServerSessionOrNull } from "~/lib/use-server-session";
import { createAsync } from "@solidjs/router";
import { authClient } from "~/lib/auth-client";

function NavList() {
  return (
    <>
      <li><A href="/">Home</A></li>
    </>
  );

}

export default function Nav() {
  const session = createAsync(() => useServerSessionOrNull());

  const handleSignOut = async () => {
    console.log("signing out...");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  return (
    <nav class="navbar bg-base-100 shadow-sm">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul
            tabindex="-1"
            class="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <NavList />
          </ul>
        </div>
        <a href="/" class="btn btn-ghost text-xl">White Paper Chat</a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <NavList />
        </ul>
      </div>
      <div class="navbar-end">
        <Show when={session()} fallback={
          <a href="/sign-in" class="btn btn-primary">Sign In/Up</a>
        }>
          <button onClick={() => handleSignOut()} class="btn btn-secondary">Sign Out</button>
        </Show>
      </div>
    </nav>
  );
}

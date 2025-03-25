import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { auth } from "~/lib/auth";

export const useServerSession = query(async () => {
  "use server";
  const event = getRequestEvent();

  if (event) {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    if (session) {
      return session;
    }
  }
  throw redirect("/");

}, "session"); // cache this response under the 'session' cache key

export const useServerSessionOrNull = query(async () => {
  "use server";
  const event = getRequestEvent();

  if (event) {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    if (session) {
      return session;
    }
  }
  return null;

}, "session"); // cache this response under the 'session' cache key

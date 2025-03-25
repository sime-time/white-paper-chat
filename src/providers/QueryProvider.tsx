import { QueryClientProvider, QueryClient } from "@tanstack/solid-query";
import { ParentProps } from "solid-js";

const queryClient = new QueryClient();

export default function QueryProvider(props: ParentProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}

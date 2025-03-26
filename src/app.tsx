import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import Footer from "~/components/Footer";
import { Toaster } from "solid-toast";
import QueryProvider from "~/providers/QueryProvider";

import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>White Paper Chat</Title>
          <Suspense>
            <QueryProvider>
              <Nav />
              {props.children}
              <Toaster position="bottom-right" />
            </QueryProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

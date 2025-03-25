import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <main>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="text-center text-3xl text-error font-bold mt-20">Page Not Found</h1>
    </main>
  );
}

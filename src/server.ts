import { createServer } from "node:http";
import { Readable } from "node:stream";

import { bot } from "./bot/chat-bot";

function asRequestUrl(reqUrl: string | undefined): URL {
  return new URL(reqUrl ?? "/", `http://localhost:${process.env.PORT ?? "3000"}`);
}

async function toWebRequest(req: import("node:http").IncomingMessage): Promise<Request> {
  const url = asRequestUrl(req.url);
  const bodyStream =
    req.method === "GET" || req.method === "HEAD" ? undefined : Readable.toWeb(req);

  return new Request(url, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body: bodyStream,
    duplex: "half",
  });
}

async function sendWebResponse(
  res: import("node:http").ServerResponse,
  response: Response,
): Promise<void> {
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
}

async function handleWebhookRequest(
  req: import("node:http").IncomingMessage,
): Promise<Response> {
  const url = asRequestUrl(req.url);

  if (req.method === "GET" && url.pathname === "/health") {
    return Response.json({ ok: true, service: "europe-travel-chat-bot" });
  }

  const webRequest = await toWebRequest(req);
  if (url.pathname === "/webhooks/slack") {
    return bot.webhooks.slack(webRequest);
  }

  return Response.json(
    {
      ok: false,
      error: "Not found",
      endpoints: ["/webhooks/slack", "/health"],
    },
    { status: 404 },
  );
}

const port = Number(process.env.PORT ?? 3000);

const server = createServer(async (req, res) => {
  try {
    const response = await handleWebhookRequest(req);
    await sendWebResponse(res, response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ ok: false, error: message }));
  }
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Travel bot server listening on :${port} (Slack: /webhooks/slack)`,
  );
});

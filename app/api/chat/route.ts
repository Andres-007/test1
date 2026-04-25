import { bot } from "../../../src/bot/chat-bot";

export async function POST(request: Request): Promise<Response> {
  return bot.webhooks.slack(request);
}

export async function GET(): Promise<Response> {
  return Response.json({
    ok: true,
    service: "europe-travel-chat-bot",
    endpoints: {
      slack: "/api/chat",
    },
  });
}

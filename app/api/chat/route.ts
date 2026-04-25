import { bot } from "../../../src/bot/chat-bot";

function getPlatformFromRequest(request: Request): "slack" | "discord" {
  const url = new URL(request.url);
  const platform = (url.searchParams.get("platform") ?? "slack").toLowerCase();
  return platform === "discord" ? "discord" : "slack";
}

export async function POST(request: Request): Promise<Response> {
  const platform = getPlatformFromRequest(request);
  return platform === "discord"
    ? bot.webhooks.discord(request)
    : bot.webhooks.slack(request);
}

export async function GET(): Promise<Response> {
  return Response.json({
    ok: true,
    service: "europe-travel-chat-bot",
    endpoints: {
      slack: "/api/chat?platform=slack",
      discord: "/api/chat?platform=discord",
    },
  });
}

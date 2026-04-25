// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  // Check credentials at runtime
  if (!process.env.SLACK_SIGNING_SECRET || !process.env.SLACK_BOT_TOKEN) {
    return Response.json(
      { error: "Slack bot not configured. Set SLACK_SIGNING_SECRET and SLACK_BOT_TOKEN." },
      { status: 503 }
    );
  }

  // Dynamic import to avoid build errors when credentials are missing
  const { bot } = await import("../../../src/bot/chat-bot");
  return bot.webhooks.slack(request);
}

export async function GET(): Promise<Response> {
  const configured = !!(process.env.SLACK_SIGNING_SECRET && process.env.SLACK_BOT_TOKEN);
  
  return Response.json({
    ok: true,
    service: "europe-travel-chat-bot",
    configured,
    endpoints: {
      slack: "/api/chat",
    },
  });
}

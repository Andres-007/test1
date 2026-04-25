import { streamText } from "ai";
import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";

import { EUROPE_TRAVEL_AGENT_SYSTEM_PROMPT } from "./prompts/system-prompt";
import { travelTools } from "./tools/travel-tools";

type IncomingMessage = {
  text?: string | null;
  author?: { id?: string | null; name?: string | null } | null;
};

function normalizeMessageText(message: IncomingMessage): string {
  const text = message.text?.trim();
  return text && text.length > 0
    ? text
    : "Please help me optimize my European travel itinerary.";
}

async function handleTravelQuery(thread: any, message: IncomingMessage, eventName: string) {
  const prompt = normalizeMessageText(message);
  const actorId = message.author?.id ?? "anonymous-user";

  const result = streamText({
    // provider/model strings route through Vercel AI Gateway automatically.
    model: "anthropic/claude-3-5-sonnet",
    system: EUROPE_TRAVEL_AGENT_SYSTEM_PROMPT,
    prompt,
    tools: travelTools,
    toolChoice: "auto",
    providerOptions: {
      gateway: {
        // You can tune provider failover here without touching bot logic.
        order: ["anthropic", "bedrock", "openai"],
        models: ["openai/gpt-5.4", "anthropic/claude-sonnet-4.6"],
        user: actorId,
        tags: ["project:euro-travel-bot", `event:${eventName}`, "channel:chat-sdk"],
      },
    },
  });

  // Chat SDK applies platform-specific streaming behavior from one code path.
  await thread.post(result.fullStream);
}

// Lazy initialization - only create bot when credentials are available
let _bot: Chat | null = null;

export function getBot(): Chat {
  if (_bot) return _bot;

  // This will throw if credentials are missing - caught at runtime, not build time
  _bot = new Chat({
    userName: process.env.CHAT_BOT_USER_NAME ?? "euro-travel-assistant",
    adapters: {
      // Slack adapter auto-detects credentials from environment variables.
      slack: createSlackAdapter(),
    },
    // Dev state adapter:
    state: createMemoryState(),
    // Production swap:
    // state: createRedisState() // from "@chat-adapter/state-redis"
    dedupeTtlMs: 10 * 60 * 1000,
    streamingUpdateIntervalMs: 250,
  });

  _bot.onNewMention(async (thread: any, message: IncomingMessage) => {
    await thread.subscribe();
    await handleTravelQuery(thread, message, "new_mention");
  });

  _bot.onSubscribedMessage(async (thread: any, message: IncomingMessage) => {
    await handleTravelQuery(thread, message, "subscribed_message");
  });

  return _bot;
}

// For backwards compatibility - but will throw if called without credentials
export const bot = {
  get webhooks() {
    return getBot().webhooks;
  }
};

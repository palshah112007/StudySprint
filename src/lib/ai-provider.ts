import OpenAI from "openai";
import type { Stream } from "openai/core/streaming.js";
import type { ChatCompletion, ChatCompletionChunk } from "openai/resources/chat/completions/completions.js";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ProviderConfig = {
  name: string;
  apiKey?: string;
  baseURL: string;
  model?: string;
  headers?: Record<string, string>;
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const providerConfigs: ProviderConfig[] = [
  {
    name: "openrouter",
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    model: process.env.OPENROUTER_MODEL || process.env.AI_MODEL || "openrouter/free",
    headers: {
      "HTTP-Referer": appUrl,
      "X-OpenRouter-Title": "StudySprint",
    },
  },
  {
    name: "groq",
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    model: process.env.GROQ_MODEL || process.env.AI_MODEL || "llama-3.3-70b-versatile",
  },
  {
    name: "xai",
    apiKey: process.env.XAI_API_KEY || process.env.GROK_API_KEY,
    baseURL: "https://api.x.ai/v1",
    model: process.env.XAI_MODEL || process.env.GROK_MODEL || process.env.AI_MODEL || "grok-4.3",
  },
  {
    name: "nvidia",
    apiKey: process.env.NVIDIA_API_KEY || process.env.NVIDIA_NIM_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
    model: process.env.NVIDIA_MODEL || process.env.AI_MODEL,
  },
  {
    name: "openai",
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.openai.com/v1",
    model: process.env.OPENAI_MODEL || process.env.AI_MODEL || "gpt-4.1-mini",
  },
];

function configuredProviders() {
  const providers = providerConfigs.filter((provider) => provider.apiKey && provider.model);
  const preferred = (process.env.AI_PROVIDER || "").toLowerCase().trim();

  if (!preferred) return providers;

  return [
    ...providers.filter((provider) => provider.name === preferred),
    ...providers.filter((provider) => provider.name !== preferred),
  ];
}

function createClient(provider: ProviderConfig) {
  return new OpenAI({
    apiKey: provider.apiKey,
    baseURL: provider.baseURL,
    defaultHeaders: provider.headers,
  });
}

export function hasAiProvider() {
  return configuredProviders().length > 0;
}

export function getAiProviderNames() {
  return configuredProviders().map((provider) => provider.name).join(", ");
}

export async function createAiChatCompletion(params: {
  messages: ChatMessage[];
  maxTokens: number;
  stream: true;
  temperature?: number;
}): Promise<{ provider: string; completion: Stream<ChatCompletionChunk> }>;
export async function createAiChatCompletion(params: {
  messages: ChatMessage[];
  maxTokens: number;
  stream?: false | undefined;
  temperature?: number;
}): Promise<{ provider: string; completion: ChatCompletion }>;
export async function createAiChatCompletion(params: {
  messages: ChatMessage[];
  maxTokens: number;
  stream?: boolean;
  temperature?: number;
}): Promise<{ provider: string; completion: Stream<ChatCompletionChunk> | ChatCompletion }> {
  const providers = configuredProviders();

  if (providers.length === 0) {
    throw new Error(
      "No AI provider configured. Add OPENROUTER_API_KEY, GROQ_API_KEY, XAI_API_KEY, NVIDIA_API_KEY, or OPENAI_API_KEY."
    );
  }

  let lastError: unknown;

  for (const provider of providers) {
    try {
      const client = createClient(provider);

      const completion = await client.chat.completions.create(
        {
          model: provider.model!,
          messages: params.messages,
          max_tokens: params.maxTokens,
          temperature: params.temperature ?? 0.7,
          stream: params.stream ?? false,
        },
        { timeout: 30_000 }
      ) as Stream<ChatCompletionChunk> | ChatCompletion;

      return {
        provider: provider.name,
        completion,
      };
    } catch (error) {
      lastError = error;
      console.error(`AI provider ${provider.name} failed:`, error instanceof Error ? error.message : String(error));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("All configured AI providers failed");
}

export function extractJsonObject(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenced) return JSON.parse(fenced[1]);

    const object = text.match(/\{[\s\S]*\}/);
    if (object) return JSON.parse(object[0]);

    throw new Error("Could not parse JSON from AI response");
  }
}

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://studysprint.app",
    "X-Title": "StudySprint",
  },
});

const SYSTEM_PROMPT = `You are StudyBot, an AI study assistant for the StudySprint platform. You help students learn by:

1. Answering questions about any academic subject (Math, Physics, CS, Biology, Chemistry, Literature, History, Languages)
2. Explaining concepts clearly and conversationally
3. Creating study plans and schedules
4. Providing practice problems
5. Summarizing study materials
6. Offering study tips and productivity advice

Keep responses concise, encouraging, and focused on the student's learning. Use markdown for formatting when helpful. Keep responses under 300 words unless the user asks for more detail.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convert to OpenAI format
    const formattedMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "assistant" as const : "user" as const,
        content: msg.content,
      })),
    ];

    // Streaming via OpenRouter
    const stream = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: formattedMessages.slice(-10),
      max_tokens: 1024,
      stream: true,
    });

    const encoder = new TextEncoder();
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();

    // Stream text content
    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content || "";
      if (text) {
        writer.write(encoder.encode(text));
      }
    }
    writer.close();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get AI response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

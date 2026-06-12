import { checkRateLimit } from "@/lib/rate-limit";
import { createAiChatCompletion, hasAiProvider } from "@/lib/ai-provider";

const SYSTEM_PROMPT = `You are StudyBot, an AI agent and knowledge solver for the StudySprint platform. Answer any user query fully and clearly, including academics, coding, general knowledge, practical problems, study help, and personal guidance.

Your goals:
1. Answer questions accurately and completely.
2. Solve problems step-by-step when needed.
3. Provide practical help for both study-related and general-purpose queries.
4. Use markdown formatting when helpful.
5. Be concise, but expand when the user asks for more detail.

If the user asks for quizzes, summaries, flashcards, or study plans, generate those as needed. Do not refuse because the request is outside a narrow study assistant scope.`;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests. Wait 1 minute." }), {
      status: 429, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { messages } = await request.json();

    if (!hasAiProvider()) {
      return new Response(
        JSON.stringify({ error: "No AI provider is configured" }),
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

    const { completion: stream } = await createAiChatCompletion({
      messages: formattedMessages.slice(-10),
      maxTokens: 1024,
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Route error:", msg);
    return new Response(
      JSON.stringify({ error: "Failed to get AI response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

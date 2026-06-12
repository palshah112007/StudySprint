import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAiChatCompletion, hasAiProvider } from "@/lib/ai-provider";

const SUMMARIZE_PROMPT = `You are an expert study material summarizer. Given content from study notes, create a structured summary.

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "summary": "A comprehensive 2-3 paragraph summary of the content",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "suggestedTags": ["tag1", "tag2", "tag3"]
}

Rules:
- Summary should capture the main ideas and concepts
- Key points should be 4-7 actionable bullet points
- Suggested tags should be 3-5 relevant topics/subjects
- Keep the summary concise and study-friendly
- Highlight any formulas, definitions, or important terms`;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests. Wait 1 minute." }), {
      status: 429, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { content } = await request.json();

    if (!hasAiProvider()) {
      return NextResponse.json(
        { error: "No AI provider is configured" },
        { status: 500 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const truncatedContent = content.slice(0, 10000);

    const prompt = `Summarize the following study notes:\n\n${truncatedContent}`;

    const { completion } = await createAiChatCompletion({
      messages: [
        { role: "system", content: SUMMARIZE_PROMPT },
        { role: "user", content: prompt },
      ],
      maxTokens: 2048,
      temperature: 0.7,
      stream: false,
    });

    const text = completion.choices?.[0]?.message?.content || "";

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Could not parse summary JSON from response");
      }
    }

    return NextResponse.json({
      summary: result.summary || "",
      keyPoints: result.keyPoints || [],
      suggestedTags: result.suggestedTags || [],
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Route error:", msg);
    return NextResponse.json(
      { error: "Failed to summarize content" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://studysprint.app",
    "X-Title": "StudySprint",
  },
});

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
  try {
    const { content } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured" },
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

    const response = await client.chat.completions.create(
      {
        model: "google/gemini-2.0-flash-exp:free",
        max_tokens: 2048,
        messages: [
          { role: "system", content: SUMMARIZE_PROMPT },
          { role: "user", content: prompt },
        ],
      },
      { timeout: 30_000 }
    );

    const text = response.choices?.[0]?.message?.content || "";

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
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json(
      { error: "Failed to summarize content" },
      { status: 500 }
    );
  }
}

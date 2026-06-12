import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAiChatCompletion, hasAiProvider } from "@/lib/ai-provider";

const FLASHCARD_PROMPT = `You are an expert at creating educational flashcards. Given notes content, generate question-answer pairs.

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "cards": [
    {
      "front": "Question or term",
      "back": "Answer or definition",
      "difficulty": "easy|medium|hard"
    }
  ]
}

Rules:
- Each card should test a specific concept from the notes
- Front should be a clear question or term
- Back should be a concise answer or definition
- Vary the difficulty based on the complexity of concepts
- Make cards that are useful for spaced repetition study
- Include key terms, definitions, formulas, and important facts`;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests. Wait 1 minute." }), {
      status: 429, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { noteContent, count } = await request.json();

    if (!hasAiProvider()) {
      return NextResponse.json(
        { error: "No AI provider is configured" },
        { status: 500 }
      );
    }

    if (!noteContent || noteContent.trim().length === 0) {
      return NextResponse.json(
        { error: "Note content is required" },
        { status: 400 }
      );
    }

    const cardCount = Math.min(count || 10, 30);
    const truncatedContent = noteContent.slice(0, 8000);

    const prompt = `Create ${cardCount} flashcards from the following notes. Extract key concepts, terms, definitions, and important facts.\n\nNotes:\n${truncatedContent}`;

    const { completion } = await createAiChatCompletion({
      messages: [
        { role: "system", content: FLASHCARD_PROMPT },
        { role: "user", content: prompt },
      ],
      maxTokens: 4096,
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
        throw new Error("Could not parse flashcards JSON from response");
      }
    }

    return NextResponse.json({ cards: result.cards || [] });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Route error:", msg);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}

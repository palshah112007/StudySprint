import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { createAiChatCompletion, hasAiProvider } from "@/lib/ai-provider";

const QUIZ_PROMPT = `You are an expert quiz generator. Generate multiple-choice quiz questions.

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

Rules:
- Each question must have exactly 4 options
- correctIndex must be 0-3 matching the correct option
- Options should be plausible but distinct
- Explanations should be 1-2 sentences
- Ensure all content is accurate for the subject
- Make questions challenging but fair`;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests. Wait 1 minute." }), {
      status: 429, headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { subject, topic, difficulty, count, content } = await request.json();

    if (!hasAiProvider()) {
      return NextResponse.json(
        { error: "No AI provider is configured" },
        { status: 500 }
      );
    }

    const questionCount = Math.min(count || 10, 20);

    // Build prompt — if content is provided, generate questions based on it
    let prompt: string;
    if (content && content.trim().length > 0) {
      prompt = `I have the following study notes about "${subject}" (topic: "${topic || "General"}"). Generate exactly ${questionCount} multiple-choice questions BASED ON THE CONTENT of these notes. Test understanding of key concepts, terms, and ideas found in the text.

Notes content:
${content.slice(0, 6000)}

Difficulty level: ${difficulty || "mixed"}

Return ONLY valid JSON with the fields question, options, correctIndex, and explanation. Use exactly 4 answer options per question.

Generate ${questionCount} questions that test comprehension of the material above.`;
    } else {
      prompt = `Generate a quiz on "${subject}"${topic && topic !== "all" ? `, topic: "${topic}"` : ""} at "${difficulty || "mixed"}" difficulty. Generate exactly ${questionCount} questions. Return ONLY valid JSON with the field structure requested, and avoid markdown or code fences.`;
    }

    const { completion } = await createAiChatCompletion({
      messages: [
        { role: "system", content: QUIZ_PROMPT },
        { role: "user", content: prompt },
      ],
      maxTokens: 4096,
      temperature: 0.7,
      stream: false,
    });

    const text = completion.choices?.[0]?.message?.content || "";

    // Parse the JSON response
    let quiz;
    try {
      quiz = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        quiz = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Could not parse quiz JSON from response");
      }
    }

    return NextResponse.json({ questions: quiz.questions });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Route error:", msg);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}

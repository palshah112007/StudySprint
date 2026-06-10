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
  try {
    const { subject, topic, difficulty, count, content } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured" },
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

Generate ${questionCount} questions that test comprehension of the material above.`;
    } else {
      prompt = `Generate a quiz on "${subject}"${topic && topic !== "all" ? `, topic: "${topic}"` : ""} at "${difficulty || "mixed"}" difficulty. Generate exactly ${questionCount} questions.`;
    }

    const response = await client.chat.completions.create(
      {
        model: "google/gemini-2.0-flash-exp:free",
        max_tokens: 4096,
        messages: [
          { role: "system", content: QUIZ_PROMPT },
          { role: "user", content: prompt },
        ],
      },
      { timeout: 30_000 }
    );

    const text = response.choices?.[0]?.message?.content || "";

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
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}

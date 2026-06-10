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

const QUIZ_PROMPT = `You are an expert quiz generator. Given a subject, topic, and difficulty level, generate a quiz with questions and answers.

Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

Rules:
- Generate exactly 10 questions
- Each question must have exactly 4 options
- correctIndex must be 0-3 matching the correct option
- Options should be plausible but distinct
- Explanations should be 1-2 sentences
- Vary the difficulty within the requested level
- Ensure all content is accurate for the subject
- Make questions challenging but fair`;

export async function POST(request: Request) {
  try {
    const { subject, topic, difficulty, count } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const questionCount = count || 10;

    const prompt = `Generate a quiz on "${subject}"${topic && topic !== "all" ? `, topic: "${topic}"` : ""} at "${difficulty || "mixed"}" difficulty. Generate exactly ${questionCount} questions.`;

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

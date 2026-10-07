import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const quizSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      minItems: 15,
      maxItems: 15,
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
          },
          options: {
            type: "array",
            minItems: 4,
            maxItems: 4,
            items: {
              type: "string",
            },
          },
          answer: {
            type: "string",
          },
          explanation: {
            type: "string",
          },
        },
        required: ["question", "options", "answer", "explanation"],
      },
    },
  },
  required: ["questions"],
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const subject = body.subject || "General Computer Science"
    const difficulty = body.difficulty || "Medium"

    const prompt = `
You are the AI quiz generator for CloudLearn AI.

Generate EXACTLY 15 unique multiple-choice questions.

Subject: ${subject}
Difficulty: ${difficulty}

STRICT REQUIREMENTS:

1. Generate exactly 15 questions.
2. Every question must belong to the selected subject.
3. Each question must have exactly 4 options.
4. Only ONE option must be correct.
5. The "answer" must exactly match one of the four options.
6. Provide a short explanation for every answer.
7. Do not repeat questions.
8. Avoid asking the same concept repeatedly.
9. Questions must be suitable for B.Tech Information Technology students.
10. Questions must be technically accurate.
11. Do not generate True/False questions.
12. Return ONLY valid JSON matching the provided schema.
`

    console.log("Generating 15-question quiz:", {
      subject,
      difficulty,
    })

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    })

    const text = response.text

    if (!text) {
      throw new Error("Gemini returned an empty response.")
    }

    const data = JSON.parse(text)

    if (!data.questions || data.questions.length !== 15) {
      throw new Error(
        `Expected exactly 15 questions, but received ${
          data.questions?.length ?? 0
        }.`
      )
    }

    for (const question of data.questions) {
      if (
        !question.question ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        !question.answer ||
        !question.explanation
      ) {
        throw new Error("Invalid question format returned by Gemini.")
      }

      if (!question.options.includes(question.answer)) {
        throw new Error(
          "A question's answer does not match any of its options."
        )
      }
    }

    console.log("Successfully generated 15 questions.")

    return NextResponse.json(data)
  } catch (error) {
    console.error("GEMINI QUIZ ERROR:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate quiz.",
      },
      { status: 500 }
    )
  }
}
import {NextApiRequest, NextApiResponse} from "next";
import {NextResponse} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
export async function POST(req: Request) {
  try {
    const prompt = await req.json();
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt.prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
      // response: "this is a test",
    });
  } catch (error) {
    console.log("error =========", error);
    return NextResponse.json({
      // response: completion.choices[0].message.content,
      response: "Moltar isnt working right now. Please try again later.",
    });
  }
}

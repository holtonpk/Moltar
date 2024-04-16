import {NextApiRequest, NextApiResponse} from "next";
import {NextResponse} from "next/server";
import OpenAI from "openai";
import {encodingForModel} from "js-tiktoken";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const maxDuration = 300; // 5 minutes

const OPEN_AI_TOKEN_Limit = 1500;

export async function POST(req: Request) {
  try {
    const {prompt, text} = await req.json();

    const tokens = await getTokenLength(prompt + text);

    if (tokens > OPEN_AI_TOKEN_Limit) {
      const response = await mapReduce(prompt, text);
      if (response.success === false) {
        return NextResponse.json({
          success: false,
          response: response.response,
        });
      }
      return NextResponse.json({
        success: true,
        response: response.response,
      });
    } else {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Respond in a formatted response. As the author of this text im seeking your expertise in extracting insights related to the text.  I would like you to answer to following prompt: ${prompt}. Here is the text:\n\n${text}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      return NextResponse.json({
        success: true,
        response: completion.choices[0].message.content,
      });
    }
  } catch (error: any) {
    console.log("error =========", error);
    return NextResponse.json({
      success: false,
      response: error.message,
      // response: "Moltar isnt working right now. Please try again later.",
    });
  }
}

async function mapReduce(prompt: string, text: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/map-reduce`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        text: text,
      }),
    }
  );
  const resJson = await res.json();
  return resJson;
}

export async function GET() {
  const prompt = "Create 5 questions to help me study";
  const transcript =
    "The following is a transcript of a podcast episode. The episode is about the history of the United States. The episode is hosted by a historian who is an expert on the subject. The episode covers the major events in the history of the United States, including the American Revolution, the Civil War, and the Civil Rights Movement. The episode also discusses the impact of these events on American society and culture. The episode is informative and engaging, and the host presents the information in a clear and engaging manner. The episode is well-researched and provides a comprehensive overview of the history of the United States.";

  try {
    return NextResponse.json({
      response: "",
    });
  } catch (error) {
    console.log("error =========", error);
    return NextResponse.json({
      response: "Moltar isn't working right now. Please try again later.",
    });
  }
}

async function getTokenLength(text: string) {
  const encodings = await encodingForModel("gpt-3.5-turbo");
  const tokens = encodings.encode(text);
  return tokens.length;
}

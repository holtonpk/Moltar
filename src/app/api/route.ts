import {NextApiRequest, NextApiResponse} from "next";
import {NextResponse} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is securely stored
});
export async function POST(req: NextApiRequest, response: NextApiResponse) {
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

const dummyInput = `create a detailed summary`;

const dummyFileData = `Throughout my years, I’ve been captivated by the stories that shape our
world – tales of determination, of individuals rising against odds, of
dreams sculpting realities. The world is teeming with success stories, each
as unique as the fingerprints of those who forged them. But as I navigated
my way through countless tales of triumphs and trials, I noticed a void.
While there were countless expansive biographies and technical business
texts, there was a lack of compelling narratives that could inspire us in
mere minutes. I envisioned a collection that could be savored during brief
moments stolen from a bustling day—a coffee break, a short commute, or
those fleeting minutes before sleep.
“Snapshots of Success” is the culmination of that vision. It is
a passion project, fueled by my deep respect for the indomitable spirit
of entrepreneurs and an earnest desire to offer nuggets of inspiration to
dreamers everywhere. Every narrative chosen, every entrepreneur’s story
penned down, has been a personal journey for me, intertwining my pas-
sion for storytelling with my respect for the world’s changemakers. This is
not just a book; it’s a labor of love, capturing the essence of the entrepre-
neurial journey.
Preface`;

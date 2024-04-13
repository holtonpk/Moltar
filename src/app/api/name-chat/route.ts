import {NextApiRequest, NextApiResponse} from "next";
import {NextResponse} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
export async function POST(req: Request) {
  try {
    const {prompt, response} = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate a short, descriptive name (40 characters max) for a chat session that is based on the given prompt '${prompt}' and relates to the project ${response}. The name should be concise, memorable, and accurately reflect the discussion's focus on the project. It should engage the target audience of college students and highlight key aspects of the conversation related to the project's theme or goal. don't put it in quotes`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      success: true,
      response: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.log("error =========", error);
    return NextResponse.json({
      success: false,
      response: error.message,
      // response: "Moltar isnt working right now. Please try again later.",
    });
  }
}

export async function GET() {
  const prompt = "Create a detailed note outline";
  const response = `--- **Note Outline: "Alexander the Great"** I. **Early Life and Reign** A. *Chapter I: Alexander's Childhood and Youth* - Rigorous education and development of leadership traits. - Early indicators of his ambitious nature. B. *Chapter II: Beginning of His Reign* - Ascension to power and initial military and political strategies. II. **Major Battles and Conquests** A. *Chapter III: The Reaction* - Initial responses to his reign and the Battle of Gaugamela. B. *Chapter IV: Crossing the Hellespont* - Discusses the strategic significance of moving forces into Asia. C. *Chapter V: Campaign in Asia Minor* - Tactical decisions in key battles throughout Asia Minor. D. *Chapter VI: Defeat of Darius* - Detailed account of the confrontation with Darius III and its implications. III. **Further Expansions and Challenges** A. *Chapter VII: The Siege of Tyre* - Strategic analysis of the successful siege of Tyre. B. *Chapter VIII: Alexander in Egypt* - His journey to Egypt and the establishment of Alexandria. IV. **Decline of Character and Internal Struggles** A. *Chapter IX: The Great Victory* - Examination of victories against the backdrop of ethical and moral deterioration. B. *Chapter X: The Death of Darius* - The final defeat of Darius and the further impact on Alexander’s rule. V. **The Final Years - Downfall and Legacy** A. *Chapter XI: Deterioration of Character* - Exploration of Alexander's increasing despotism and estrangement from his peers. B. *Chapter XII: Alexander’s End* - The circumstances of his death and subsequent legacy and the impact on his empire. **Conclusion** - Analysis of Alexander’s dual legacy as a master tactician and flawed ruler, reflecting on the complexities inherent in his vast conquests and the eventual fragmentation of his empire. ---`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Generate a short, descriptive name (40 characters max) for a chat session that is based on the given prompt '${prompt}' and relates to the project ${response}. The name should be concise, memorable, and accurately reflect the discussion's focus on the project. It should engage the target audience of college students and highlight key aspects of the conversation related to the project's theme or goal. don't put it in quotes`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      success: true,
      response: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.log("error =========", error);
    return NextResponse.json({
      success: false,
      response: error.message,
      // response: "Moltar isnt working right now. Please try again later.",
    });
  }
}

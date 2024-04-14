import {NextResponse} from "next/server";
import cheerio from "cheerio";
import axios from "axios";
import {getSubtitles} from "youtube-captions-scraper";

export const maxDuration = 300; // 5 minutes

export async function POST(req: Request) {
  const requestBody = await req.json();
  const url = requestBody.url;
  const videoID = url.split("=")[1].slice(0, 11);
  try {
    const captionsRes = await getSubtitles({
      videoID: videoID, // youtube video id
      lang: "en", // default: `en`
    });

    const captions = captionsRes.map((caption: any) => caption.text);
    const transcript = captions.join(" ");
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    $("script").remove();

    const title = $("title").text().replace(/\n/g, "").split("- YouTube")[0];

    return NextResponse.json({
      id: videoID,
      title: title,
      thumbnail: `https://img.youtube.com/vi/${videoID}/0.jpg`,
      text: transcript,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}

export async function GET() {
  const url = "https://www.youtube.com/watch?v=-1NFirxhXWE";
  const videoID = url.split("=")[1];
  try {
    const captionsRes = await getSubtitles({
      videoID: videoID, // youtube video id
      lang: "en", // default: `en`
    });

    const captions = captionsRes.map((caption: any) => caption.text);
    const transcript = captions.join(" ");
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);
    $("script").remove();

    const title = $("title").text().replace(/\n/g, "").split("- YouTube")[0];

    return NextResponse.json({
      id: videoID,
      title: title,
      thumbnail: `https://img.youtube.com/vi/${videoID}/0.jpg`,
      text: transcript,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({message: error});
  }
}

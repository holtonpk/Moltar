import GPT4Tokenizer from "gpt4-tokenizer";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
  const {str} = await req.json();
  const TOKEN_LIMIT = 1500;
  const tokenizer = new GPT4Tokenizer({type: "gpt3"}); // or 'codex'
  const estimatedTokenCount = tokenizer.estimateTokenCount(str); // 7
  return NextResponse.json({
    isAcceptable: estimatedTokenCount < TOKEN_LIMIT,
    size: estimatedTokenCount,
  });
}

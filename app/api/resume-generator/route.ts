// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Edge runtime for longer timeout (30s vs 10s on Hobby plan)
export const runtime = 'edge';
export const maxDuration = 30;

// import { checkSubscription } from "@/lib/subscription";
// import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request
) {
  try {
    // const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // const freeTrial = await checkApiLimit(); // HACK: this endpoint where we throw the error for non-paying users
    // const isPro = await checkSubscription();

    // console.log({ isPro, freeTrial });

    // if (!freeTrial && !isPro) {
    //   return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    // }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages
    });

    // console.log('success');
    // console.log(response.choices[0].message);

    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log('[RESUME_GENERATOR_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

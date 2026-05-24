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
  console.log('=== [API] /api/resume-generator POST called ===');

  try {
    // const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    console.log('[API] Request body received, messages count:', messages?.length || 0);

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    if (!process.env.OPENAI_API_KEY) {
      console.error('[API] ERROR: OpenAI API Key not configured!');
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }
    console.log('[API] OpenAI API Key exists:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...');

    if (!messages) {
      console.error('[API] ERROR: No messages in request');
      return new NextResponse("Messages are required", { status: 400 });
    }

    // Log first message content (truncated)
    if (messages[0]?.content) {
      console.log('[API] First message content (first 200 chars):', messages[0].content.substring(0, 200));
    }

    // const freeTrial = await checkApiLimit(); // HACK: this endpoint where we throw the error for non-paying users
    // const isPro = await checkSubscription();

    // console.log({ isPro, freeTrial });

    // if (!freeTrial && !isPro) {
    //   return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    // }

    console.log('[API] Calling OpenAI API with gpt-4o...');
    const startTime = Date.now();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      // Without an explicit cap the completion can be cut short, which truncates
      // the JSON and drops later resume sections (experience, education, etc.).
      // gpt-4o supports up to 16,384 output tokens — give the model room for a
      // full, comprehensive resume.
      max_tokens: 16000,
    });

    const finishReason = response.choices[0]?.finish_reason;
    if (finishReason === 'length') {
      console.warn('[API] WARNING: response truncated by token limit (finish_reason=length)');
    }

    const duration = Date.now() - startTime;
    console.log('[API] OpenAI response received in', duration, 'ms');
    console.log('[API] Response role:', response.choices[0]?.message?.role);
    console.log('[API] Response content length:', response.choices[0]?.message?.content?.length || 0);
    console.log('[API] Response content (first 300 chars):', response.choices[0]?.message?.content?.substring(0, 300));
    console.log('[API] Usage:', response.usage);

    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    console.log('[API] Returning successful response');
    return NextResponse.json(response.choices[0].message);
  } catch (error: any) {
    console.error('=== [API] ERROR in /api/resume-generator ===');
    console.error('[API] Error name:', error?.name);
    console.error('[API] Error message:', error?.message);
    console.error('[API] Error status:', error?.status);
    console.error('[API] Full error:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

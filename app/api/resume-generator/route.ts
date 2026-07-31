// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import { ratelimit, getClientIp } from "@/lib/ratelimit";

// Edge runtime for longer timeout (30s vs 10s on Hobby plan)
export const runtime = 'edge';
export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request
) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('[API] OpenAI API key not configured');
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    // Per-IP rate limit. Each request is a gpt-4o call, so this is the main guard
    // against the endpoint being scripted into a large bill. Fails open if Upstash
    // isn't configured or is unreachable (so a limiter outage can't break the app).
    if (ratelimit) {
      try {
        const ip = getClientIp(req);
        const { success, limit, remaining, reset } = await ratelimit.limit(ip);
        if (!success) {
          return new NextResponse(
            JSON.stringify({ error: "Too many requests. Please slow down and try again shortly." }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "X-RateLimit-Limit": String(limit),
                "X-RateLimit-Remaining": String(remaining),
                "X-RateLimit-Reset": String(reset),
              },
            }
          );
        }
      } catch (limiterError: any) {
        // Don't let a limiter outage take down generation — allow the request.
        console.error('[API] rate limiter error, allowing request:', limiterError?.message || limiterError);
      }
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

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

    if (response.choices[0]?.finish_reason === 'length') {
      console.warn('[API] Response truncated by token limit (finish_reason=length)');
    }

    return NextResponse.json(response.choices[0].message);
  } catch (error: any) {
    console.error('[API] /api/resume-generator error:', error?.message || error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

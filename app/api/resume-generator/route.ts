// import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

// import { checkSubscription } from "@/lib/subscription";
// import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

    if (!configuration.apiKey) {
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

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // model: "gpt-4-turbo-preview",
      messages
    });

    // console.log('success');
    // console.log(response.data.choices[0].message);

    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json(response.data.choices[0].message);
  } catch (error) {
    console.log('[RESUME_GENERATOR_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

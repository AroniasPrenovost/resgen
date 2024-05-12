import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

import { cookies } from 'next/headers'


console.log('/api/webhook/route.ts');

export async function POST(req: Request) {
  // NO reasonto run it: 

  console.log('SUCCESS: ', req);
  /*

  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string
  // const rawBody = await GetRawBody(req);

  console.log('sig');
  console.log(signature)

  // const reqStatus
  const bodyObj = JSON.parse(body);
  const requestStatus = bodyObj.data.object.status;
  const paymentSuccessful = bodyObj.data.object.paid;

  // console.log('does this fire', {
  //   requestStatus,
  //   paymentSuccessful,
  //   bodyObj,
  // });

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // console.log(event);
  console.log('___ get the event');

  const session = event.data.object as Stripe.Checkout.Session;

  console.log('___ get the session');

    const cookieStore = cookies()
      cookies().set('name', 'lee', { secure: true })
  const theme = cookieStore.get('theme');
  console.log('store ', cookieStore);
  console.log(theme);

  console.log({event, session});


  if (event.type === "checkout.session.completed") {

    console.log('checkout.session.completed');



    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    await prismadb.userSubscription.create({
      data: {
        userId: session?.metadata?.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    })
  }

  // if (event.type === "invoice.payment_succeeded") {
  //   const subscription = await stripe.subscriptions.retrieve(
  //     session.subscription as string
  //   )

  //   await prismadb.userSubscription.update({
  //     where: {
  //       stripeSubscriptionId: subscription.id,
  //     },
  //     data: {
  //       stripePriceId: subscription.items.data[0].price.id,
  //       stripeCurrentPeriodEnd: new Date(
  //         subscription.current_period_end * 1000
  //       ),
  //     },
  //   })
  // }

  return new NextResponse(null, { status: 200  })

  */
};
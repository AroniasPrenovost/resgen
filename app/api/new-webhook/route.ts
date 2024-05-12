import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import GetRawBody from "raw-body";

// youtube demo
// https://www.youtube.com/watch?v=uQAf6huBIks

// ENV's
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

console.log({
	STRIPE_SECRET_KEY, 
	WEBHOOK_SECRET,
});

// pyament link: https://buy.stripe.com/test_eVa037g9N8axgpyeUU

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
	apiVersion: "2022-11-15", // different than demo, but expected
});

const endpointSecret = WEBHOOK_SECRET as string; 


// without this, you'll get a stream.not.readable error 
export const config = {
	api: {
		bodyParser: false,
	}
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {

		console.log(' ');
		console.log(' ');
		console.log('__ /api/new-webhook.ts --> handler __');

		console.log("req.headers", req.headers);

		if (req.method !== "POST") {
			return res.status(405).send("Only POST requests allowed");
		}

		const sig: any = req.headers["stripe-signature"];
		const rawBody = await GetRawBody(req);

		let event;

		try {
			event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
		} catch (err: any) {
			return res.status(400).send(`Webhook error: ${err.message}`);
		}

		console.log("event.type: ", JSON.stringify(event.type));

		if (event.type === 'checkout.session.completed') {
			const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
				(event.data.object as any).id, 
				{
					expand: ["line_items"]
				}
			);

			const lineItems = sessionWithLineItems.line_items;
			if (!lineItems) return res.status(500).send("Internal server error");

			try {
				console.log('fullfill payment/order (by downloading?');
				const customer = (event.data.object as any).customer_details;

				const data = {
					lineItems, 
					customer,
				};

				console.log('TRANSACTION DATA: ', data);


			} catch(error) {
				console.log(`Unable to process payment: ${error}`);
			}
		}

		res.status(200).end();

	} catch (error) {
		console.log(error);
	}
}




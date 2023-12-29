import Stripe from 'stripe';
import { secret, planIds } from "../credentials/stripe/stripeCreds.js";

const stripe = new Stripe(secret);

const successUrl = 'dashboard';
const cancelUrl = 'dashboard';

const listProducts = () => {
    console.log('fetching...')
    stripe.products.list({ limit: 10 })
    .then(products => {
        products.data.forEach((product) => {
            console.log(product.name, product.id);
        })
    })
    .catch(error => {
        console.error('Error retrieving products:', error);
        // Handle error
    });
};

const createSubscriptionPaymentLink = async (subscriptionId) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: subscriptionId, // Use the price ID of your subscription
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return session.url;
    } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
    }
};

export const subscribe = (planNum) => {
    if (planNum > 3 || planNum < 1) {
        return;
    }

    const planId = planIds[planNum - 1];

    createSubscriptionPaymentLink(planId);
};
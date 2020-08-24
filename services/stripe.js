const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);

const createCharge = async (chargeAmount, chargeDescription, token) => {
    const charge = await stripe.charges.create({
        amount: chargeAmount,
        currency: 'usd',
        description: chargeDescription || 'No description.',
        source: token,
    });
    return charge;
}

module.exports = {
    createCharge
};

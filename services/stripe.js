const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);

const charge = async (chargeAmount, chargeDescription, token) => {
    const charge = await stripe.charges.create({
        amount: req.query.amount,
        currency: 'usd',
        description: chargeDescription || "No description.",
        source: token,
    });
    return charge;
}

module.exports = {
    charge
};
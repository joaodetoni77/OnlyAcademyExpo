const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_51PNn4fFLKOK3qDE8Io7MfF1V2iLdGtcfPkIWVlVyAPZEz1rdeoQLEaMIyhjtdP8WNllGONF130VfDHQrIJqVNZRd004MuDEJ7a');

const app = express();
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
    const { planoId } = req.body;

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                plano: planoId,
                quantity: 1,
            },
        ],
        //success_url: '',
        //cancel_url: '',
    });

    res.json({ sessionId: session.id });
});

app.listen(3000, () => {
    console.log('Servidor em execução na porta 3000');
});

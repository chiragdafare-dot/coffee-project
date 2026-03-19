const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// VERY IMPORTANT → serve frontend
app.use(express.static(__dirname));

// Razorpay setup
const razorpay = new Razorpay({
  key_id: "rzp_test_eHn3iQx1qlPNj3",
  key_secret: "YOUR_KEY_SECRET"
});

// Create order
app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR"
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send("Error creating order");
  }
});

// Home route (fixes Cannot GET /)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
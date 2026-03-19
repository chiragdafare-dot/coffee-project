const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
app.use(express.static("public"));
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/coffee');

const OrderSchema = new mongoose.Schema({
  paymentId: String,
  amount: Number,
  status: String
});

const Order = mongoose.model('Order', OrderSchema);

// Razorpay
const razorpay = new Razorpay({
  key_id: "rzp_test_eHn3iQx1qlPNj3",
  key_secret: "YOUR_KEY_SECRET"
});

// Create Order
app.post('/create-order', async (req, res) => {
  const options = {
    amount: req.body.amount * 100,
    currency: "INR"
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});

// Verify + Save Order
app.post('/verify-payment', async (req, res) => {

  const order = new Order({
    paymentId: req.body.paymentId,
    amount: req.body.amount,
    status: "Confirmed"
  });

  // await order.save();

  sendEmail("customer@gmail.com", req.body.amount);

  res.json({ success: true });
});

// View Orders
app.get('/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your@gmail.com',
    pass: 'app-password'
  }
});

function sendEmail(to, amount){
  transporter.sendMail({
    from: 'Coffee House',
    to,
    subject: 'Order Confirmed ☕',
    text: `Your order of ₹${amount} is confirmed!`
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/create-order', (req, res) => {
  res.json({ id: "test_order", amount: 10000 });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
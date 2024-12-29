const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors')
const { connectDB } = require('./db/dbConnection');
dotenv.config();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://quickcart-store.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Requested Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS
app.use(cors(corsOptions));

// CORS preflight
app.options('*', cors(corsOptions))

app.get('/', (req, res) => {
  res.send('QuickCart Backend is up. 😊');
});

app.use('/api/v1', require('./src/routes/index.js'));

connectDB();

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(
    `App listening on port ${host} on ${process.env.ENVIRONMENT}`
  );
});

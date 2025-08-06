import express from 'express';
import cors from 'cors';
import { connectdb } from './config/db.js';
import dotenv from "dotenv";
import userRouter from "./Route/GptRoute.js";
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
connectdb()
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173',
"https://western-gpt-ai.vercel.app"
  ], // or your frontend origin
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRouter)
app.get('/', (req, res) => {
    res.send('Welcome to the back-end server!');
})
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
})
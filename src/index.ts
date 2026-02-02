import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import { PORT } from "./config/index";

import authRouter from "./routes/auth.route";
import { connectDatabase } from "./database/mongodb";
import path from "path";

dotenv.config()
const app : Application= express();

let corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3005"] 
}
app.use(cors(corsOptions));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(bodyParser.json());

app.use('/api/auth', authRouter);

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`app is running on: http://localhost:${PORT}`)
  })
}

startServer();
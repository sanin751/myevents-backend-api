import dotenv from "dotenv";
import { PORT } from "./config/index";
import { connectDatabase } from "./database/mongodb";
import { createApp } from "./app";

dotenv.config();

const app = createApp();

async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`app is running on: http://localhost:${PORT}`);
  });
}

startServer();
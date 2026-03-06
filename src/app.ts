import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import banquetRouter from "./routes/banquet.route";
import authRouter from "./routes/auth.route";
import adminRouter from "./routes/admin/user.route";
import decorationRouter from "./routes/decoration.route";
import photographyRouter from "./routes/photography.route";
import bookingsRouter from "./routes/booking.route";

export const createApp = (): Application => {
  const app: Application = express();

  const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3005"],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(morgan("dev"));
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
  app.use(bodyParser.json());

  app.use("/api/auth", authRouter);
  app.use("/api/banquets", banquetRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/decorations", decorationRouter);
  app.use("/api/photography", photographyRouter);
  app.use("/api/bookings", bookingsRouter);

  return app;
};

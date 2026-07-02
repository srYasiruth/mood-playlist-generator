import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";
import { apiRateLimiter } from "./middleware/rateLimit.middleware";
import { authRouter } from "./modules/auth/auth.routes";
import { moodsRouter } from "./modules/moods/moods.routes";
import { playlistsRouter } from "./modules/playlists/playlists.routes";
import { sharingRouter } from "./modules/sharing/sharing.routes";
import { usersRouter } from "./modules/users/users.routes";
import { formatSuccess } from "./utils/responseFormatter";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(apiRateLimiter);

app.get("/api/health", (_req, res) => {
  res.json(formatSuccess("Mood-Based Playlist Generator API is running"));
});

app.use("/api/auth", authRouter);
app.use("/api/moods", moodsRouter);
app.use("/api/playlists", playlistsRouter);
app.use("/api/sharing", sharingRouter);
app.use("/api/users", usersRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use(errorMiddleware);


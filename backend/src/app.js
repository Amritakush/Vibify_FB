import express from "express";
import cors from "cors";

const app = express();

// Frontend (localhost:5173) ko backend se baat karne ki permission
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Request ki body me aayi JSON ko padhne layak banata hai
app.use(express.json());

// Health check: server chal raha hai ya nahi
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Vibify API is running",
  });
});

export default app;
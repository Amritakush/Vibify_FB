import "dotenv/config";
import fs from "node:fs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Song from "../models/Song.js";

const brokenFile = new URL("../data/songs.broken.json", import.meta.url);
const broken = JSON.parse(fs.readFileSync(brokenFile, "utf-8"));
const ids = broken.map((song) => song.videoId).filter(Boolean);

await connectDB();

try {
  const result = await Song.deleteMany({ videoId: { $in: ids } });
  const left = await Song.countDocuments();
  console.log(`Removed ${result.deletedCount} unplayable songs. Songs left in database: ${left}`);
} finally {
  await mongoose.disconnect();
}
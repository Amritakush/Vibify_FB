import "dotenv/config";
import fs from "node:fs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Song from "../models/Song.js";

const filePath = new URL("../data/songs.json", import.meta.url);
const songs = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// 1) Pehle database se connect karo
await connectDB();

try {
  // 2) Phir purana galat index hatao aur naya banao
  await Song.syncIndexes();

  // 3) Phir songs daalo
  let failed = 0;

  for (const song of songs) {
    try {
      await Song.findOneAndUpdate({ videoId: song.videoId }, song, {
        upsert: true, // nahi hai to naya banao, hai to update karo
        runValidators: true, // model ke rules check karo
        setDefaultsOnInsert: true,
      });
    } catch (err) {
      failed++;
      console.error(`Failed: "${song.title}" -> ${err.message}`);
    }
  }

  const total = await Song.countDocuments();
  console.log(`Seed finished. Songs in file: ${songs.length}, failed: ${failed}, total in database: ${total}`);
} finally {
  await mongoose.disconnect();
}
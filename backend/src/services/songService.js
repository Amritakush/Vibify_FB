import Song from "../models/Song.js";
import ApiError from "../utils/ApiError.js";

// User ke text me jo special characters hain (. * + ?) unhe normal text bana do,
// warna koi galat search se server crash kar sakta hai
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSongs = async ({ mood, language, q, page, limit }) => {
  const filter = {};

  if (mood) {
    filter.moods = mood.trim().toLowerCase();
  }

  if (language) {
    // capital/small ka fark nahi: "hindi" bhi "Hindi" se match hoga
    filter.language = new RegExp(`^${escapeRegex(language.trim())}$`, "i");
  }

  if (q) {
    const regex = new RegExp(escapeRegex(q.trim()), "i");
    filter.$or = [{ title: regex }, { artists: regex }];
  }

  const skip = (page - 1) * limit;

  const [songs, total] = await Promise.all([
    Song.find(filter).sort({ title: 1, _id: 1 }).skip(skip).limit(limit),
    Song.countDocuments(filter),
  ]);

  return {
    songs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getSongById = async (id) => {
  const song = await Song.findById(id);
  if (!song) {
    throw new ApiError(404, "Song not found");
  }
  return song;
};
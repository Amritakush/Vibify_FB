import Song from "../models/Song.js";
import ApiError from "../utils/ApiError.js";

// User ke text me jo special characters hain (. * + ?) unhe normal text bana do,
// warna koi galat search se server crash kar sakta hai
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Poora naam match ho, par capital/small ka fark na pade
const exactNameRegex = (text) => new RegExp(`^${escapeRegex(text.trim())}$`, "i");

export const getSongs = async ({ mood, language, artist, q, page, limit }) => {
  const filter = {};

  if (mood) {
    filter.moods = mood.trim().toLowerCase();
  }

  if (language) {
    filter.language = exactNameRegex(language);
  }

  if (artist) {
    // artists ek array hai; array ka koi bhi element match ho to song aa jata hai
    filter.artists = exactNameRegex(artist);
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

// Browse page ke liye: har mood / language / artist me kitne songs hain
export const getFacets = async () => {
  const countBy = (pipeline) =>
    Song.aggregate([
      ...pipeline,
      { $sort: { count: -1, _id: 1 } },
    ]).then((rows) => rows.map((row) => ({ name: row._id, count: row.count })));

  const [moods, languages, artists] = await Promise.all([
    countBy([{ $unwind: "$moods" }, { $group: { _id: "$moods", count: { $sum: 1 } } }]),
    countBy([{ $group: { _id: "$language", count: { $sum: 1 } } }]),
    countBy([{ $unwind: "$artists" }, { $group: { _id: "$artists", count: { $sum: 1 } } }]),
  ]);

  return { moods, languages, artists };
};
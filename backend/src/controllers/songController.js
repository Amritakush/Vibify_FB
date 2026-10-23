import * as songService from "../services/songService.js";
import ApiError from "../utils/ApiError.js";

// ?mood=a&mood=b jaisi query array ban jaati hai; sirf normal text hi lo
const asString = (value) => (typeof value === "string" ? value : undefined);

const parsePositiveInt = (value, fallback, name, max) => {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new ApiError(400, `${name} must be a positive whole number`);
  }
  return max ? Math.min(number, max) : number;
};

export const listSongs = async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1, "page");
  const limit = parsePositiveInt(req.query.limit, 20, "limit", 50);

  const { songs, pagination } = await songService.getSongs({
    mood: asString(req.query.mood),
    language: asString(req.query.language),
    q: asString(req.query.q),
    page,
    limit,
  });

  res.status(200).json({ success: true, data: songs, pagination });
};

export const getSong = async (req, res) => {
  const song = await songService.getSongById(req.params.id);
  res.status(200).json({ success: true, data: song });
};
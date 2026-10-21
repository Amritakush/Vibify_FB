import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    artists: {
      type: [{ type: String, trim: true }],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one artist is required",
      },
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
    },
    moods: {
      type: [{ type: String, trim: true, lowercase: true }],
      default: [],
    },
    videoId: {
      type: String,
      required: [true, "YouTube video id is required"],
      unique: true,
      trim: true,
      match: [/^[A-Za-z0-9_-]{11}$/, "Invalid YouTube video id"],
    },
  },
  {
    timestamps: true, // createdAt aur updatedAt apne aap
    toJSON: { virtuals: true }, // thumbnail API response me bhi aaye
  }
);

// Thumbnail database me save nahi hota, videoId se bana liya jaata hai
songSchema.virtual("thumbnail").get(function () {
  return `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`;
});

// Indexes: search aur filter tez karne ke liye
songSchema.index({ title: "text", artists: "text" }); // search ke liye
songSchema.index({ moods: 1 });
songSchema.index({ language: 1 });

const Song = mongoose.model("Song", songSchema);

export default Song;
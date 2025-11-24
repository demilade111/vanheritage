import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    heritageSite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HeritageSite",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only favorite a site once
favoriteSchema.index({ user: 1, heritageSite: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);


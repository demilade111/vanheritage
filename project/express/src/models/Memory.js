import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
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
    story: {
      type: String,
      required: [true, "Story text is required"],
      trim: true,
      minlength: [10, "Story must be at least 10 characters"],
      maxlength: [2000, "Story cannot exceed 2000 characters"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
memorySchema.index({ heritageSite: 1, createdAt: -1 });
memorySchema.index({ user: 1 });

const Memory = mongoose.model("Memory", memorySchema);

export default Memory;

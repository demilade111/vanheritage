import mongoose from "mongoose";

const heritageSiteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    neighbourhood: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    year_built: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    history: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    builtBy: {
      type: String,
      trim: true,
    },
    architecturalStyle: {
      type: String,
      trim: true,
    },
    significance: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for geospatial queries
heritageSiteSchema.index({ latitude: 1, longitude: 1 });

const HeritageSite = mongoose.model("HeritageSite", heritageSiteSchema);

export default HeritageSite;

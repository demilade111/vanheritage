import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import HeritageSite from "../models/HeritageSite.js";

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const raw = JSON.parse(
      fs.readFileSync("src/data/heritage-sites.json", "utf8")
    );
    const records = raw.records || raw;

    const formatted = records.map((record) => {
      const f = record.fields || record;
      const coords = f.geo_point_2d || {};
      return {
        name: f.buildingnamespecifics || f.streetname || "Unknown",
        address: `${f.streetnumber || ""} ${f.streetname || ""}`.trim(),
        neighbourhood: f.localarea || "Unknown",
        category: f.category || "Uncategorized",
        year_built: f.yearofconstruction || null,
        latitude: coords.lat ?? null,
        longitude: coords.lon ?? null,
      };
    });

    await HeritageSite.deleteMany();
    await HeritageSite.insertMany(formatted);

    console.log(`Imported ${formatted.length} heritage sites`);
    process.exit(0);
  } catch (err) {
    console.error("Import failed:", err.message);
    process.exit(1);
  }
};

importData();

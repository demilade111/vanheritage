import dotenv from "dotenv";
import mongoose from "mongoose";
import HeritageSite from "../models/HeritageSite.js";

dotenv.config();

const addSampleInfo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Update Carnegie Centre
    await HeritageSite.updateOne(
      { name: { $regex: /Carnegie Centre/i } },
      {
        $set: {
          description:
            "The Carnegie Centre is a historic community center in Vancouver's Downtown Eastside, originally built as the main branch of the Vancouver Public Library.",
          history:
            "Opened in 1903, this was Vancouver's first purpose-built library, funded by a $50,000 grant from Andrew Carnegie. The building served as the main library until 1957 and is now a cherished community center serving the Downtown Eastside.",
          builtBy: "George William Grant & Charles Brettingham Henderson",
          architecturalStyle: "Edwardian Classical",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Carnegie_Community_Centre.jpg/1200px-Carnegie_Community_Centre.jpg",
          significance:
            "Designated as a National Historic Site of Canada, representing Vancouver's early public library movement and Carnegie's philanthropic legacy.",
        },
      }
    );
    console.log("✅ Updated Carnegie Centre");

    // Update Fire Hall No. 6
    await HeritageSite.updateOne(
      { name: { $regex: /Fire Hall.*6/i } },
      {
        $set: {
          description:
            "A beautiful heritage fire hall building, now serving the community in a new capacity while preserving its historic character.",
          history:
            "Built in the early 1900s to serve Vancouver's growing West End neighbourhood, this fire hall represents the city's commitment to public safety during its rapid expansion period.",
          architecturalStyle: "Edwardian Public Works",
          significance:
            "One of Vancouver's historic fire halls, representing the development of municipal services in the early 20th century.",
        },
      }
    );
    console.log("✅ Updated Fire Hall No. 6");

    // Update Hycroft
    await HeritageSite.updateOne(
      { name: { $regex: /Hycroft/i } },
      {
        $set: {
          description:
            "An elegant Edwardian mansion, now home to the University Women's Club of Vancouver, Hycroft is one of Shaughnessy's most impressive heritage homes.",
          history:
            "Built for General Alexander Duncan McRae in 1909-1911, this 20,000 square foot mansion showcases the grandeur of early 20th century Vancouver. The Italian Renaissance-style architecture features imported marble, ornate plasterwork, and magnificent woodwork throughout.",
          builtBy: "Thomas Hooper",
          architecturalStyle: "Italian Renaissance Revival",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Hycroft_Manor.jpg/1200px-Hycroft_Manor.jpg",
          significance:
            "One of Vancouver's finest examples of Edwardian residential architecture, representing the city's early elite and the development of the prestigious Shaughnessy neighbourhood. Municipally designated heritage site.",
        },
      }
    );
    console.log("✅ Updated Hycroft");

    // Close connection
    await mongoose.connection.close();
    console.log("\n🎉 Sample heritage information added successfully!");
    console.log(
      "Visit any of these sites in the app to see the enhanced display!"
    );
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

addSampleInfo();

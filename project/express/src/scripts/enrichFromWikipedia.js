import dotenv from "dotenv";
import mongoose from "mongoose";
import HeritageSite from "../models/HeritageSite.js";
import axios from "axios";

dotenv.config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchWikipedia(siteName, address) {
  try {
    // Search for the site on Wikipedia
    const searchQuery = `${siteName} Vancouver heritage`;
    const searchUrl = `https://en.wikipedia.org/w/api.php`;
    const searchParams = {
      action: "query",
      list: "search",
      srsearch: searchQuery,
      format: "json",
      srlimit: 3,
    };

    const searchResponse = await axios.get(searchUrl, { params: searchParams });

    if (searchResponse.data.query.search.length === 0) {
      return null;
    }

    // Get the first result's page
    const pageTitle = searchResponse.data.query.search[0].title;

    // Fetch page content
    const contentParams = {
      action: "query",
      titles: pageTitle,
      prop: "extracts|pageimages",
      exintro: true,
      explaintext: true,
      piprop: "original",
      format: "json",
    };

    const contentResponse = await axios.get(searchUrl, {
      params: contentParams,
    });
    const pages = contentResponse.data.query.pages;
    const page = pages[Object.keys(pages)[0]];

    if (page.pageid) {
      return {
        description: page.extract ? page.extract.substring(0, 500) : null,
        imageUrl: page.original ? page.original.source : null,
        wikipediaTitle: pageTitle,
      };
    }

    return null;
  } catch (error) {
    console.log(`  ⚠️  Wikipedia search failed: ${error.message}`);
    return null;
  }
}

async function enrichHeritageSites() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get sites that don't have descriptions
    const sitesWithoutInfo = await HeritageSite.find({
      $or: [
        { description: null },
        { description: { $exists: false } },
        { imageUrl: null },
        { imageUrl: { $exists: false } },
      ],
    }).limit(50); // Process 50 sites at a time to avoid rate limiting

    console.log(`📚 Found ${sitesWithoutInfo.length} sites to enrich\n`);

    let enriched = 0;
    let failed = 0;

    for (const site of sitesWithoutInfo) {
      console.log(`🔍 Searching: ${site.name}`);

      const wikiData = await searchWikipedia(site.name, site.address);

      if (wikiData) {
        const updateData = {};

        if (wikiData.description && !site.description) {
          updateData.description = wikiData.description;
        }

        if (wikiData.imageUrl && !site.imageUrl) {
          updateData.imageUrl = wikiData.imageUrl;
        }

        if (Object.keys(updateData).length > 0) {
          await HeritageSite.findByIdAndUpdate(site._id, updateData);
          console.log(
            `  ✅ Enriched with ${Object.keys(updateData).join(", ")}`
          );
          enriched++;
        } else {
          console.log(`  ℹ️  No new data found`);
        }
      } else {
        console.log(`  ❌ No Wikipedia data found`);
        failed++;
      }

      // Rate limiting - wait 1 second between requests
      await sleep(1000);
    }

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Enriched: ${enriched} sites`);
    console.log(`  ❌ Failed: ${failed} sites`);

    await mongoose.connection.close();
    console.log("\n🎉 Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

enrichHeritageSites();

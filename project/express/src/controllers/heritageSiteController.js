import HeritageSite from "../models/HeritageSite.js";
import Memory from "../models/Memory.js";
import axios from "axios";

export const getHeritageSites = async (req, res) => {
  try {
    const { neighbourhood, yearBuilt, category, withImages } = req.query;

    let filter = {};

    if (neighbourhood) {
      filter.neighbourhood = new RegExp(neighbourhood, "i");
    }

    if (yearBuilt) {
      filter.year_built = parseInt(yearBuilt);
    }

    if (category) {
      filter.category = new RegExp(category, "i");
    }

    // Filter to show only sites with images
    if (withImages === "true") {
      filter.imageUrl = { $ne: null, $exists: true };
    }

    const sites = await HeritageSite.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: sites.length,
      data: sites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHeritageSite = async (req, res) => {
  try {
    const site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Heritage site not found",
      });
    }

    // Get memories for this site
    const memories = await Memory.find({ heritageSite: site._id })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        site,
        memories,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHeritageSitePhoto = async (req, res) => {
  try {
    const site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Heritage site not found",
      });
    }

    // Try Google Places API first if enabled
    if (process.env.GOOGLE_PLACES_API_KEY && site.latitude && site.longitude) {
      try {
        const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
        const searchParams = {
          location: `${site.latitude},${site.longitude}`,
          radius: 100,
          keyword: site.name,
          key: process.env.GOOGLE_PLACES_API_KEY,
        };

        const searchResponse = await axios.get(searchUrl, {
          params: searchParams,
        });

        if (
          searchResponse.data.results &&
          searchResponse.data.results.length > 0
        ) {
          const place = searchResponse.data.results[0];

          if (place.photos && place.photos.length > 0) {
            const photoReference = place.photos[0].photo_reference;
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

            return res.status(200).json({
              success: true,
              data: {
                photoUrl,
                placeId: place.place_id,
                placeName: place.name,
                source: "google_places",
              },
            });
          }
        }
      } catch (googleError) {
        console.log(
          "Google Places API failed, using fallback:",
          googleError.message
        );
      }
    }

    // Fallback to Unsplash for heritage building photos
    try {
      const searchQuery = `${
        site.neighbourhood || "Vancouver"
      } heritage building architecture`;
      const unsplashUrl = `https://api.unsplash.com/photos/random`;
      const unsplashParams = {
        query: searchQuery,
        orientation: "landscape",
        client_id:
          process.env.UNSPLASH_ACCESS_KEY ||
          "nDQXBP0xUGqvPVxC9T4DxECB8rBQ3gYiOUfOiAYL9-o",
      };

      const unsplashResponse = await axios.get(unsplashUrl, {
        params: unsplashParams,
      });

      if (unsplashResponse.data && unsplashResponse.data.urls) {
        return res.status(200).json({
          success: true,
          data: {
            photoUrl: unsplashResponse.data.urls.regular,
            photographerName: unsplashResponse.data.user.name,
            photographerLink: unsplashResponse.data.user.links.html,
            source: "unsplash",
          },
        });
      }
    } catch (unsplashError) {
      console.log("Unsplash API failed:", unsplashError.message);
    }

    res.status(404).json({
      success: false,
      message: "No photo found for this location",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get unique neighbourhoods
// @route   GET /api/heritage-sites/filters/neighbourhoods
// @access  Public
export const getNeighbourhoods = async (req, res) => {
  try {
    const neighbourhoods = await HeritageSite.distinct("neighbourhood");

    res.status(200).json({
      success: true,
      data: neighbourhoods.filter((n) => n).sort(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

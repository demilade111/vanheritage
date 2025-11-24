import Favorite from "../models/Favorite.js";
import HeritageSite from "../models/HeritageSite.js";

// @desc    Toggle favorite (add or remove)
// @route   POST /api/favorites/:siteId
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { siteId } = req.params;

    // Check if site exists
    const site = await HeritageSite.findById(siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Heritage site not found",
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      heritageSite: siteId,
    });

    if (existingFavorite) {
      // Remove favorite
      await existingFavorite.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Removed from favorites",
        isFavorited: false,
      });
    } else {
      // Add favorite
      await Favorite.create({
        user: req.user._id,
        heritageSite: siteId,
      });
      return res.status(200).json({
        success: true,
        message: "Added to favorites",
        isFavorited: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
export const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate("heritageSite")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites.map((fav) => fav.heritageSite),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check if site is favorited
// @route   GET /api/favorites/:siteId/check
// @access  Private
export const checkFavorite = async (req, res) => {
  try {
    const { siteId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user._id,
      heritageSite: siteId,
    });

    res.status(200).json({
      success: true,
      isFavorited: !!favorite,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get favorite count for a site
// @route   GET /api/favorites/:siteId/count
// @access  Public
export const getFavoriteCount = async (req, res) => {
  try {
    const { siteId } = req.params;

    const count = await Favorite.countDocuments({ heritageSite: siteId });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


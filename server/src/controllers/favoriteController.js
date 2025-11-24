import Favorite from "../models/Favorite.js";
import HeritageSite from "../models/HeritageSite.js";


export const toggleFavorite = async (req, res) => {
  try {
    const { siteId } = req.params;


    const site = await HeritageSite.findById(siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Heritage site not found",
      });
    }


    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      heritageSite: siteId,
    });

    if (existingFavorite) {
      await existingFavorite.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Removed from favorites",
        isFavorited: false,
      });
    } else {
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


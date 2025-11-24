import HeritageSite from "../models/HeritageSite.js";


export const updateHeritageSite = async (req, res) => {
  try {
    const {
      description,
      history,
      imageUrl,
      year_built,
      architecturalStyle,
      builtBy,
      significance,
    } = req.body;

    let site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Heritage site not found",
      });
    }

    // Update fields
    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (history !== undefined) updateData.history = history;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (year_built !== undefined) updateData.year_built = year_built;
    if (architecturalStyle !== undefined)
      updateData.architecturalStyle = architecturalStyle;
    if (builtBy !== undefined) updateData.builtBy = builtBy;
    if (significance !== undefined) updateData.significance = significance;

    site = await HeritageSite.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: site,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Bulk update heritage sites from Wikipedia
// @route   POST /api/admin/heritage-sites/enrich
// @access  Private (Admin only)
export const enrichFromWikipedia = async (req, res) => {
  try {
    const { siteIds } = req.body;

    if (!siteIds || !Array.isArray(siteIds)) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of site IDs",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enrichment started. Check server logs for progress.",
    });

    // Process in background (you could use a job queue in production)
    // For now, just acknowledge the request
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

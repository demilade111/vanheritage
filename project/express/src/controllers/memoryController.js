import Memory from "../models/Memory.js";
import HeritageSite from "../models/HeritageSite.js";

export const createMemory = async (req, res) => {
  try {
    const { heritageSite, story, title, imageUrl } = req.body;

    const site = await HeritageSite.findById(heritageSite);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Heritage site not found",
      });
    }

    const finalImageUrl = req.file ? req.file.path : imageUrl;

    const memory = await Memory.create({
      user: req.user._id,
      heritageSite,
      story,
      title,
      imageUrl: finalImageUrl,
    });

    const populatedMemory = await Memory.findById(memory._id).populate(
      "user",
      "username"
    );

    res.status(201).json({
      success: true,
      data: populatedMemory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMemory = async (req, res) => {
  try {
    let memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    if (memory.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this memory",
      });
    }

    const { story, title, imageUrl } = req.body;
    const finalImageUrl = req.file ? req.file.path : imageUrl;

    memory = await Memory.findByIdAndUpdate(
      req.params.id,
      { story, title, imageUrl: finalImageUrl },
      { new: true, runValidators: true }
    ).populate("user", "username");

    res.status(200).json({
      success: true,
      data: memory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);

    if (!memory) {
      return res.status(404).json({
        success: false,
        message: "Memory not found",
      });
    }

    if (memory.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this memory",
      });
    }

    await memory.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user._id })
      .populate("heritageSite", "name address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memories.length,
      data: memories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSiteMemories = async (req, res) => {
  try {
    const { siteId } = req.params;

    const memories = await Memory.find({ heritageSite: siteId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: memories.length,
      data: memories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

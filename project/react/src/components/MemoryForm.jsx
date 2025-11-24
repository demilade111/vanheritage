import React, { useState } from "react";
import { memoryAPI } from "../services/api";
import {
  HiPencil,
  HiSparkles,
  HiPhotograph,
  HiCamera,
  HiLink,
  HiBookOpen,
  HiSave,
  HiX,
} from "react-icons/hi";

const MemoryForm = ({ siteId, memory, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: memory?.title || "",
    story: memory?.story || "",
    imageUrl: memory?.imageUrl || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(memory?.imageUrl || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, imageUrl: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("story", formData.story);
      submitData.append("heritageSite", siteId);

      if (imageFile) {
        submitData.append("image", imageFile);
      } else if (formData.imageUrl) {
        submitData.append("imageUrl", formData.imageUrl);
      }

      if (memory) {
        await memoryAPI.update(memory._id, submitData);
      } else {
        await memoryAPI.create(submitData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save memory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 glass-dark flex items-center justify-center animate-fadeIn"
      style={{ zIndex: 10000 }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full mx-4 shadow-2xl border-4 border-slate-200 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 flex justify-between items-center rounded-t-3xl shadow-lg">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            {memory ? (
              <HiPencil className="text-3xl" />
            ) : (
              <HiSparkles className="text-3xl" />
            )}
            {memory ? "Edit Memory" : "Add Memory"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none transition-all duration-300 hover:rotate-90"
          >
            <HiX />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                <HiPencil className="text-lg" />
                Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                maxLength={100}
                placeholder="Give your memory a title..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                <HiPhotograph className="text-lg" />
                Image (Optional)
              </label>

              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200"
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <HiCamera className="text-sm" />
                  Upload an image from your device
                </p>
              </div>

              <div className="text-center text-gray-500 text-sm mb-3">OR</div>

              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setImageFile(null);
                  setImagePreview(e.target.value);
                }}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                placeholder="https://example.com/image.jpg"
                disabled={!!imageFile}
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <HiLink className="text-sm" />
                Paste a link to an image
              </p>

              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-xl border-2 border-slate-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                <HiBookOpen className="text-lg" />
                Your Story
              </label>
              <textarea
                value={formData.story}
                onChange={(e) =>
                  setFormData({ ...formData, story: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 h-32"
                required
                minLength={10}
                maxLength={2000}
                placeholder="Share your memories or knowledge about this heritage site..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.story.length}/2000 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : memory ? (
                  <>
                    <HiPencil className="text-lg" />
                    Update Memory
                  </>
                ) : (
                  <>
                    <HiSparkles className="text-lg" />
                    Add Memory
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 border-2 border-gray-300 flex items-center justify-center gap-2"
              >
                <HiX className="text-lg" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemoryForm;

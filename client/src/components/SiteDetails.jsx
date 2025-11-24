import React, { useState, useEffect } from "react";
import { heritageSiteAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import MemoryForm from "./MemoryForm";
import {
  HiLocationMarker,
  HiGlobe,
  HiCalendar,
  HiUser,
  HiBookOpen,
  HiCamera,
  HiStar,
  HiPlus,
  HiPencil,
  HiX,
} from "react-icons/hi";
import { FaDirections, FaPalette, FaHardHat, FaBuilding } from "react-icons/fa";
import { GiGreekTemple } from "react-icons/gi";

const SiteDetails = ({ site, onClose, onMemoryAdded }) => {
  const { isAuthenticated } = useAuth();
  const [siteData, setSiteData] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMemoryForm, setShowMemoryForm] = useState(false);

  useEffect(() => {
    loadSiteDetails();
  }, [site._id]);

  const loadSiteDetails = async () => {
    try {
      setLoading(true);
      const promises = [
        heritageSiteAPI.getOne(site._id),
        heritageSiteAPI.getPhoto(site._id),
      ];

      const responses = await Promise.allSettled(promises);

      if (responses[0].status === "fulfilled") {
        setSiteData(responses[0].value.data.data);
      }

      if (
        responses[1].status === "fulfilled" &&
        responses[1].value.data.success
      ) {
        setPhoto(responses[1].value.data.data);
      }
    } catch (error) {
      // Silently fail when server is offline
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = () => {
    if (siteData?.site?.latitude && siteData?.site?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${siteData.site.latitude},${siteData.site.longitude}`;
      window.open(url, "_blank");
    }
  };

  const handleMemorySuccess = () => {
    setShowMemoryForm(false);
    loadSiteDetails();
    if (onMemoryAdded) onMemoryAdded();
  };

  if (!siteData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 glass-dark flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn border-2 sm:border-4 border-slate-200">
        <div className="sticky top-0 bg-gradient-to-r from-teal-700 to-blue-900 px-3 sm:px-6 py-3 sm:py-5 flex justify-between items-center rounded-t-2xl sm:rounded-t-3xl shadow-lg">
          <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3 pr-2">
            <GiGreekTemple className="text-xl sm:text-2xl lg:text-3xl" />
            <span className="line-clamp-2">{siteData.site.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-2xl leading-none transition-all duration-300 hover:rotate-90 flex-shrink-0"
          >
            <HiX />
          </button>
        </div>

        <div className="p-3 sm:p-6">
          {(siteData.site.imageUrl || (photo && photo.photoUrl)) && (
            <div className="mb-6 animate-fadeIn">
              <img
                src={siteData.site.imageUrl || photo.photoUrl}
                alt={siteData.site.name}
                className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl sm:rounded-2xl shadow-xl border-2 sm:border-4 border-slate-100"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <p className="text-xs text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
                <HiCamera className="text-sm" />
                {siteData.site.imageUrl
                  ? "Heritage Site Image"
                  : "Image via Google Places"}
              </p>
            </div>
          )}

          {(siteData.site.description || siteData.site.history) && (
            <div className="mb-6 space-y-4">
              {siteData.site.description && (
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-6 border-2 border-blue-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600 mb-3 flex items-center gap-2">
                    <HiBookOpen className="text-2xl" />
                    About This Site
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {siteData.site.description}
                  </p>
                </div>
              )}

              {siteData.site.history && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 mb-3 flex items-center gap-2">
                    <GiGreekTemple className="text-2xl" />
                    Historical Significance
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {siteData.site.history}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border-2 border-slate-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <HiLocationMarker className="text-lg" />
                Address
              </h3>
              <p className="text-gray-800 font-medium">
                {siteData.site.address}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border-2 border-slate-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <HiGlobe className="text-lg" />
                Neighbourhood
              </h3>
              <p className="text-gray-800 font-medium">
                {siteData.site.neighbourhood}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border-2 border-slate-200">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <FaBuilding className="text-lg" />
                Category
              </h3>
              <p className="text-gray-800 font-medium">
                {siteData.site.category}
              </p>
            </div>
            {siteData.site.year_built && (
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border-2 border-slate-200">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <HiCalendar className="text-lg" />
                  Year Built
                </h3>
                <p className="text-gray-800 font-medium">
                  {siteData.site.year_built}
                </p>
              </div>
            )}
            {siteData.site.architecturalStyle && (
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border-2 border-slate-200">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <FaPalette className="text-lg" />
                  Architectural Style
                </h3>
                <p className="text-gray-800 font-medium">
                  {siteData.site.architecturalStyle}
                </p>
              </div>
            )}
            {siteData.site.builtBy && (
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border-2 border-slate-200">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <FaHardHat className="text-lg" />
                  Built By
                </h3>
                <p className="text-gray-800 font-medium">
                  {siteData.site.builtBy}
                </p>
              </div>
            )}
          </div>

          {siteData.site.significance && (
            <div className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 animate-fadeIn">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-3 flex items-center gap-2">
                <HiStar className="text-2xl" />
                Cultural Significance
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {siteData.site.significance}
              </p>
            </div>
          )}

          <div className="border-t-2 border-slate-200 pt-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 flex items-center gap-2">
                <HiBookOpen className="text-2xl" />
                Memories & Stories
              </h3>
              {isAuthenticated && (
                <button
                  onClick={() => setShowMemoryForm(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <HiPlus className="text-lg" />
                  Add Memory
                </button>
              )}
            </div>

            {siteData.memories.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 text-center border-2 border-slate-200">
                <HiPencil className="text-6xl mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 text-lg font-medium">
                  No memories shared yet. Be the first to share your story!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {siteData.memories.map((memory) => (
                  <div
                    key={memory._id}
                    className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl overflow-hidden border-2 border-slate-200 hover:shadow-lg transition-all duration-300 animate-fadeIn"
                  >
                    {memory.imageUrl && (
                      <div className="w-full">
                        <img
                          src={memory.imageUrl}
                          alt={memory.title || "Memory"}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {memory.title && (
                        <h4 className="font-bold text-gray-800 mb-2 text-lg flex items-center gap-2">
                          <HiPencil className="text-lg" />
                          {memory.title}
                        </h4>
                      )}
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {memory.story}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-600 pt-3 border-t border-slate-200">
                        <span className="flex items-center gap-1">
                          <HiUser className="text-base" />
                          <strong>{memory.user.username}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <HiCalendar className="text-base" />
                          {new Date(memory.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showMemoryForm && (
        <MemoryForm
          siteId={site._id}
          onClose={() => setShowMemoryForm(false)}
          onSuccess={handleMemorySuccess}
        />
      )}
    </div>
  );
};

export default SiteDetails;

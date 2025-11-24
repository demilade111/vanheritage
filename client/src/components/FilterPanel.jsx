import React, { useState, useEffect } from "react";
import { heritageSiteAPI } from "../services/api";
import {
  HiSearch,
  HiLocationMarker,
  HiCalendar,
  HiCheckCircle,
  HiRefresh,
} from "react-icons/hi";

const FilterPanel = ({ onFilterChange }) => {
  const [neighbourhoods, setNeighbourhoods] = useState([]);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const curatedNeighbourhoods = ["Gastown", "Mount Pleasant", "Strathcona"];
  const curatedYears = ["1890", "1910", "1930"];

  useEffect(() => {
    loadNeighbourhoods();
  }, []);

  const loadNeighbourhoods = async () => {
    try {
      const response = await heritageSiteAPI.getNeighbourhoods();
      setNeighbourhoods(response.data.data);
    } catch (error) {
      // Silently fail when server is offline - set empty array
      setNeighbourhoods([]);
    }
  };

  const emitFilters = (
    neighbourhoodValue = selectedNeighbourhood,
    yearValue = yearBuilt
  ) => {
    const filters = { withImages: "true" };
    if (neighbourhoodValue) filters.neighbourhood = neighbourhoodValue;
    if (yearValue) filters.yearBuilt = yearValue;
    onFilterChange(filters);
  };

  const handleApplyFilters = () => {
    emitFilters();
  };

  const handleClearFilters = () => {
    setSelectedNeighbourhood("");
    setYearBuilt("");
    emitFilters("", "");
  };

  const handleNeighbourhoodChip = (value) => {
    const nextValue = value === selectedNeighbourhood ? "" : value;
    setSelectedNeighbourhood(nextValue);
    emitFilters(nextValue, yearBuilt);
  };

  const handleYearChip = (value) => {
    const nextValue = value === yearBuilt ? "" : value;
    setYearBuilt(nextValue);
    emitFilters(selectedNeighbourhood, nextValue);
  };

  return (
    <div className="glass shadow-2xl rounded-3xl p-6 mb-4 animate-fadeIn border border-white/60 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 flex items-center gap-2">
          <HiSearch className="text-2xl" /> Refine the atlas
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Spotlight imagery-rich records across neighbourhoods and decades.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <HiLocationMarker className="text-lg" /> Neighbourhood
          </label>
          <select
            value={selectedNeighbourhood}
            onChange={(e) => {
              setSelectedNeighbourhood(e.target.value);
              emitFilters(e.target.value, yearBuilt);
            }}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium"
          >
            <option value="">All Neighbourhoods</option>
            {neighbourhoods.map((neighbourhood) => (
              <option key={neighbourhood} value={neighbourhood}>
                {neighbourhood}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-3">
            {curatedNeighbourhoods.map((hood) => (
              <button
                key={hood}
                type="button"
                onClick={() => handleNeighbourhoodChip(hood)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${selectedNeighbourhood === hood
                    ? "bg-teal-600 text-white"
                    : "bg-teal-50 text-teal-700 border border-teal-200"
                  }`}
              >
                {hood}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <HiCalendar className="text-lg" /> Year Built
          </label>
          <input
            type="number"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            placeholder="e.g., 1920"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {curatedYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => handleYearChip(year)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${yearBuilt === year
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
              >
                {year}s
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <HiCheckCircle /> Apply
          </button>
          <button
            onClick={handleClearFilters}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 border-2 border-gray-300 flex items-center justify-center gap-2"
          >
            <HiRefresh /> Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

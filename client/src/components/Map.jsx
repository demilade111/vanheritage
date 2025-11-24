import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { GiGreekTemple } from "react-icons/gi";
import { HiLocationMarker, HiGlobe, HiSparkles } from "react-icons/hi";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = ({ sites, onSiteSelect }) => {
  const [center, setCenter] = useState([49.2827, -123.1207]);

  useEffect(() => {
    if (sites && sites.length > 0) {
      const validSites = sites.filter(
        (site) => site.latitude && site.longitude
      );
      if (validSites.length > 0) {
        const avgLat =
          validSites.reduce((sum, site) => sum + site.latitude, 0) /
          validSites.length;
        const avgLng =
          validSites.reduce((sum, site) => sum + site.longitude, 0) /
          validSites.length;
        setCenter([avgLat, avgLng]);
      }
    }
  }, [sites]);

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sites
        .filter((site) => site.latitude && site.longitude)
        .map((site) => (
          <Marker
            key={site._id}
            position={[site.latitude, site.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="text-sm p-2">
                <h3 className="font-bold text-teal-700 mb-2 flex items-center gap-2">
                  <GiGreekTemple className="text-lg" />
                  {site.name}
                </h3>
                <p className="text-gray-700 mb-1 flex items-center gap-1">
                  <HiLocationMarker className="text-base" />
                  {site.address}
                </p>
                <p className="text-gray-600 text-xs mb-3 flex items-center gap-1">
                  <HiGlobe className="text-base" />
                  {site.neighbourhood}
                </p>
                <button
                  onClick={() => onSiteSelect(site)}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <HiSparkles className="text-base" />
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default Map;

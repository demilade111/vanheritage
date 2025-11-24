import React, { useState, useEffect, useMemo, useRef } from "react";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Layout/Header";
import Map from "./components/Map";
import FilterPanel from "./components/FilterPanel";
import SiteDetails from "./components/SiteDetails";
import { heritageSiteAPI } from "./services/api";
import {
  HiSearch,
  HiX,
  HiSparkles,
  HiAdjustments,
  HiLightningBolt,
} from "react-icons/hi";
import { BiMap } from "react-icons/bi";

const AmbientBackdrop = () => (
  <div className="app-backdrop" aria-hidden="true">
    <div className="backdrop-grid" />
    <div className="blur-orb orb-one" />
    <div className="blur-orb orb-two" />
  </div>
);

const InsightsHero = ({ stats, onToggleFilters, onInspire, hasSites }) => {
  const highlightCards = [
    {
      label: "Heritage Sites",
      value: stats.totalSites || "—",
      caption: "Curated entries with imagery",
    },
    {
      label: "Neighbourhoods",
      value: stats.neighbourhoods || "—",
      caption: "Distinct pockets of culture",
    },
    {
      label: "Site Categories",
      value: stats.categories || "—",
      caption: "Architectural expressions",
    },
    {
      label: "Oldest Record",
      value: stats.earliestYear || "—",
      caption: "Documented year built",
    },
  ];

  return (
    <section className="hero-card">
      <div className="hero-card__content">
        <p className="hero-card__eyebrow">
          <HiSparkles /> Live heritage atlas
        </p>
        <h2>Rediscover Vancouver’s stories on a luminous canvas.</h2>
        <p>
          Navigate centuries of architecture, folklore, and community care with
          filters tuned to imagery-rich records. Every pin brings forward a
          memory, a building, a kept promise.
        </p>
        <div className="hero-card__actions">
          <button className="btn-primary" onClick={onToggleFilters}>
            <HiAdjustments />
            Refine journey
          </button>
          <button
            className="btn-ghost"
            onClick={onInspire}
            disabled={!hasSites}
          >
            <HiLightningBolt />
            Inspire me
          </button>
        </div>
      </div>
      <div className="hero-card__stats">
        {highlightCards.map((card) => (
          <div key={card.label} className="hero-card__stat">
            <span>{card.label}</span>
            <p>{card.value}</p>
            <small>{card.caption}</small>
          </div>
        ))}
      </div>
    </section>
  );
};

const App = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(null);
  const [filters, setFilters] = useState({ withImages: "true" });
  const [showFilters, setShowFilters] = useState(false);
  const filterPanelRef = useRef(null);

  useEffect(() => {
    loadSites();
  }, [filters]);

  const loadSites = async () => {
    try {
      setLoading(true);
      const response = await heritageSiteAPI.getAll(filters);
      setSites(response.data.data);
    } catch (error) {
      // Silently fail when server is offline - set empty array
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const neighbourhoods = new Set();
    const categories = new Set();
    let earliestYear = Number.POSITIVE_INFINITY;

    sites.forEach((site) => {
      if (site?.neighbourhood) neighbourhoods.add(site.neighbourhood);
      if (site?.category) categories.add(site.category);
      const numericYear = parseInt(site?.year_built || site?.yearBuilt, 10);
      if (!Number.isNaN(numericYear)) {
        earliestYear = Math.min(earliestYear, numericYear);
      }
    });

    return {
      totalSites: sites.length,
      neighbourhoods: neighbourhoods.size,
      categories: categories.size,
      earliestYear: Number.isFinite(earliestYear) ? earliestYear : null,
    };
  }, [sites]);

  const activeFilterBadges = useMemo(() => {
    const badges = [];
    badges.push("Images only");
    if (filters.neighbourhood) {
      badges.push(`Neighbourhood · ${filters.neighbourhood}`);
    }
    if (filters.yearBuilt) {
      badges.push(`Year · ${filters.yearBuilt}`);
    }
    return badges;
  }, [filters]);

  const handleRevealFilters = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      filterPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    setShowFilters(true);
  };

  const handleInspireMe = () => {
    if (!sites.length) return;
    const randomSite = sites[Math.floor(Math.random() * sites.length)];
    setSelectedSite(randomSite);
  };

  const handleFilterShellClick = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) return;
    setShowFilters(false);
  };

  return (
    <AuthProvider>
      <div className="app-shell">
        <AmbientBackdrop />
        <div className="app-shell__inner">
          <Header />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="filter-toggle-btn lg:hidden"
          >
            {showFilters ? (
              <HiX className="text-2xl" />
            ) : (
              <HiSearch className="text-2xl" />
            )}
          </button>

          <main className="app-main">
            <InsightsHero
              stats={stats}
              onToggleFilters={handleRevealFilters}
              onInspire={handleInspireMe}
              hasSites={!!sites.length}
            />

            <div className="workspace-grid">
              <div className="lg:w-80 shrink-0">
                <div
                  className={`filter-shell ${showFilters ? "filter-shell--open" : "filter-shell--closed"
                    }`}
                  onClick={handleFilterShellClick}
                >
                  <div
                    ref={filterPanelRef}
                    className="filter-shell__panel"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FilterPanel onFilterChange={setFilters} />
                    <div className="insight-highlight">
                      <p className="insight-highlight__value">
                        {stats.totalSites || "—"}
                      </p>
                      <p className="insight-highlight__label">
                        sites currently visualized
                      </p>
                      <div className="insight-highlight__meta">
                        <span>{stats.neighbourhoods || 0} neighbourhoods</span>
                        <span>{stats.categories || 0} categories</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="map-shell">
                <div className="map-chip-group">
                  {activeFilterBadges.map((badge) => (
                    <span key={badge} className="badge-chip">
                      {badge}
                    </span>
                  ))}
                </div>

                {loading ? (
                  <div className="map-loading">
                    <div className="map-loading__spinner" />
                    <p>
                      <BiMap /> Mapping Vancouver’s heritage…
                    </p>
                    <small>Pulling live data from the registry</small>
                  </div>
                ) : (
                  <Map sites={sites} onSiteSelect={setSelectedSite} />
                )}

                <div className="map-watermark">
                  <BiMap />
                  <div>
                    Live map canvas
                    <span>Leaflet · OpenStreetMap layers</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {selectedSite && (
        <SiteDetails
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
          onMemoryAdded={loadSites}
        />
      )}
    </AuthProvider>
  );
};

export default App;

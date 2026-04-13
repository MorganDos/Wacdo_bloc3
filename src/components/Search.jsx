import { useState } from "react";
import axios from "axios";

// API utilisée pour rechercher des villes et des restaurants.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// Cherche une ville puis cherche les restaurants à proximité pour les afficher sur la carte.

// transforme la réponse de l'API en objet ville.
const toCityOption = (city) => {
  const label = city.display_name ?? city.name ?? "Ville inconnue";

  return {
    id: city.place_id,
    label,
    name: city.name ?? label.split(",")[0],
    lat: Number.parseFloat(city.lat),
    lon: Number.parseFloat(city.lon),
    boundingbox: city.boundingbox ?? null,
  };
};

// Transforme la réponse de l'API en objet restaurant exploitable pour les markers.
const toRestaurant = (item) => {
  const firstPart = item.display_name?.split(",")[0] ?? "Restaurant";
  return {
    id: item.place_id,
    name: item.name ?? firstPart,
    address: item.display_name ?? "Adresse indisponible",
    lat: Number.parseFloat(item.lat),
    lon: Number.parseFloat(item.lon),
  };
};

// Crée une vue de la zone de recherche autour de la ville.
const buildViewbox = (boundingbox) => {
  if (!boundingbox || boundingbox.length !== 4) {
    return undefined;
  }

  const south = Number.parseFloat(boundingbox[0]);
  const north = Number.parseFloat(boundingbox[1]);
  const west = Number.parseFloat(boundingbox[2]);
  const east = Number.parseFloat(boundingbox[3]);

  if ([south, north, west, east].some(Number.isNaN)) {
    return undefined;
  }

  return `${west},${north},${east},${south}`;
};

const SearchComponent = ({ onCitySelected, onRestaurantsLoaded }) => {
  const [query, setQuery] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [error, setError] = useState("");

  // Recherche les villes correspondant à la saisie de l'utilisateur.
  const handleCitySearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setCityOptions([]);
      setError("Entrez une ville avant la recherche.");
      return;
    }

    setLoadingCities(true);
    setCityOptions([]);
    setError("");

    try {
      const { data } = await axios.get(NOMINATIM_URL, {
        params: {
          q: trimmedQuery,
          format: "jsonv2",
          limit: 5,
          addressdetails: 1,
          featuretype: "city",
        },
      });

      if (!Array.isArray(data) || data.length === 0) {
        setCityOptions([]);
        setError("Aucune ville trouvée.");
        return;
      }

      setCityOptions(data.map(toCityOption));
    } catch (requestError) {
      setCityOptions([]);
      setError("Erreur lors de la recherche de ville.");
      console.error(requestError);
    } finally {
      setLoadingCities(false);
    }
  };

  // Quand une ville est choisie on recentre la carte puis les restaurants.
  const handleCityPick = async (city) => {
    onCitySelected(city);
    setQuery(city.name);
    setCityOptions([]);
    setError("");
    setLoadingRestaurants(true);

    try {
      const viewbox = buildViewbox(city.boundingbox);
      const params = {
        q: `McDonald's ${city.name}`,
        format: "jsonv2",
        limit: 25,
        addressdetails: 1,
      };

      if (viewbox) {
        params.viewbox = viewbox;
        params.bounded = 1;
      }

      const { data } = await axios.get(NOMINATIM_URL, { params });
      const restaurants = (Array.isArray(data) ? data : [])
        .map(toRestaurant)
        .filter((restaurant) => !Number.isNaN(restaurant.lat) && !Number.isNaN(restaurant.lon));

      onRestaurantsLoaded(restaurants);
      if (restaurants.length === 0) {
        setError("Aucun McDonald's trouvé pour cette ville.");
      }
    } catch (requestError) {
      onRestaurantsLoaded([]);
      setError("Erreur lors de la recherche des restaurants.");
      console.error(requestError);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  return (
    <section className="search-box">
      <div className="search-row">
        <label htmlFor="city-search" className="sr-only">
          Rechercher une ville
        </label>
        <input
          id="city-search"
          type="text"
          placeholder="Rechercher une ville"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="button" onClick={handleCitySearch} disabled={loadingCities}>
          {loadingCities ? "..." : "Rechercher"}
        </button>
      </div>

      {cityOptions.length > 0 && (
        <ul className="city-list" role="listbox" aria-label="Villes trouvées">
          {cityOptions.map((city) => (
            <li key={city.id}>
              <button type="button" onClick={() => handleCityPick(city)} className="city-option">
                {city.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {loadingRestaurants && <p className="search-feedback">Chargement des restaurants...</p>}
      {error && <p className="search-feedback error">{error}</p>}
    </section>
  );
};

export default SearchComponent;

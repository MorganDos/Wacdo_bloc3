import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "./App.css";
import MapComponent from "./components/Map";
import SearchComponent from "./components/Search";

// Point de départ de la carte.
const DEFAULT_CENTER = [45.764, 4.8357];

function App() {
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Indique si l'overlay doit afficher un restaurant ou l'état vide.
  const hasSelectedRestaurant = Boolean(selectedRestaurant);

  // Met à jour l'état global quand l'utilisateur choisit une ville.
  const handleCitySelected = (city) => {
    setSelectedRestaurant(null);
    setRestaurants([]);
    setMapCenter([city.lat, city.lon]);
  };

  // Stocke les restaurants récupérés après la recherche.
  const handleRestaurantsLoaded = (nextRestaurants) => {
    setRestaurants(nextRestaurants);
  };

  // Stocke le restaurant sélectionné pour l'afficher dans l'overlay.
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <main className="app">
      <h1 className="sr-only">Choix du restaurant</h1>

      <div className="map-layout">
        <MapComponent
          center={mapCenter}
          restaurants={restaurants}
          onRestaurantSelect={handleRestaurantSelect}
        />

        <SearchComponent
          onCitySelected={handleCitySelected}
          onRestaurantsLoaded={handleRestaurantsLoaded}
        />

        <section className="selection-overlay" aria-live="polite" data-testid="selection-overlay">
          {hasSelectedRestaurant ? (
            <>
              <p className="selection-heading">Restaurant sélectionné</p>
              <p className="selection-title">{selectedRestaurant.name}</p>
              <p className="selection-address">{selectedRestaurant.address}</p>
              <button type="button" className="continue-btn">
                Continuer
              </button>
            </>
          ) : (
            <p className="selection-empty">Aucun restaurant sélectionné</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;

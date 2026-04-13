import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Icon } from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

const DEFAULT_ZOOM = 13;

// Icône leaflet des markers.
const marker = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Recentre la carte quand la ville choisie change.
const MapViewUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, DEFAULT_ZOOM);
  }, [center, map]);

  return null;
};

// Affiche la carte et un marker pour chaque restaurant trouvé.
const MapComponent = ({ center, restaurants, onRestaurantSelect }) => {
  return (
    <MapContainer center={center} zoom={DEFAULT_ZOOM} className="map">
      <MapViewUpdater center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {restaurants.map((restaurant) => (
        <Marker key={restaurant.id} position={[restaurant.lat, restaurant.lon]} icon={marker}>
          <Popup>
            <p className="popup-title">{restaurant.name}</p>
            <p className="popup-address">{restaurant.address}</p>
            <button type="button" className="popup-btn" onClick={() => onRestaurantSelect(restaurant)}>
              Sélectionner
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;

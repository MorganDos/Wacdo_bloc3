import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children }) => <div data-testid="map-marker">{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  useMap: () => ({
    setView: vi.fn(),
  }),
}));

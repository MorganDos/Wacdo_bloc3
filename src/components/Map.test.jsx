import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import MapComponent from "./Map";

describe("MapComponent", () => {
  it("renders restaurant popup content and select button", async () => {
    const onRestaurantSelect = vi.fn();
    render(
      <MapComponent
        center={[45.44, 4.39]}
        onRestaurantSelect={onRestaurantSelect}
        restaurants={[
          {
            id: 1,
            name: "McDonald's Chateaucreux",
            address: "1 Rue de la Gare, Saint-Etienne",
            lat: 45.44,
            lon: 4.39,
          },
        ]}
      />,
    );

    expect(screen.getByText("McDonald's Chateaucreux")).toBeInTheDocument();
    expect(screen.getByText("1 Rue de la Gare, Saint-Etienne")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Sélectionner" }));
    expect(onRestaurantSelect).toHaveBeenCalledWith({
      id: 1,
      name: "McDonald's Chateaucreux",
      address: "1 Rue de la Gare, Saint-Etienne",
      lat: 45.44,
      lon: 4.39,
    });
  });
});

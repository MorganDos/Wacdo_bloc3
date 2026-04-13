import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { vi } from "vitest";
import SearchComponent from "./Search";

vi.mock("axios");

describe("SearchComponent", () => {
  it("shows city options after a city search", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          place_id: 1,
          display_name: "Saint-Etienne, Loire, France",
          name: "Saint-Etienne",
          lat: "45.4397",
          lon: "4.3872",
          boundingbox: ["45.39", "45.48", "4.33", "4.46"],
        },
      ],
    });

    render(<SearchComponent onCitySelected={vi.fn()} onRestaurantsLoaded={vi.fn()} />);
    await userEvent.type(screen.getByPlaceholderText("Rechercher une ville"), "Saint etienne");
    await userEvent.click(screen.getByRole("button", { name: "Rechercher" }));

    expect(await screen.findByRole("button", { name: /Saint-Etienne/i })).toBeInTheDocument();
  });

  it("loads restaurants when a city is picked", async () => {
    const onCitySelected = vi.fn();
    const onRestaurantsLoaded = vi.fn();

    axios.get
      .mockResolvedValueOnce({
        data: [
          {
            place_id: 1,
            display_name: "Saint-Etienne, Loire, France",
            name: "Saint-Etienne",
            lat: "45.4397",
            lon: "4.3872",
            boundingbox: ["45.39", "45.48", "4.33", "4.46"],
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            place_id: 10,
            display_name: "McDonald's, 10 Rue Test, Saint-Etienne, France",
            lat: "45.44",
            lon: "4.39",
          },
        ],
      });

    render(<SearchComponent onCitySelected={onCitySelected} onRestaurantsLoaded={onRestaurantsLoaded} />);
    await userEvent.type(screen.getByPlaceholderText("Rechercher une ville"), "Saint etienne");
    await userEvent.click(screen.getByRole("button", { name: "Rechercher" }));
    await userEvent.click(await screen.findByRole("button", { name: /Saint-Etienne/i }));

    await waitFor(() => expect(onCitySelected).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onRestaurantsLoaded).toHaveBeenCalledTimes(1));
    expect(onRestaurantsLoaded.mock.calls[0][0]).toEqual([
      {
        id: 10,
        name: "McDonald's",
        address: "McDonald's, 10 Rue Test, Saint-Etienne, France",
        lat: 45.44,
        lon: 4.39,
      },
    ]);
  });
});

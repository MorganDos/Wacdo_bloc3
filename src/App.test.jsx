import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { vi } from "vitest";
import App from "./App";

vi.mock("axios");

describe("App", () => {
  it("updates selection overlay after picking a city and selecting a restaurant", async () => {
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

    render(<App />);

    expect(screen.getAllByText("Aucun restaurant sélectionné").length).toBeGreaterThan(0);

    await userEvent.type(screen.getByPlaceholderText("Rechercher une ville"), "Saint etienne");
    await userEvent.click(screen.getByRole("button", { name: "Rechercher" }));
    await userEvent.click(await screen.findByRole("button", { name: /Saint-Etienne/i }));
    await userEvent.click(await screen.findByRole("button", { name: "Sélectionner" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Continuer" })).toBeInTheDocument(),
    );
    const overlay = screen.getByTestId("selection-overlay");
    expect(within(overlay).getByText("McDonald's")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import App from "./App";
import data from "./data.json";

describe("Star Wars APP", () => {
  beforeAll(() => jest.spyOn(window, "fetch"));

  it("deve mostrar los personajes desde la API", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });

    render(<App />);
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(window.fetch).toHaveBeenCalledWith("https://swapi.dev/api/people/");
    for (const character of data.results) {
      expect(await screen.findByText(character.name)).toBeInTheDocument();
    }
  });

  it("deve mostrar un error al haber problema de coneccion", async () => {
    window.fetch.mockRejectedValueOnce(new Error("Error al conectar"));

    render(<App />);
    expect(await screen.findByText("Error al conectar")).toBeInTheDocument();
  });
});

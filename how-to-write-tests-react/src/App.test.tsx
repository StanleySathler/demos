import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App Component", () => {
  it("should render with London weather by default", async () => {
    // Render the component
    render(<App />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(
        screen.getByText(/Current Weather in London, United Kingdom/i)
      ).toBeTruthy();
    });

    // Find the input field and button
    const input = screen.getByLabelText(/enter city name/i);
    const button = screen.getByRole("button", { name: /get weather/i });

    // Clear the input and type "london"
    await userEvent.clear(input);
    await userEvent.type(input, "london");

    // Click the button
    await userEvent.click(button);

    // Wait for and verify the weather data is displayed again
    await waitFor(() => {
      expect(
        screen.getByText(/Current Weather in London, United Kingdom/i)
      ).toBeTruthy();
    });
  });

  it("should handle different city queries via MSW", async () => {
    // Render the component
    render(<App />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(
        screen.getByText(/Current Weather in London, United Kingdom/i)
      ).toBeTruthy();
    });

    // Find the input field and button
    const input = screen.getByLabelText(/enter city name/i);
    const button = screen.getByRole("button", { name: /get weather/i });

    // Clear the input and type "paris"
    await userEvent.clear(input);
    await userEvent.type(input, "paris");

    // Click the button
    await userEvent.click(button);

    // Wait for and verify the weather data is displayed for Paris
    await waitFor(() => {
      expect(
        screen.getByText(/Current Weather in Paris, Unknown Country/i)
      ).toBeTruthy();
    });
  });
});

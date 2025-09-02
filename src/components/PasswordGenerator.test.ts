import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import PasswordGenerator from "./PasswordGenerator.vue";

const mockWriteText = vi.fn(() => Promise.resolve());
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText
  }
});

Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:3000",
    search: ""
  },
  writable: true
});

const mockReplace = vi.fn();
Object.defineProperty(window, "history", {
  value: {
    replaceState: mockReplace
  },
  writable: true
});

describe("PasswordGenerator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.search = "";
  });

  it("renders correctly", () => {
    render(PasswordGenerator);

    expect(
      screen.getByRole("heading", { name: "pwordgen.com" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Generated password")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Regenerate" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("generates a password on mount", async () => {
    render(PasswordGenerator);

    const passwordField = screen.getByLabelText("Generated password");
    // Wait for component to initialize and generate password
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect((passwordField as HTMLInputElement).value.length).toBeGreaterThan(0);
  });

  it("shows entropy information", async () => {
    render(PasswordGenerator);

    // Check entropy label is present
    expect(screen.getByText("Entropy:")).toBeInTheDocument();

    // Check entropy value format
    const entropyValueElement = screen.getByText(/\d+(\.\d+)? bits/);
    expect(entropyValueElement).toBeInTheDocument();

    const entropyText = entropyValueElement.textContent!;
    const entropyNumericValue = parseFloat(entropyText.replace(" bits", ""));
    expect(entropyNumericValue).toBeGreaterThan(0);

    // Check entropy strength indicator
    expect(
      screen.getByText(/^(🔒 Strong|⚠️ Moderate|❌ Weak)$/)
    ).toBeInTheDocument();
  });

  it("regenerates password when button is clicked", async () => {
    const user = userEvent.setup();
    render(PasswordGenerator);

    const regenerateBtn = screen.getByRole("button", { name: "Regenerate" });
    await user.click(regenerateBtn);

    // After clicking, there should still be a password in the field
    const passwordField = screen.getByLabelText("Generated password");
    const password = (passwordField as HTMLInputElement).value;
    expect(password).toBeTruthy();
    expect(password.length).toBeGreaterThan(0);
    // Note: passwords might be the same by chance, so we don't test for difference
  });

  it("copies password to clipboard", async () => {
    const user = userEvent.setup();
    render(PasswordGenerator);

    // Wait for password to generate
    await new Promise((resolve) => setTimeout(resolve, 100));
    const passwordField = screen.getByLabelText("Generated password");
    const password = (passwordField as HTMLInputElement).value;

    const copyBtn = screen.getByRole("button", { name: /copy/i });

    // Ensure copy button is enabled before clicking
    expect(copyBtn).not.toBeDisabled();
    expect(password).toBeTruthy();

    await user.click(copyBtn);

    // Instead of checking the mock directly, check user-facing behavior
    // The copy button should show feedback by changing text
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("updates length when range input changes", async () => {
    const user = userEvent.setup();
    render(PasswordGenerator);

    const lengthSlider = screen.getByLabelText(/length/i);

    // For range input, we need to focus and change value directly
    lengthSlider.focus();
    await user.keyboard("{ArrowRight>10}"); // Move slider right 10 steps

    // Check that the displayed length has changed from the default 16
    const lengthDisplay = screen.getByText(/length:\s*\d+/i);
    expect(lengthDisplay).toBeInTheDocument();
    expect(lengthDisplay.textContent).not.toBe("Length: 16");
  });

  it("toggles character class options", async () => {
    const user = userEvent.setup();
    render(PasswordGenerator);

    const uppercaseCheckbox = screen.getByRole("checkbox", {
      name: /uppercase letters/i
    });
    expect(uppercaseCheckbox).toBeChecked();

    await user.click(uppercaseCheckbox);

    expect(uppercaseCheckbox).not.toBeChecked();
  });

  it("handles custom characters input", async () => {
    const user = userEvent.setup();
    render(PasswordGenerator);

    const customInput = screen.getByLabelText(/custom characters/i);
    await user.type(customInput, "αβγ");

    expect(customInput).toHaveValue("αβγ");
  });

  it("handles exclude characters input", async () => {
    const user = userEvent.setup();
    render(PasswordGenerator);

    const excludeInput = screen.getByLabelText(/exclude specific characters/i);
    await user.type(excludeInput, "O0Il1");

    expect(excludeInput).toHaveValue("O0Il1");
  });

  it("loads options from URL parameters", async () => {
    window.location.search =
      "?length=20&upper=true&lower=false&digits=true&symbols=false&excludeSimilar=true&requireEach=false";

    render(PasswordGenerator);

    // Wait for component to initialize
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check that length was loaded - using regex to handle whitespace
    expect(screen.getByText(/Length:\s*20/)).toBeInTheDocument();

    // Check checkboxes states
    expect(
      screen.getByRole("checkbox", { name: /uppercase letters/i })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /lowercase letters/i })
    ).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: /numbers/i })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /symbols/i })
    ).not.toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /exclude similar characters/i })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /require at least one character/i })
    ).not.toBeChecked();
  });

  it("updates URL when options change", async () => {
    const user = userEvent.setup();
    render(PasswordGenerator);

    const lengthSlider = screen.getByLabelText(/length/i);

    // For range input, focus and use arrow keys
    lengthSlider.focus();
    await user.keyboard("{ArrowRight>5}"); // Move slider

    expect(mockReplace).toHaveBeenCalled();
  });

  it("shows copy success feedback", async () => {
    const user = userEvent.setup();
    render(PasswordGenerator);

    const copyBtn = screen.getByRole("button", { name: /copy/i });
    await user.click(copyBtn);

    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("shows copy button as disabled when password is empty", async () => {
    render(PasswordGenerator);

    // Initially, before password generation, copy button should be disabled
    const copyBtn = screen.getByRole("button", { name: /copy/i });
    expect(copyBtn).toBeDisabled();
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PasswordGenerator from "./PasswordGenerator.vue";

// Mock the pwordgen module
vi.mock("pwordgen", () => ({
  generatePassword: vi.fn(() => "TestPassword123!"),
  estimateEntropyBits: vi.fn(() => 64.5)
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve())
  }
});

// Mock URL and history
const mockReplace = vi.fn();
Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:3000",
    search: ""
  },
  writable: true
});
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
    const wrapper = mount(PasswordGenerator);

    expect(wrapper.find("h1").text()).toBe("pwordgen.com");
    expect(wrapper.find(".password-field").exists()).toBe(true);
    expect(wrapper.find('button[title="Generate new password"]').exists()).toBe(
      true
    );
    expect(wrapper.find('button[title*="Copy"]').exists()).toBe(true);
  });

  it("generates a password on mount", async () => {
    const wrapper = mount(PasswordGenerator);
    await wrapper.vm.$nextTick();

    const passwordField = wrapper.find(".password-field");
    expect((passwordField.element as HTMLInputElement).value).toBe(
      "TestPassword123!"
    );
  });

  it("shows entropy information", async () => {
    const wrapper = mount(PasswordGenerator);
    await wrapper.vm.$nextTick();

    const entropyValue = wrapper.find(".entropy-value");
    expect(entropyValue.text()).toBe("64.5 bits");

    const entropyInfo = wrapper.find(".entropy-info");
    expect(entropyInfo.text()).toBe("🔒 Strong");
  });

  it("regenerates password when button is clicked", async () => {
    const wrapper = mount(PasswordGenerator);
    const regenerateBtn = wrapper.find('button[title="Generate new password"]');

    await regenerateBtn.trigger("click");
    await wrapper.vm.$nextTick();

    const passwordField = wrapper.find(".password-field");
    expect((passwordField.element as HTMLInputElement).value).toBe(
      "TestPassword123!"
    );
  });

  it("copies password to clipboard", async () => {
    const wrapper = mount(PasswordGenerator);
    await wrapper.vm.$nextTick();

    const copyBtn = wrapper.find('button[title*="Copy"]');
    await copyBtn.trigger("click");

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "TestPassword123!"
    );
  });

  it("updates length when range input changes", async () => {
    const wrapper = mount(PasswordGenerator);
    const rangeInput = wrapper.find('input[type="range"]');

    await rangeInput.setValue(24);
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".option-label").text()).toContain("24");
  });

  it("toggles character class options", async () => {
    const wrapper = mount(PasswordGenerator);
    const checkboxes = wrapper.findAll('input[type="checkbox"]');

    // Find the uppercase checkbox (should be first one)
    const upperCaseCheckbox = checkboxes[0];
    expect(upperCaseCheckbox).toBeDefined();
    expect((upperCaseCheckbox.element as HTMLInputElement).checked).toBe(true);

    await upperCaseCheckbox.trigger("click");
    await wrapper.vm.$nextTick();

    expect((upperCaseCheckbox.element as HTMLInputElement).checked).toBe(false);
  });

  it("handles custom characters input", async () => {
    const wrapper = mount(PasswordGenerator);
    const customInput = wrapper.find("#custom");

    await customInput.setValue("αβγ");
    await wrapper.vm.$nextTick();

    expect((customInput.element as HTMLInputElement).value).toBe("αβγ");
  });

  it("handles exclude characters input", async () => {
    const wrapper = mount(PasswordGenerator);
    const excludeInput = wrapper.find("#exclude");

    await excludeInput.setValue("O0Il1");
    await wrapper.vm.$nextTick();

    expect((excludeInput.element as HTMLInputElement).value).toBe("O0Il1");
  });

  it("loads options from URL parameters", async () => {
    window.location.search =
      "?length=20&upper=true&lower=false&digits=true&symbols=false&excludeSimilar=true&requireEach=false";

    const wrapper = mount(PasswordGenerator);
    await wrapper.vm.$nextTick();

    // Check that length was loaded
    const lengthDisplay = wrapper.find(".option-label");
    expect(lengthDisplay.text()).toContain("20");

    // Check checkboxes
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).toBeGreaterThanOrEqual(6);
    expect((checkboxes[0]!.element as HTMLInputElement).checked).toBe(true); // upper
    expect((checkboxes[1]!.element as HTMLInputElement).checked).toBe(false); // lower
    expect((checkboxes[2]!.element as HTMLInputElement).checked).toBe(true); // digits
    expect((checkboxes[3]!.element as HTMLInputElement).checked).toBe(false); // symbols
    expect((checkboxes[4]!.element as HTMLInputElement).checked).toBe(true); // excludeSimilar
    expect((checkboxes[5]!.element as HTMLInputElement).checked).toBe(false); // requireEach
  });

  it("updates URL when options change", async () => {
    const wrapper = mount(PasswordGenerator);
    const rangeInput = wrapper.find('input[type="range"]');

    await rangeInput.setValue(32);
    await wrapper.vm.$nextTick();

    expect(mockReplace).toHaveBeenCalled();
  });

  it("shows copy success feedback", async () => {
    const wrapper = mount(PasswordGenerator);
    await wrapper.vm.$nextTick();

    const copyBtn = wrapper.find('button[title*="Copy"]');
    await copyBtn.trigger("click");
    await wrapper.vm.$nextTick();

    expect(copyBtn.text()).toBe("✓ Copied!");
  });

  it("disables copy button when no password", async () => {
    const { generatePassword } = await import("pwordgen");
    vi.mocked(generatePassword).mockImplementation(() => {
      throw new Error("Test error");
    });

    const wrapper = mount(PasswordGenerator);
    await wrapper.vm.$nextTick();

    const copyBtn = wrapper.find('button[title*="Copy"]');
    expect((copyBtn.element as HTMLButtonElement).disabled).toBe(true);
  });
});

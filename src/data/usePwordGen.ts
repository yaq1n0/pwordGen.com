import { ref, computed, watch, onMounted } from "vue";
import { generatePassword, estimateEntropyBits } from "pwordgen";
import { type PasswordOptions, defaultOptions } from "./types";

export function usePwordGen() {
  // Reactive state
  const options = ref<PasswordOptions>(defaultOptions);
  const password = ref("");
  const error = ref("");
  const copySuccess = ref(false);

  // Convert our options to pwordgen format
  const pwordgenOptions = computed(() => {
    const classes = [];
    if (options.value.includeUpper) classes.push("upper");
    if (options.value.includeLower) classes.push("lower");
    if (options.value.includeDigits) classes.push("digits");
    if (options.value.includeSymbols) classes.push("symbols");
    if (options.value.customChars) classes.push("custom");

    return {
      length: options.value.length,
      classes,
      customChars: options.value.customChars || undefined,
      excludeSimilar: options.value.excludeSimilar,
      exclude: options.value.exclude || undefined,
      requireEachSelectedClass: options.value.requireEachSelectedClass
    };
  });

  // Calculate entropy
  const entropy = computed(() => {
    try {
      return estimateEntropyBits(pwordgenOptions.value);
    } catch {
      return 0;
    }
  });

  const entropyDescription = computed(() => {
    if (entropy.value >= 60) return "🔒 Strong";
    if (entropy.value >= 40) return "⚠️ Moderate";
    return "❌ Weak";
  });

  // Generate a new password
  const generateNewPassword = () => {
    try {
      error.value = "";
      password.value = generatePassword(pwordgenOptions.value);
      updateURL();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to generate password";
      password.value = "";
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password.value);
      copySuccess.value = true;
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  // URL parameter persistence
  const updateURL = () => {
    const params = new URLSearchParams();
    params.set("length", options.value.length.toString());
    params.set("upper", options.value.includeUpper.toString());
    params.set("lower", options.value.includeLower.toString());
    params.set("digits", options.value.includeDigits.toString());
    params.set("symbols", options.value.includeSymbols.toString());
    if (options.value.customChars)
      params.set("custom", options.value.customChars);
    params.set("excludeSimilar", options.value.excludeSimilar.toString());
    if (options.value.exclude) params.set("exclude", options.value.exclude);
    params.set(
      "requireEach",
      options.value.requireEachSelectedClass.toString()
    );

    const url = new URL(window.location.href);
    url.search = params.toString();
    window.history.replaceState({}, "", url.toString());
  };

  const loadFromURL = () => {
    const params = new URLSearchParams(window.location.search);

    if (params.has("length")) {
      const length = parseInt(params.get("length") || "16");
      if (length >= 1 && length <= 256) {
        options.value.length = length;
      }
    }

    if (params.has("upper"))
      options.value.includeUpper = params.get("upper") === "true";
    if (params.has("lower"))
      options.value.includeLower = params.get("lower") === "true";
    if (params.has("digits"))
      options.value.includeDigits = params.get("digits") === "true";
    if (params.has("symbols"))
      options.value.includeSymbols = params.get("symbols") === "true";
    if (params.has("custom"))
      options.value.customChars = params.get("custom") || "";
    if (params.has("excludeSimilar"))
      options.value.excludeSimilar = params.get("excludeSimilar") === "true";
    if (params.has("exclude"))
      options.value.exclude = params.get("exclude") || "";
    if (params.has("requireEach"))
      options.value.requireEachSelectedClass =
        params.get("requireEach") === "true";
  };

  // Initialize the composable
  const initialize = () => {
    loadFromURL();
    generateNewPassword();
  };

  // Watch for option changes to regenerate password
  watch(() => pwordgenOptions.value, generateNewPassword, { deep: true });

  // Auto-initialize on mount
  onMounted(initialize);

  // Return the public API
  return {
    // State
    options,
    password,
    error,
    copySuccess,

    // Computed
    entropy,
    entropyDescription,

    // Methods
    generateNewPassword,
    copyToClipboard,
    initialize
  };
}

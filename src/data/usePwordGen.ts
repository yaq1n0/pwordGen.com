import { ref, computed, watch, onMounted } from "vue";
import {
  generatePassword,
  estimateEntropyBits,
  defaultOptions,
  type PasswordOptions
} from "pwordgen";
import { useOptionsUrl } from "./useOptionsUrl";

export function usePwordGen() {
  // Reactive state
  const options = ref<PasswordOptions>(defaultOptions);
  const password = ref("");
  const error = ref("");
  const copySuccess = ref(false);

  // URL handling
  const { updateURL, loadFromURL } = useOptionsUrl(options);

  // Calculate entropy
  const entropy = computed(() => {
    try {
      return estimateEntropyBits(options.value);
    } catch {
      return 0;
    }
  });

  const entropyDescription = computed(() => {
    if (entropy.value >= 60) return "🔒 Strong";
    if (entropy.value >= 40) return "⚠️ Moderate";
    return "❌ Weak";
  });

  const generateNewPassword = () => {
    try {
      password.value = generatePassword(options.value);
      error.value = "";
      updateURL();
    } catch (err) {
      password.value = "";
      error.value =
        err instanceof Error ? err.message : "Failed to generate password";
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password.value);
      copySuccess.value = true;
      // timeout the copy success so it returns to default state
      setTimeout(() => {
        copySuccess.value = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const initialize = () => {
    loadFromURL();
    generateNewPassword();
  };

  watch(options, generateNewPassword, { deep: true });

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

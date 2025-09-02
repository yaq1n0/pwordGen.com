import { type Ref } from "vue";
import { defaultOptions, type PasswordOptions } from "pwordgen";

export function useOptionsUrl(options: Ref<PasswordOptions>) {
  // URL parameter persistence
  const updateURL = () => {
    const params = new URLSearchParams();
    const opts = options.value;
    params.set("length", opts.length.toString());
    params.set("uppercase", opts.uppercase.toString());
    params.set("lowercase", opts.lowercase.toString());
    params.set("digits", opts.digits.toString());
    params.set("symbols", opts.symbols.toString());
    if (opts.custom) params.set("custom", opts.custom);
    params.set("excludeSimilar", opts.excludeSimilar.toString());
    if (opts.exclude) params.set("exclude", opts.exclude);
    params.set(
      "requireEachSelectedClass",
      opts.requireEachSelectedClass.toString()
    );

    const url = new URL(window.location.href);
    url.search = params.toString();
    window.history.replaceState({}, "", url.toString());
  };

  const loadFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const newOptions = { ...defaultOptions };

    if (params.has("length")) {
      const length = parseInt(params.get("length") || "16");
      if (length >= 1 && length <= 256) {
        newOptions.length = length;
      }
    }

    // Support both old and new parameter names for backward compatibility
    if (params.has("uppercase") || params.has("upper"))
      newOptions.uppercase =
        (params.get("uppercase") || params.get("upper")) === "true";
    if (params.has("lowercase") || params.has("lower"))
      newOptions.lowercase =
        (params.get("lowercase") || params.get("lower")) === "true";
    if (params.has("digits"))
      newOptions.digits = params.get("digits") === "true";
    if (params.has("symbols"))
      newOptions.symbols = params.get("symbols") === "true";
    if (params.has("custom")) newOptions.custom = params.get("custom") || "";
    if (params.has("excludeSimilar"))
      newOptions.excludeSimilar = params.get("excludeSimilar") === "true";
    if (params.has("exclude")) newOptions.exclude = params.get("exclude") || "";
    if (params.has("requireEachSelectedClass") || params.has("requireEach"))
      newOptions.requireEachSelectedClass =
        (params.get("requireEachSelectedClass") ||
          params.get("requireEach")) === "true";

    options.value = newOptions;
  };

  return {
    updateURL,
    loadFromURL
  };
}

import pluginVue from "eslint-plugin-vue";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintConfigPrettier from "eslint-config-prettier";
import * as parserVue from "vue-eslint-parser";
import * as parserTypeScript from "@typescript-eslint/parser";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";

export default [
  ...pluginVue.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript,
        extraFileExtensions: [".vue"],
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript
    },
    rules: {
      ...pluginTypeScript.configs["recommended"].rules,
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/comma-dangle": "off"
    }
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parserTypeScript,
      parserOptions: {
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": pluginTypeScript
    },
    rules: {
      ...pluginTypeScript.configs["recommended"].rules,
      "@typescript-eslint/comma-dangle": "off"
    }
  },
  {
    rules: {
      "@typescript-eslint/comma-dangle": "off",
      "comma-dangle": "off"
    }
  }
];

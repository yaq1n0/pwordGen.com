<template>
  <div class="password-generator">
    <header class="header">
      <h1>pwordgen.com</h1>
      <p>Generate passwords without the BS</p>
    </header>

    <main class="main">
      <section class="password-section">
        <div class="password-display">
          <input
            v-model="password"
            type="text"
            readonly
            class="password-field"
            :class="{ error: !!error }"
            :placeholder="error || 'Generated password will appear here'"
            aria-label="Generated password"
          />
          <div class="password-actions">
            <button
              class="btn btn-primary"
              type="button"
              title="Generate new password"
              @click="generateNewPassword"
            >
              Regenerate
            </button>
            <button
              class="btn btn-secondary"
              type="button"
              :disabled="!password"
              :title="copySuccess ? 'Copied!' : 'Copy to clipboard'"
              @click="copyToClipboard"
            >
              {{ copySuccess ? "Copied" : "Copy" }}
            </button>
          </div>
        </div>

        <div class="entropy-display">
          <span class="entropy-label">Entropy:</span>
          <span class="entropy-value">{{ entropy.toFixed(1) }} bits</span>
          <span class="entropy-info">{{ entropyDescription }}</span>
        </div>
      </section>

      <!-- Options -->
      <section class="options-section">
        <h2>Options</h2>

        <!-- Length -->
        <div class="option-group">
          <label for="length" class="option-label">
            Length: {{ options.length }}
          </label>
          <input
            id="length"
            v-model.number="options.length"
            type="range"
            min="1"
            max="256"
            class="range-input"
          />
          <input
            v-model.number="options.length"
            type="number"
            min="1"
            max="256"
            class="number-input"
          />
        </div>

        <!-- Character Classes -->
        <div class="option-group">
          <h3>Character Types</h3>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="options.uppercase"
                type="checkbox"
                class="checkbox"
              />
              Uppercase Letters (A-Z)
            </label>
            <label class="checkbox-label">
              <input
                v-model="options.lowercase"
                type="checkbox"
                class="checkbox"
              />
              Lowercase Letters (a-z)
            </label>
            <label class="checkbox-label">
              <input
                v-model="options.digits"
                type="checkbox"
                class="checkbox"
              />
              Numbers (0-9)
            </label>
            <label class="checkbox-label">
              <input
                v-model="options.symbols"
                type="checkbox"
                class="checkbox"
              />
              Symbols (!@#$%^&*)
            </label>
          </div>
        </div>

        <!-- Custom Characters -->
        <div class="option-group">
          <label for="custom" class="option-label"> Custom Characters </label>
          <input
            id="custom"
            v-model="options.custom"
            type="text"
            class="text-input"
            placeholder="Additional characters to include"
          />
        </div>

        <!-- Exclusions -->
        <div class="option-group">
          <label class="checkbox-label">
            <input
              v-model="options.excludeSimilar"
              type="checkbox"
              class="checkbox"
            />
            Exclude Similar Characters (0, O, l, I, 1)
          </label>
        </div>

        <div class="option-group">
          <label for="exclude" class="option-label">
            Exclude Specific Characters
          </label>
          <input
            id="exclude"
            v-model="options.exclude"
            type="text"
            class="text-input"
            placeholder="Characters to exclude from password"
          />
        </div>

        <!-- Requirements -->
        <div class="option-group">
          <label class="checkbox-label">
            <input
              v-model="options.requireEachSelectedClass"
              type="checkbox"
              class="checkbox"
            />
            Require at least one character from each selected type
          </label>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>
        Generated client-side using
        <a
          href="https://www.npmjs.com/package/pwordgen"
          target="_blank"
          rel="noopener"
        >
          pwordgen
        </a>
        • No data is sent to any server
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { usePwordGen } from "../data/usePwordGen";

// Use the composable to get all the password generation logic
const {
  options,
  password,
  error,
  copySuccess,
  entropy,
  entropyDescription,
  generateNewPassword,
  copyToClipboard
} = usePwordGen();
</script>

<style scoped>
.password-generator {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, sans-serif;
  color: #000;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: normal;
  color: #000;
}

.header p {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: #666;
}

.password-section {
  margin-bottom: 2rem;
}

.password-display {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.password-field {
  flex: 1;
  padding: 0.5rem;
  font-family: monospace;
  border: 1px solid #000;
  background: transparent;
  color: #000;
}

.password-field.error {
  color: #666;
}

.password-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #000;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  color: #000;
}

.btn:disabled {
  color: #999;
  border-color: #999;
  cursor: default;
}

.btn-primary {
  background: #000;
  color: #fff;
  border-color: #000;
}

.btn-secondary {
  background: transparent;
  color: #000;
  border-color: #000;
}

.entropy-display {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
}

.entropy-value {
  font-family: monospace;
  color: #000;
}

.options-section h2 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: normal;
  color: #000;
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-group h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: normal;
  color: #666;
}

.option-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #000;
}

.range-input {
  width: 100%;
  margin: 0.25rem 0;
  -webkit-appearance: none;
  appearance: none;
  height: 2px;
  background: #000;
  outline: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #000;
  cursor: pointer;
}

.range-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #000;
  cursor: pointer;
  border: none;
}

.number-input {
  width: 60px;
  padding: 0.25rem;
  border: 1px solid #000;
  background: transparent;
  margin-left: 0.5rem;
  color: #000;
}

.text-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #000;
  background: transparent;
  font-size: 0.9rem;
  color: #000;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  color: #000;
}

.footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #000;
  font-size: 0.8rem;
  color: #666;
}

.footer a {
  text-decoration: none;
  color: #000;
}

.footer a:hover {
  text-decoration: underline;
}

@media (prefers-color-scheme: dark) {
  .password-generator {
    color: #fff;
  }

  .header h1 {
    color: #fff;
  }

  .header p {
    color: #999;
  }

  .password-field {
    border-color: #fff;
    color: #fff;
  }

  .password-field.error {
    color: #999;
  }

  .btn {
    border-color: #fff;
    color: #fff;
  }

  .btn:disabled {
    color: #666;
    border-color: #666;
  }

  .btn-primary {
    background: #fff;
    color: #000;
    border-color: #fff;
  }

  .btn-secondary {
    background: transparent;
    color: #fff;
    border-color: #fff;
  }

  .entropy-display {
    color: #999;
  }

  .entropy-value {
    color: #fff;
  }

  .options-section h2 {
    color: #fff;
  }

  .option-group h3 {
    color: #999;
  }

  .option-label {
    color: #fff;
  }

  .range-input {
    background: #fff;
  }

  .range-input::-webkit-slider-thumb {
    background: #fff;
  }

  .range-input::-moz-range-thumb {
    background: #fff;
  }

  .number-input {
    border-color: #fff;
    color: #fff;
  }

  .text-input {
    border-color: #fff;
    color: #fff;
  }

  .checkbox-label {
    color: #fff;
  }

  .footer {
    border-top-color: #fff;
    color: #999;
  }

  .footer a {
    color: #fff;
  }
}

@media (max-width: 640px) {
  .password-display {
    flex-direction: column;
  }
}
</style>

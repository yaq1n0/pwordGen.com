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
              🔄 Regenerate
            </button>
            <button
              class="btn btn-secondary"
              type="button"
              :disabled="!password"
              :title="copySuccess ? 'Copied!' : 'Copy to clipboard'"
              @click="copyToClipboard"
            >
              {{ copySuccess ? "✓ Copied!" : "📋 Copy" }}
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
                v-model="options.includeUpper"
                type="checkbox"
                class="checkbox"
              />
              Uppercase Letters (A-Z)
            </label>
            <label class="checkbox-label">
              <input
                v-model="options.includeLower"
                type="checkbox"
                class="checkbox"
              />
              Lowercase Letters (a-z)
            </label>
            <label class="checkbox-label">
              <input
                v-model="options.includeDigits"
                type="checkbox"
                class="checkbox"
              />
              Numbers (0-9)
            </label>
            <label class="checkbox-label">
              <input
                v-model="options.includeSymbols"
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
            v-model="options.customChars"
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
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  line-height: 1.6;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  color: #2563eb;
}

.header p {
  color: #64748b;
  margin: 0;
}

.password-section {
  margin-bottom: 3rem;
}

.password-display {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.password-field {
  flex: 1;
  min-width: 300px;
  padding: 1rem;
  font-family: "Courier New", monospace;
  font-size: 1.1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: #f8fafc;
}

.password-field.error {
  border-color: #ef4444;
  background: #fef2f2;
  color: #ef4444;
}

.password-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #64748b;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #475569;
}

.entropy-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.entropy-label {
  font-weight: 600;
}

.entropy-value {
  font-family: "Courier New", monospace;
  font-weight: 600;
}

.entropy-info {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

.options-section h2 {
  margin: 0 0 1.5rem 0;
  color: #1e293b;
}

.option-group {
  margin-bottom: 2rem;
}

.option-group h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #374151;
}

.option-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.range-input {
  width: 100%;
  margin: 0.5rem 0;
}

.number-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  margin-left: 1rem;
}

.text-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.checkbox {
  margin: 0;
}

.footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.9rem;
}

.footer a {
  color: #2563eb;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .password-generator {
    padding: 1rem;
  }

  .password-display {
    flex-direction: column;
  }

  .password-field {
    min-width: auto;
  }
}
</style>

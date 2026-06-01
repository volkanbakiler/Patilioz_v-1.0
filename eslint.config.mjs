import { defineConfig } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      // Existing Turkish marketing/legal copy uses plain apostrophes and quotes.
      "react/no-unescaped-entities": "warn",
      // The current mock/localStorage hydration pattern intentionally sets state in effects.
      "react-hooks/set-state-in-effect": "warn",
      // Keep generated shadcn/ui code untouched while still surfacing purity findings.
      "react-hooks/purity": "warn",
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "tsconfig.tsbuildinfo",
    ],
  },
])

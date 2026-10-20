import { createRequire } from "node:module"
import babelParser from "@babel/eslint-parser"
import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import turboPlugin from "eslint-plugin-turbo"

const require = createRequire(import.meta.url)

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [require.resolve("@babel/preset-typescript")],
          parserOpts: {
            plugins: ["jsx"],
          },
        },
      },
    },
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
]

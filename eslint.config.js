import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default [
  {
    ignores: [
      "dist/",
      "node_modules/",
      "*.js"
    ],
  },
  ...compat.config({
    root: true,
    env: {
      browser: true,
      es2021: true,
      node: true
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      project: [
        "./tsconfig.json",
        "./packages/*/tsconfig.json"
      ]
    },
    plugins: [
      "@typescript-eslint",
      "react"
    ],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:prettier/recommended"
    ],
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn"],
      "react/prop-types": "off"
    }
  })
];

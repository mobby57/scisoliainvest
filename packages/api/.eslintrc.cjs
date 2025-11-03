module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'warn',
  },
  overrides: [
    // Ignore explicit-any / typing noise in declaration files
    {
      files: ["**/*.d.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off"
      }
    },
    // Allow console in script and seed files
    {
      files: [
        "src/scripts/**",
        "src/**/*.seed.ts",
        "src/**/*.sh.ts",
        "src/**/debug*.ts",
        "src/server.ts"
      ],
      rules: {
        "no-console": "off"
      }
    },
    // Tests: relax unsafe-any rules so test setup can be quick
    {
      files: ["src/tests/**", "tests/**", "src/**/__tests__/**"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off"
      }
    }
  ]
};

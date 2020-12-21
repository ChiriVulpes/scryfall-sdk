import { ParserOptions } from "@typescript-eslint/parser";
import { ESLint } from "eslint";

module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json", "src/tsconfig.json"],
	} as ParserOptions,
	plugins: [
		"@typescript-eslint",
	],
	extends: [
		// use all recommended rules as base
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],
	rules: {
		// eslint
		"comma-dangle": ["warn", "always-multiline"],
		"quotes": ["warn", "double", { avoidEscape: true }],
		"no-constant-condition": ["warn", { checkLoops: false }],
		"no-cond-assign": ["off"],

		// typescript-eslint
		"@typescript-eslint/no-explicit-any": ["off"],
		"@typescript-eslint/await-thenable": ["off"],
		"@typescript-eslint/restrict-template-expressions": ["off"],
		"@typescript-eslint/no-non-null-assertion": ["off"],
		"@typescript-eslint/no-namespace": ["off"],
		"@typescript-eslint/explicit-module-boundary-types": ["off"],
		"@typescript-eslint/no-unsafe-member-access": ["off"],
		"@typescript-eslint/ban-types": ["off"],
		"@typescript-eslint/no-empty-interface": ["off"],
		"@typescript-eslint/no-unsafe-assignment": ["off"],
		"@typescript-eslint/no-unsafe-return": ["off"],

	},
} as ESLint.Options;

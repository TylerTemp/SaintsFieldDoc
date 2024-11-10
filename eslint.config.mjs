import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
), {
    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
        "unused-imports": unusedImports,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",
        },
    },

    settings: {
        "import/resolver": {
            alias: {
                map: [["~", "./src"]],
                extensions: [".ts", ".js", ".jsx", ".json"],
            },
        },

        react: {
            version: "detect",
        },
    },

    rules: {
        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        "react/react-in-jsx-scope": "off",
        "react/jsx-uses-react": "off",

        "@typescript-eslint/no-unused-vars": ["warn", {
            ignoreRestSiblings: true,
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
        }]
    },
}];
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import next from "eslint-config-next";

const compat = new FlatCompat({
  baseConfig: js.configs.recommended,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

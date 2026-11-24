import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "next-15-workaround.d.ts"],
  },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;

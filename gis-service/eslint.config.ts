import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // 1. Ignore build outputs and package folders
  { 
    ignores: ["dist/*", "node_modules/*"] 
  },
  
  // 2. Set runtime environment to Node.js
  { 
    languageOptions: { 
      globals: globals.node 
    } 
  },
  
  // 3. Load recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,
];

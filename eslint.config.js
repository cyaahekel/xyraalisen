import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['firestore.rules'],
    plugins: {
      'firebase-security': firebaseRulesPlugin
    },
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    // We add the rules manually since the plugin might not have a flat config helper yet or it might be different
    rules: {
      'firebase-security/no-unprotected-methods': 'error'
    }
  }
];

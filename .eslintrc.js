module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        "indent": ["warning", 4],
        "linebreak-style": ["warning", "unix"],
        "quotes": ["warning", "single"],
        "semi": ["warning", "always"],

        // override configuration set by extending "eslint:recommended"
        "no-empty": "warn",
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
        "for-direction": "off",
    },
    "parserOptions": {
        "ecmaVersion": 9,
        "sourceType": "module"
    }
};

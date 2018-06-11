module.exports = {
    "extends": ["standard", "plugin:react/recommended"],
    "plugins": ["react"],
    "parser": "babel-eslint",
    "env": {
        "jest": true
    },
    "globals": {
        "confirm": true
    },
    "rules": {
        "no-multi-spaces": 0,
        "react/no-deprecated": 0,
        "react/prop-types": 0,
        "react/no-string-refs": 0,
        "prefer-const": ["warn", {
            "destructuring": "all"
        }],
    }
}
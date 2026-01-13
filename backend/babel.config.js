export default {
    presets: [
        ["@babel/preset-env", {
            modules: false  // Preserve ES modules instead of converting to CommonJS
        }]
    ],
};
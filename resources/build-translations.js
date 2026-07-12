const fs = require("fs");
const path = require("path");

const sourcePath = path.join(__dirname, "translations.json");
const outputPath = path.join(__dirname, "translations.generated.js");
const translations = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

fs.writeFileSync(
    outputPath,
    "window.MULTICLOCK_TRANSLATIONS = " + JSON.stringify(translations, null, 2) + ";\n",
    "utf8"
);

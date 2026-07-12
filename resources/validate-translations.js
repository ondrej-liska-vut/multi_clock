const fs = require("fs");
const vm = require("vm");

const html = fs.readFileSync("index.html", "utf8");
const translations = JSON.parse(fs.readFileSync("resources/translations.json", "utf8"));
const availableKeys = new Set(Object.keys(translations.strings));
const usedKeys = [
    ...html.matchAll(/(?:data-i18n(?:-aria)?="|\bt\(")([^"]+)"/g)
].map((match) => match[1]);
const missingKeys = [...new Set(usedKeys.filter((key) => !availableKeys.has(key)))];

if (missingKeys.length) {
    throw new Error("Missing translation keys: " + missingKeys.join(", "));
}

for (const [key, values] of Object.entries(translations.strings)) {
    const placeholders = translations.meta.supportedLanguages.map((language) =>
        [...values[language].matchAll(/\{[^}]+\}/g)].map((match) => match[0]).sort().join(",")
    );
    if (new Set(placeholders).size !== 1) {
        throw new Error("Placeholder mismatch in " + key);
    }
}

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("resources/translations.generated.js", "utf8"), sandbox);
if (JSON.stringify(sandbox.window.MULTICLOCK_TRANSLATIONS) !== JSON.stringify(translations)) {
    throw new Error("Generated translations differ from translations.json");
}

const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)];
new Function(scripts.at(-1)[1]);

console.log("Translations OK:", availableKeys.size, "available keys,", new Set(usedKeys).size, "used keys");

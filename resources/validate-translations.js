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

const requiredMeta = [
    'name="description"',
    'name="robots"',
    'name="keywords"',
    'property="og:title"',
    'property="og:description"',
    'property="og:type"',
    'name="twitter:title"',
    'name="twitter:description"'
];
const missingMeta = requiredMeta.filter((attribute) => !html.includes(`<meta ${attribute}`));
if (missingMeta.length) {
    throw new Error("Missing SEO metadata: " + missingMeta.join(", "));
}

const structuredDataMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
);
if (!structuredDataMatch) {
    throw new Error("Missing SoftwareApplication structured data");
}

const structuredData = JSON.parse(structuredDataMatch[1]);
if (structuredData["@type"] !== "SoftwareApplication") {
    throw new Error("SEO structured data must describe a SoftwareApplication");
}

const supportedLanguages = translations.meta.supportedLanguages;
if (JSON.stringify(structuredData.inLanguage) !== JSON.stringify(supportedLanguages)) {
    throw new Error("Structured-data languages differ from translation languages");
}

const robots = fs.readFileSync("robots.txt", "utf8");
if (!/^User-agent:\s*\*/m.test(robots) || !/^Allow:\s*\/$/m.test(robots)) {
    throw new Error("robots.txt must allow public crawling");
}

console.log(
    "Translations and SEO OK:",
    availableKeys.size,
    "available keys,",
    new Set(usedKeys).size,
    "used keys,",
    supportedLanguages.length,
    "languages"
);

# Překlady aplikace

Soubor `translations.json` je zdroj překladů pro uživatelské rozhraní.

## Struktura

- `meta.supportedLanguages` obsahuje podporované kódy jazyků.
- `meta.defaultLanguage` určuje výchozí jazyk.
- `strings` obsahuje stabilní významové klíče.
- Každý klíč musí obsahovat překlad pro všechny jazyky uvedené v `meta.supportedLanguages`.

## Proměnné

Texty mohou obsahovat pojmenované zástupné hodnoty ve složených závorkách, například `{name}`, `{number}`, `{max}` nebo `{seconds}`. Každý překlad stejného klíče musí zachovat všechny jeho zástupné hodnoty.

## Přidání textu

1. Přidej nový významový klíč do `strings`.
2. Doplň všechny tři jazykové varianty.
3. Nepoužívej českou větu jako název klíče.
4. Po zapojení lokalizace v aplikaci používej tento klíč místo textu zapsaného přímo v HTML nebo JavaScriptu.

## Vygenerování souboru pro prohlížeč

Po každé změně `translations.json` spusť z kořene projektu:

```powershell
node resources/build-translations.js
```

Tím se aktualizuje `translations.generated.js`, který aplikace načítá i při přímém otevření přes `file://`.

Správnost klíčů, proměnných a generovaného souboru ověříš příkazem:

```powershell
node resources/validate-translations.js
```

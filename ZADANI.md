# Vícehráčové herní hodiny

Tento soubor je průběžné zadání aktivní verze aplikace v `multiClock.html`.

## Základní chování

- Každý hráč má vlastní časomíru.
- Aktivní je vždy právě jeden hráč a kliknutím na jeho časomíru se tah předá dalšímu hráči.
- Po předání tahu se původnímu hráči přičte nastavený přídavek.
- Hru lze společně pozastavit a znovu spustit.
- Rozehraná hra, časy a nastavení se zachovají po obnovení stránky.
- Rozhraní má samostatné počítačové a mobilní zobrazení.
- V mobilním zobrazení mají po spuštění hry hlavní prostor časomíry, ale zůstává dostupná pauza, menu a návrat na počítačové zobrazení.
- Po spuštění hry se v mobilním zobrazení horní banner včetně nadpisu skryje. Pauza/pokračování používá symbol `⏸/▶` a menu symbol `☰`.
- Před spuštěním hry používá mobilní mřížka vždy dva sloupce a dlaždice se mohou zmenšit podle šířky panelu, takže nepřetékají přes jeho okraj.
- Mobilní tlačítka pause/play a menu jsou kompaktní čtvercová tlačítka nezávislá na šířce dlaždic; menu používá pouze symbol `☰`.
- Mobilní ovládací řádek má pořadí pause/play, dvě časové předvolby a menu; všechna tlačítka mají výšku 44 px a menu je zarovnané k pravému okraji.
- Pokud zbývá šířka, mobilní herní řádek postupně zpřístupní návrat na PC od 330 px, jazyk od 400 px, zvuk od 450 px a pokročilé nastavení od 500 px.
- Přidané utility se vizuálně řadí stejně jako na desktopu: jazyk, zvuk, nastavení a PC; skryté utility zůstávají dostupné ve vysouvacím menu.
- Význam tlačítka menu a informace, že časová předvolba přidává čas aktuálnímu hráči, jsou viditelné pouze jako tooltip při najetí a jako přístupný popisek.
- Jazyk, zvuk, pokročilé nastavení a návrat na desktop jsou v běžícím mobilním režimu přesunuty do prvního řádku vysouvacího menu.
- Desktop nejprve použije úzké jednosloupcové nastavení hráčů. Pokud by přeteklo výšku viewportu a viewport má alespoň 1500 px, rozšíří panel a přepne jména do dvou sloupců; na užším displeji zůstane jeden sloupec.
- Přepnutí mezi jedním a dvěma sloupci se po změně počtu hráčů nebo velikosti okna znovu automaticky vyhodnotí; tři sloupce se nepoužívají.
- Mřížka hodin odvozuje počet sloupců od dostupné šířky i výšky a drží klikací dlaždice co nejblíže čtvercovému poměru při minimální cílové šířce přibližně 180 px.
- Cílové rozložení 2560 × 1440 zobrazí všech 20 hráčů bez nutnosti posouvat celou stránku; scrollování nastavení zůstává pouze jako pojistka pro nízké viewporty.
- Přidání nebo odebrání hráče okamžitě překreslí mřížku a přepne mezi úzkým a širokým layoutem bez obnovení stránky.

## Herní režimy

### Obecný režim

- Podporuje 3 až 20 hráčů.
- Hráči hrají v pořadí zobrazených časomír.

### Scythe

- Podporuje 3 až 8 hráčů.
- Dostupné frakce: Rusviet, Nordic, Crimea, Saxony, Polania, Albion, Togawa, Vesna a Fenris.
- Dva hráči nesmí mít stejnou frakci.
- Pokud hráč zvolí již obsazenou frakci, původní držitel dostane první volnou frakci.
- Hráči a časomíry se automaticky řadí podle pořadí frakcí v seznamu výše.
- Frakční barva a grafická značka jsou viditelné v nastavení i na časomíře.

## Menu během hry

- Reset hry provádí pouze tlačítko `Reset` a nemění zvolený herní režim ani ostatní nastavení.
- Pokročilé nastavení obsahuje potvrzovanou volbu `Obnovit výchozí nastavení`, která vrátí obecný režim, 4 hráče, výchozí časy, zvuky a jména `Hráč 1-4`.
- Na desktopu se tlačítko `MENU` nezobrazuje. Vedle pauzy/pokračování je výběr hráče a pět tlačítek předvoleb pro okamžité přidání času.
- Výběr cíle pro přidání času zobrazuje pouze jméno hráče; automatický aktivní cíl není doplněn vysvětlujícím textem.
- Výchozí předvolby přidání času jsou `+5s`, `+15s`, `+1min`, `+2min` a `+5min`; každou hodnotu lze změnit v pokročilém nastavení.
- V úzkém mobilním režimu se zobrazují druhá a čtvrtá předvolba, ve výchozím stavu `+15s` a `+2min`.
- Pokud se desktopová herní lišta nevejde vedle stavu a pauzy, předvolby se přesunou na samostatný řádek a nepřetékají mimo viewport.
- V PC režimu je stavové info vždy na samostatném jednom řádku nad pauzou a tlačítky pro přidání času; při nedostatku šířky se zkrátí výpustkou.
- Otevření herního menu si zapamatuje předchozí stav odpočtu. Po zavření křížkem, tlačítkem menu, kliknutím mimo panel nebo návratem na PC se běžící hodiny znovu spustí, zatímco předem pozastavené hodiny zůstanou pozastavené.
- Výchozím cílem rychlého přidání je vždy právě aktivní hráč; po předání tahu se cíl automaticky změní.
- V mobilním menu lze nastavit jiného pevného hráče a použít všech pět časových předvoleb.
- Menu v mobilním režimu zpřístupňuje také kompletní nastavení partie.

## Horní lišta a zvuky

- Horní lišta je na desktopu plnohodnotný banner přes celou šířku stránky bez zaoblení.
- V režimu Scythe přebírá horní banner tmavý industriálně-historický motiv a výraznější patkový nadpis.
- Ovládací prvky v liště jsou bez rámečků a textových popisků; používají symboly, tooltipy a ztmavení při najetí nebo aktivaci.
- Lišta obsahuje kompaktní volbu `CZ / EN / DE`; přepnutí jazyka je zatím pouze připravené bez změny obsahu.
- Zvuk lze kdykoliv zapnout nebo vypnout a tato volba se ukládá.
- Ozubené kolo v horní liště otevírá pokročilé nastavení zvuku; prostor počítá také s budoucím nastavením barev.
- Tikání, začátek hry, předání tahu, jednorázové varování, odpočet posledních 10 sekund a vypršení času lze zapínat samostatně a volby se ukládají.
- Tikání je ve výchozím stavu vypnuté; po zapnutí má každý hráč mírně odlišný tón.
- Odpočet posledních 10 sekund je ve výchozím stavu zapnutý a používá hlasitější zlověstný tón, který se směrem k nule stupňuje.
- Start hry, předání tahu, dosažení posledních 10 sekund a vypršení času mají samostatné zvukové signály.

## Překlady

- Překlady uživatelského rozhraní jsou v `resources/translations.json` pro `cs`, `en`, `de`, `es`, `hu`, `uk`, `pl`, `it`, `fr`, `ru` a `bs`.
- Každá položka používá stabilní významový klíč a obsahuje všechny podporované jazykové varianty.
- Dynamické texty používají pojmenované zástupné hodnoty, například `{name}`, `{number}`, `{max}` a `{seconds}`.
- Pravidla pro údržbu a přidávání překladů jsou popsaná v `resources/README.md`.
- Výběr jazyka okamžitě překládá statické texty, dynamické stavové hlášky, dlaždice, tooltipy a nastavení; zvolený jazyk se ukládá a synchronizuje mezi všemi přepínači.
- Výchozí jména hráčů se při změně jazyka přeloží, pokud odpovídají výchozí šabloně v kterémkoli podporovaném jazyce; ručně upravená jména se nikdy nepřepisují.
- Česká hlavní tlačítka používají texty `Spustit` a `Vynulovat čas`.

## Aktuální kolo

- [x] Sjednotit mobilní a počítačové zobrazení bez slepé uličky.
- [x] Doplnit všechny frakce Scythe a jejich grafické značky.
- [x] Vynutit unikátní frakce a automatické pořadí hráčů.
- [x] Zvýšit limity na 8 hráčů ve Scythe a 20 v obecném režimu.
- [x] Upravit menu a doplnit jednorázové přidávání času.
- [x] Ověřit syntaxi, stavové přechody a ukládání.
- [x] Zachovat režim při restartu a rozdělit přidávání času pro desktop a mobil.

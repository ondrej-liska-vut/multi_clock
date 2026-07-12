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
- Na desktopu se tlačítko `MENU` nezobrazuje. Vedle pauzy/pokračování je přímo výběr hráče, počet sekund a tlačítko pro přidání času.
- Na mobilu jsou během hry vedle sebe pauza/pokračování, `MENU` a rychlé tlačítko `Přidat 15 sekund`.
- Otevření herního menu odpočet pozastaví; zavření křížkem, tlačítkem `ZAVŘÍT` nebo kliknutím mimo panel odpočet automaticky znovu spustí na mobilu i desktopu.
- Výchozím cílem rychlého přidání je vždy právě aktivní hráč; po předání tahu se cíl automaticky změní.
- V mobilním menu lze nastavit jiného pevného hráče i jiný počet sekund.
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

## Aktuální kolo

- [x] Sjednotit mobilní a počítačové zobrazení bez slepé uličky.
- [x] Doplnit všechny frakce Scythe a jejich grafické značky.
- [x] Vynutit unikátní frakce a automatické pořadí hráčů.
- [x] Zvýšit limity na 8 hráčů ve Scythe a 20 v obecném režimu.
- [x] Upravit menu a doplnit jednorázové přidávání času.
- [x] Ověřit syntaxi, stavové přechody a ukládání.
- [x] Zachovat režim při restartu a rozdělit přidávání času pro desktop a mobil.

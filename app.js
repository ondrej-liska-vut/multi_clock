const genericPalette = [
    "#d97706",
    "#0f766e",
    "#2563eb",
    "#b91c1c",
    "#7c3aed",
    "#15803d",
    "#c2410c",
    "#1d4ed8",
    "#475569"
];

const scytheFactions = [
    { id: "rusviet", name: "Rusviet", color: "#d62b24", mark: "RS", motif: "Hvezda" },
    { id: "nordic", name: "Nordic", color: "#2f57b8", mark: "ND", motif: "Sever" },
    { id: "crimea", name: "Crimea", color: "#f2b705", mark: "CR", motif: "Drak" },
    { id: "saxony", name: "Saxony", color: "#1f1f1f", mark: "SX", motif: "Orel" },
    { id: "polania", name: "Polania", color: "#c83a32", mark: "PL", motif: "Medved" },
    { id: "albion", name: "Albion", color: "#5a6f2a", mark: "AL", motif: "Kanec" },
    { id: "togawa", name: "Togawa", color: "#7a4db2", mark: "TG", motif: "Kruh" },
    { id: "vesna", name: "Vesna", color: "#53d3d0", mark: "VS", motif: "Liska" },
    { id: "fenris", name: "Fenris", color: "#f28c1b", mark: "FN", motif: "Lebka" }
];

const STORAGE_KEY = "multiclock-state-v1";

const state = {
    gameMode: "generic",
    playerCount: 4,
    startMinutes: 10,
    incrementSeconds: 0,
    players: [],
    activeIndex: 0,
    paused: true,
    running: false,
    timerId: null,
    mobileSetupOpen: false,
    lastTickAt: null,
    mobileView: false
};

const elements = {
    gameMode: document.getElementById("gameMode"),
    playerCount: document.getElementById("playerCount"),
    startMinutes: document.getElementById("startMinutes"),
    incrementSeconds: document.getElementById("incrementSeconds"),
    playerConfigList: document.getElementById("playerConfigList"),
    startButton: document.getElementById("startButton"),
    resetButton: document.getElementById("resetButton"),
    pauseButton: document.getElementById("pauseButton"),
    mobileSetupToggle: document.getElementById("mobileSetupToggle"),
    viewModeToggle: document.getElementById("viewModeToggle"),
    boardSetupToggle: document.getElementById("boardSetupToggle"),
    boardSettingsToggle: document.getElementById("boardSettingsToggle"),
    settingsToggle: document.getElementById("settingsToggle"),
    closeSettings: document.getElementById("closeSettings"),
    settingsPanel: document.getElementById("settingsPanel"),
    clockGrid: document.getElementById("clockGrid"),
    statusText: document.getElementById("statusText"),
    gameStateBadge: document.getElementById("gameStateBadge"),
    addTimePlayer: document.getElementById("addTimePlayer"),
    addTimeSeconds: document.getElementById("addTimeSeconds"),
    addTimeButton: document.getElementById("addTimeButton"),
    liveColorList: document.getElementById("liveColorList")
};

function getFactionById(factionId) {
    return scytheFactions.find((faction) => faction.id === factionId) ?? scytheFactions[0];
}

function getPlayerFallbackName(index, factionId = null) {
    if (state.gameMode === "scythe" && factionId) {
        return getFactionById(factionId).name;
    }

    return `Hráč ${index + 1}`;
}

function createPlayer(index, existingPlayer = null) {
    if (state.gameMode === "scythe") {
        const fallbackFaction = scytheFactions[index % scytheFactions.length];
        const faction = getFactionById(existingPlayer?.factionId ?? fallbackFaction.id);
        return {
            id: existingPlayer?.id ?? crypto.randomUUID(),
            name: existingPlayer?.name ?? faction.name,
            color: faction.color,
            factionId: faction.id,
            seconds: Math.max(0, Number(existingPlayer?.seconds ?? state.startMinutes * 60)),
            out: Boolean(existingPlayer?.out)
        };
    }

    return {
        id: existingPlayer?.id ?? crypto.randomUUID(),
        name: existingPlayer?.name ?? `Hráč ${index + 1}`,
        color: existingPlayer?.color ?? genericPalette[index % genericPalette.length],
        factionId: null,
        seconds: Math.max(0, Number(existingPlayer?.seconds ?? state.startMinutes * 60)),
        out: Boolean(existingPlayer?.out)
    };
}

function saveState() {
    const persistedState = {
        gameMode: state.gameMode,
        playerCount: state.playerCount,
        startMinutes: state.startMinutes,
        incrementSeconds: state.incrementSeconds,
        players: state.players.map((player) => ({
            id: player.id,
            name: player.name,
            color: player.color,
            factionId: player.factionId,
            seconds: player.seconds,
            out: player.out
        })),
        activeIndex: state.activeIndex,
        paused: state.paused,
        running: state.running,
        lastTickAt: state.running && !state.paused ? Date.now() : null,
        mobileView: state.mobileView
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
}

function applyElapsedTime() {
    if (!state.running || state.paused || !state.lastTickAt) {
        return;
    }

    const elapsedSeconds = Math.floor((Date.now() - state.lastTickAt) / 1000);
    if (elapsedSeconds <= 0) {
        return;
    }

    let remainingElapsed = elapsedSeconds;

    while (remainingElapsed > 0 && countRemainingPlayers() > 1) {
        const activePlayer = getActivePlayer();
        if (!activePlayer || activePlayer.out) {
            moveToNextPlayer();
            continue;
        }

        if (activePlayer.seconds > remainingElapsed) {
            activePlayer.seconds -= remainingElapsed;
            remainingElapsed = 0;
            break;
        }

        remainingElapsed -= activePlayer.seconds;
        activePlayer.seconds = 0;
        activePlayer.out = true;
        moveToNextPlayer();
    }

    state.lastTickAt = Date.now();
}

function loadState() {
    const rawState = window.localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
        return false;
    }

    try {
        const parsedState = JSON.parse(rawState);
        state.gameMode = parsedState.gameMode === "scythe" ? "scythe" : "generic";
        state.playerCount = Math.min(9, Math.max(2, Number(parsedState.playerCount) || 4));
        state.startMinutes = Math.max(1, Number(parsedState.startMinutes) || 10);
        state.incrementSeconds = Math.max(0, Number(parsedState.incrementSeconds) || 0);
        state.players = Array.from({ length: state.playerCount }, (_, index) => createPlayer(index, parsedState.players?.[index] ?? null));
        state.activeIndex = Math.min(state.players.length - 1, Math.max(0, Number(parsedState.activeIndex) || 0));
        state.paused = Boolean(parsedState.paused);
        state.running = Boolean(parsedState.running);
        state.mobileSetupOpen = false;
        state.lastTickAt = typeof parsedState.lastTickAt === "number" ? parsedState.lastTickAt : null;
        state.mobileView = Boolean(parsedState.mobileView);

        elements.gameMode.value = state.gameMode;
        elements.playerCount.value = String(state.playerCount);
        elements.startMinutes.value = String(state.startMinutes);
        elements.incrementSeconds.value = String(state.incrementSeconds);

        applyElapsedTime();

        return true;
    } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        return false;
    }
}

function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getActivePlayer() {
    return state.players[state.activeIndex] ?? null;
}

function countRemainingPlayers() {
    return state.players.filter((player) => !player.out).length;
}

function buildPlayerConfig() {
    elements.playerConfigList.innerHTML = "";

    state.players.forEach((player, index) => {
        const row = document.createElement("div");
        row.className = "player-row";
        const faction = player.factionId ? getFactionById(player.factionId) : null;

        if (state.gameMode === "scythe") {
            const factionOptions = scytheFactions
                .map((item) => `<option value="${item.id}" ${item.id === player.factionId ? "selected" : ""}>${item.name}</option>`)
                .join("");

            row.classList.add("player-row-scythe");
            row.innerHTML = `
                <div class="player-mode-badge" style="--badge-color: ${player.color}">
                    <span class="player-mode-mark">${faction?.mark ?? "SC"}</span>
                </div>
                <label class="field">
                    <span>Jméno hráče ${index + 1}</span>
                    <input type="text" value="${player.name}" data-role="name" data-index="${index}">
                </label>
                <label class="field">
                    <span>Frakce</span>
                    <select data-role="faction" data-index="${index}">
                        ${factionOptions}
                    </select>
                </label>
            `;
        } else {
            row.innerHTML = `
                <label class="field">
                    <span>Jméno hráče ${index + 1}</span>
                    <input type="text" value="${player.name}" data-role="name" data-index="${index}">
                </label>
                <label class="field">
                    <span>Barva</span>
                    <input class="swatch-input" type="color" value="${player.color}" data-role="color" data-index="${index}">
                </label>
            `;
        }
        elements.playerConfigList.appendChild(row);
    });
}

function renderAddTimeOptions() {
    const previous = elements.addTimePlayer.value;
    elements.addTimePlayer.innerHTML = "";

    state.players.forEach((player, index) => {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = player.name;
        elements.addTimePlayer.appendChild(option);
    });

    elements.addTimePlayer.value = previous && state.players[Number(previous)] ? previous : "0";
}

function buildLiveColorControls() {
    elements.liveColorList.innerHTML = "";

    state.players.forEach((player, index) => {
        const row = document.createElement("div");
        row.className = "color-row";
        const faction = player.factionId ? getFactionById(player.factionId) : null;
        row.innerHTML = `
            <div>
                <strong>${player.name}</strong>
                ${faction ? `<p class="color-row-meta">${faction.name} • ${faction.motif}</p>` : ""}
            </div>
            ${state.gameMode === "scythe"
                ? `<div class="locked-swatch" style="--swatch-color: ${player.color}">
                        <span>${faction?.mark ?? "SC"}</span>
                   </div>`
                : `<input class="swatch-input" type="color" value="${player.color}" data-live-color="${index}">`}
        `;
        elements.liveColorList.appendChild(row);
    });
}

function renderClocks() {
    if (!state.running || state.players.length === 0) {
        elements.clockGrid.className = "clock-grid empty";
        elements.clockGrid.innerHTML = `
            <div class="empty-state">
                <h3>Hodiny čekají na spuštění</h3>
                <p>Po startu se zde zobrazí jednotlivé bloky hráčů s jejich odpočtem.</p>
            </div>
        `;
        return;
    }

    elements.clockGrid.className = "clock-grid";
    elements.clockGrid.innerHTML = "";

    state.players.forEach((player, index) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "clock-card";
        card.style.setProperty("--player-color", player.color);
        const faction = player.factionId ? getFactionById(player.factionId) : null;

        if (index === state.activeIndex && !player.out) {
            card.classList.add(state.paused ? "paused" : "active");
        }

        if (player.out) {
            card.classList.add("out");
            card.disabled = true;
        }

        card.innerHTML = `
            <div class="clock-card-header">
                <div class="clock-title-group">
                    ${faction ? `<span class="faction-mark" aria-hidden="true">${faction.mark}</span>` : ""}
                    <div>
                        <span class="clock-name">${player.name}</span>
                        ${faction ? `<span class="clock-faction">${faction.name}</span>` : ""}
                    </div>
                </div>
                <span class="clock-order">Pořadí ${index + 1}</span>
            </div>
            <div class="clock-time">${formatTime(player.seconds)}</div>
            <div class="clock-meta">${player.out ? "Čas vypršel" : `Klikni při předání tahu${state.incrementSeconds > 0 ? ` • +${state.incrementSeconds}s za tah` : ""}`}</div>
        `;

        card.addEventListener("click", () => handleClockTap(index));
        elements.clockGrid.appendChild(card);
    });

    saveState();
}

function updateStatus() {
    const activePlayer = getActivePlayer();

    if (!state.running) {
        elements.statusText.textContent = state.gameMode === "scythe"
            ? "Vyber frakce, nastav čas a spusť Scythe režim."
            : "Nejdřív připravte hráče a spusťte partii.";
        elements.gameStateBadge.textContent = "Nepřipraveno";
        elements.pauseButton.textContent = "Pozastavit vše";
        elements.pauseButton.disabled = true;
        saveState();
        return;
    }

    const remaining = countRemainingPlayers();

    if (remaining <= 1 && activePlayer) {
        elements.statusText.textContent = `Vítězí ${activePlayer.name}. Ostatním už čas vypršel.`;
        elements.gameStateBadge.textContent = "Konec hry";
        elements.pauseButton.disabled = true;
        saveState();
        return;
    }

    elements.pauseButton.disabled = false;
    elements.pauseButton.textContent = state.paused ? "Pokračovat" : "Pozastavit vše";
    elements.gameStateBadge.textContent = state.paused ? "Pozastaveno" : "Běží";

    if (!activePlayer) {
        elements.statusText.textContent = "Čekám na dalšího aktivního hráče.";
        return;
    }

    elements.statusText.textContent = state.paused
        ? `Hra je pozastavená. Na tahu má být ${activePlayer.name}.`
        : `Aktivní je ${activePlayer.name}. Kliknutím na jeho blok předáš tah dalšímu hráči.`;

    saveState();
}

function syncConfigurationFromInputs() {
    state.gameMode = elements.gameMode.value === "scythe" ? "scythe" : "generic";
    state.playerCount = Math.min(9, Math.max(2, Number(elements.playerCount.value) || 2));
    state.startMinutes = Math.max(1, Number(elements.startMinutes.value) || 1);
    state.incrementSeconds = Math.max(0, Number(elements.incrementSeconds.value) || 0);
    elements.gameMode.value = state.gameMode;
    elements.playerCount.value = String(state.playerCount);
    elements.startMinutes.value = String(state.startMinutes);
    elements.incrementSeconds.value = String(state.incrementSeconds);
}

function rebuildPlayersPreservingData() {
    const previousPlayers = state.players.slice();
    state.players = Array.from({ length: state.playerCount }, (_, index) => createPlayer(index, previousPlayers[index]));
}

function resetConfiguration() {
    state.gameMode = "generic";
    state.playerCount = 4;
    state.startMinutes = 10;
    state.incrementSeconds = 0;
    elements.gameMode.value = "generic";
    elements.playerCount.value = "4";
    elements.startMinutes.value = "10";
    elements.incrementSeconds.value = "0";
    state.players = Array.from({ length: 4 }, (_, index) => createPlayer(index));
    buildPlayerConfig();
    renderAddTimeOptions();
    buildLiveColorControls();
    saveState();
}

function applyConfigInputs() {
    const nameInputs = elements.playerConfigList.querySelectorAll('input[data-role="name"]');
    const colorInputs = elements.playerConfigList.querySelectorAll('input[data-role="color"]');
    const factionInputs = elements.playerConfigList.querySelectorAll('select[data-role="faction"]');

    nameInputs.forEach((input) => {
        const index = Number(input.dataset.index);
        state.players[index].name = input.value.trim() || `Hráč ${index + 1}`;
    });

    colorInputs.forEach((input) => {
        const index = Number(input.dataset.index);
        state.players[index].color = input.value;
    });

    factionInputs.forEach((select) => {
        const index = Number(select.dataset.index);
        const faction = getFactionById(select.value);
        state.players[index].factionId = faction.id;
        state.players[index].color = faction.color;
    });
}

function openSettingsPanel(forceOpen) {
    const shouldOpen = forceOpen ?? !elements.settingsPanel.classList.contains("open");
    elements.settingsPanel.classList.toggle("open", shouldOpen);
    elements.settingsPanel.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
}

function stopTimer() {
    if (state.timerId) {
        clearInterval(state.timerId);
        state.timerId = null;
    }
}

function syncLayoutState() {
    document.querySelector(".app-shell")?.classList.toggle("game-running", state.running);
    document.querySelector(".app-shell")?.classList.toggle("show-setup-mobile", state.mobileSetupOpen);
    document.querySelector(".app-shell")?.classList.toggle("mode-scythe", state.gameMode === "scythe");
    document.querySelector(".app-shell")?.classList.toggle("mobile-view", state.mobileView);
    if (elements.mobileSetupToggle) {
        elements.mobileSetupToggle.textContent = state.mobileSetupOpen ? "Skrýt nastavení" : "Nastavení partie";
    }
    if (elements.viewModeToggle) {
        elements.viewModeToggle.textContent = state.mobileView ? "Počítačové zobrazení" : "Mobilní zobrazení";
    }
    if (elements.boardSetupToggle) {
        elements.boardSetupToggle.textContent = state.mobileSetupOpen ? "Zavřít" : "Menu";
    }
}

function startTimer() {
    stopTimer();
    state.lastTickAt = Date.now();
    saveState();

    state.timerId = window.setInterval(() => {
        if (!state.running || state.paused) {
            return;
        }

        const activePlayer = getActivePlayer();
        if (!activePlayer || activePlayer.out) {
            return;
        }

        activePlayer.seconds -= 1;
        state.lastTickAt = Date.now();

        if (activePlayer.seconds <= 0) {
            activePlayer.seconds = 0;
            activePlayer.out = true;
            moveToNextPlayer();
        }

        renderClocks();
        updateStatus();
    }, 1000);
}

function moveToNextPlayer() {
    const remaining = countRemainingPlayers();

    if (remaining <= 1) {
        state.paused = true;
        stopTimer();
        const winnerIndex = state.players.findIndex((player) => !player.out);
        state.activeIndex = winnerIndex >= 0 ? winnerIndex : 0;
        state.lastTickAt = null;
        return;
    }

    let nextIndex = state.activeIndex;
    do {
        nextIndex = (nextIndex + 1) % state.players.length;
    } while (state.players[nextIndex].out);

    state.activeIndex = nextIndex;
}

function handleClockTap(index) {
    if (!state.running || state.paused || index !== state.activeIndex) {
        return;
    }

    const activePlayer = getActivePlayer();
    if (!activePlayer || activePlayer.out) {
        return;
    }

    activePlayer.seconds += state.incrementSeconds;
    moveToNextPlayer();
    renderClocks();
    updateStatus();
}

function startGame() {
    syncConfigurationFromInputs();
    rebuildPlayersPreservingData();
    applyConfigInputs();

    state.players.forEach((player) => {
        player.seconds = state.startMinutes * 60;
        player.out = false;
    });

    state.activeIndex = 0;
    state.running = true;
    state.paused = false;
    state.mobileSetupOpen = false;
    state.lastTickAt = Date.now();

    renderAddTimeOptions();
    buildLiveColorControls();
    syncLayoutState();
    renderClocks();
    updateStatus();
    startTimer();
}

function togglePause() {
    if (!state.running || countRemainingPlayers() <= 1) {
        return;
    }

    state.paused = !state.paused;
    state.lastTickAt = state.paused ? null : Date.now();
    renderClocks();
    updateStatus();
}

function addTimeToPlayer() {
    if (state.players.length === 0) {
        return;
    }

    const playerIndex = Number(elements.addTimePlayer.value);
    const extraSeconds = Math.max(1, Number(elements.addTimeSeconds.value) || 60);
    const target = state.players[playerIndex];

    if (!target) {
        return;
    }

    target.seconds += extraSeconds;
    if (target.seconds > 0) {
        target.out = false;
    }

    renderClocks();
    updateStatus();
}

function handleSetupInputChange() {
    syncConfigurationFromInputs();
    rebuildPlayersPreservingData();
    buildPlayerConfig();
    renderAddTimeOptions();
    buildLiveColorControls();
    syncLayoutState();
    renderClocks();
    updateStatus();
}

function bindEvents() {
    elements.gameMode.addEventListener("change", handleSetupInputChange);
    elements.playerCount.addEventListener("change", handleSetupInputChange);
    elements.startMinutes.addEventListener("change", syncConfigurationFromInputs);
    elements.incrementSeconds.addEventListener("change", syncConfigurationFromInputs);
    elements.startButton.addEventListener("click", startGame);
    elements.resetButton.addEventListener("click", () => {
        stopTimer();
        state.running = false;
        state.paused = true;
        state.mobileSetupOpen = false;
        resetConfiguration();
        syncLayoutState();
        renderClocks();
        updateStatus();
    });
    elements.pauseButton.addEventListener("click", togglePause);
    elements.mobileSetupToggle.addEventListener("click", () => {
        state.mobileSetupOpen = !state.mobileSetupOpen;
        syncLayoutState();
    });
    elements.viewModeToggle.addEventListener("click", () => {
        state.mobileView = !state.mobileView;
        if (!state.mobileView) {
            state.mobileSetupOpen = false;
        }
        syncLayoutState();
        saveState();
    });
    elements.boardSetupToggle.addEventListener("click", () => {
        state.mobileSetupOpen = !state.mobileSetupOpen;
        syncLayoutState();
        saveState();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    elements.boardSettingsToggle.addEventListener("click", () => {
        openSettingsPanel(true);
    });
    elements.settingsToggle.addEventListener("click", () => openSettingsPanel());
    elements.closeSettings.addEventListener("click", () => openSettingsPanel(false));
    elements.settingsPanel.addEventListener("click", (event) => {
        if (event.target === elements.settingsPanel) {
            openSettingsPanel(false);
        }
    });
    elements.addTimeButton.addEventListener("click", addTimeToPlayer);

    elements.playerConfigList.addEventListener("input", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) {
            return;
        }

        const index = Number(target.dataset.index);
        if (Number.isNaN(index) || !state.players[index]) {
            return;
        }

        if (target.dataset.role === "name") {
            state.players[index].name = target.value.trim() || (state.gameMode === "scythe"
                ? getFactionById(state.players[index].factionId).name
                : `Hráč ${index + 1}`);
            renderAddTimeOptions();
            buildLiveColorControls();
            renderClocks();
        }

        if (target.dataset.role === "color") {
            state.players[index].color = target.value;
            buildLiveColorControls();
            renderClocks();
        }

        if (target.dataset.role === "faction" && target instanceof HTMLSelectElement) {
            const faction = getFactionById(target.value);
            const previousFactionName = getFactionById(state.players[index].factionId).name;
            state.players[index].factionId = faction.id;
            state.players[index].color = faction.color;
            const relatedNameInput = elements.playerConfigList.querySelector(`input[data-role="name"][data-index="${index}"]`);
            if (relatedNameInput instanceof HTMLInputElement && (!relatedNameInput.value.trim() || relatedNameInput.value === previousFactionName)) {
                relatedNameInput.value = faction.name;
                state.players[index].name = faction.name;
            }
            buildPlayerConfig();
            renderAddTimeOptions();
            buildLiveColorControls();
            renderClocks();
        }
    });

    elements.liveColorList.addEventListener("input", (event) => {
        if (state.gameMode === "scythe") {
            return;
        }

        const target = event.target;
        if (!(target instanceof HTMLInputElement)) {
            return;
        }

        const index = Number(target.dataset.liveColor);
        if (Number.isNaN(index) || !state.players[index]) {
            return;
        }

        state.players[index].color = target.value;
        const setupColorInput = elements.playerConfigList.querySelector(`input[data-role="color"][data-index="${index}"]`);
        if (setupColorInput instanceof HTMLInputElement) {
            setupColorInput.value = target.value;
        }

        renderClocks();
    });
}

function init() {
    if (!loadState()) {
        state.players = Array.from({ length: state.playerCount }, (_, index) => createPlayer(index));
    }
    buildPlayerConfig();
    renderAddTimeOptions();
    buildLiveColorControls();
    syncLayoutState();
    renderClocks();
    updateStatus();
    bindEvents();

    if (state.running && !state.paused) {
        startTimer();
    }
}

init();

const MODULE_ID = "dnd-animal-ui";

const SETTINGS = {
  enableTheme: "enableTheme",
  compatMode: "compatMode",
  enableCursor: "enableCursor",
  assetIntensity: "assetIntensity",
  enableButtonPressFx: "enableButtonPressFx",
  enableStickers: "enableStickers",
  enableFolderSoftening: "enableFolderSoftening",
  enableJournalReadability: "enableJournalReadability",
  enableDnd5eCreamTheme: "enableDnd5eCreamTheme",
  enableSidebarVisibility: "enableSidebarVisibility",
  playerSidebarTabs: "playerSidebarTabs",
  customStickers: "customStickers"
};

const BODY_CLASSES = [
  "dnd-animal-ui-enabled",
  "dnd-animal-ui-compat-mode",
  "dnd-animal-ui-cursor-enabled",
  "dnd-animal-ui-button-fx-enabled",
  "dnd-animal-ui-stickers-enabled",
  "dnd-animal-ui-folder-softening-enabled",
  "dnd-animal-ui-journal-readability-enabled",
  "dnd-animal-ui-dnd5e-cream-enabled",
  "dnd-animal-ui-assets-low",
  "dnd-animal-ui-assets-high",
  "dnd-animal-ui-assets-off"
];

const HIDDEN_PLAYER_SIDEBAR_TAB_CLASS = "dnd-animal-ui-hidden-player-sidebar-tab";
const HIDDEN_PLAYER_SIDEBAR_PANEL_CLASS = "dnd-animal-ui-hidden-player-sidebar-panel";

const PRESSABLE_SELECTOR = [
  "button:not(#hotbar button):not(#bg3-hotbar-container button):not(.dnd5e2.sheet.actor button:is(.inspiration, .death-save, .pip))",
  ".button",
  ".control-tool",
  ".scene-control",
  ".playlist-control",
  ".directory .action-buttons button",
  ".sheet-footer button",
  ".dialog-buttons button",
  ".form-footer button",
  ".tabs .item",
  "#sidebar-tabs .item"
].join(",");

const STICKER_CATEGORIES = [
  { id: "all", label: "DNDANIMALUI.Category.All" },
  { id: "emotion", label: "DNDANIMALUI.Category.Emotion" },
  { id: "adventure", label: "DNDANIMALUI.Category.Adventure" },
  { id: "animal", label: "DNDANIMALUI.Category.Animal" }
];

const STICKERS = [
  { id: "duck", label: "DNDANIMALUI.Sticker.Duck", command: "duck", category: "adventure", path: "modules/dnd-animal-ui/assets/stickers/duck.svg" },
  { id: "bear", label: "DNDANIMALUI.Sticker.Bear", command: "hug", category: "emotion", path: "modules/dnd-animal-ui/assets/stickers/bear.svg" },
  { id: "cat", label: "DNDANIMALUI.Sticker.Cat", command: "cat", category: "emotion", path: "modules/dnd-animal-ui/assets/stickers/cat.svg" },
  { id: "frog", label: "DNDANIMALUI.Sticker.Frog", command: "frog", category: "animal", path: "modules/dnd-animal-ui/assets/stickers/frog.svg" },
  { id: "rabbit", label: "DNDANIMALUI.Sticker.Rabbit", command: "rabbit", category: "animal", path: "modules/dnd-animal-ui/assets/stickers/rabbit.svg" },
  { id: "owl", label: "DNDANIMALUI.Sticker.Owl", command: "owl", category: "adventure", path: "modules/dnd-animal-ui/assets/stickers/owl.svg" }
];

const STICKER_CATEGORY_IDS = new Set(STICKER_CATEGORIES.map((category) => category.id));

function getCustomStickers() {
  let configured;
  try {
    configured = getSetting(SETTINGS.customStickers);
  } catch (_error) {
    return [];
  }
  if (!Array.isArray(configured)) return [];

  return configured
    .filter((sticker) => sticker && typeof sticker === "object" && sticker.command && sticker.path)
    .map((sticker, index) => ({
      id: String(sticker.id || `custom-${index}`),
      label: String(sticker.label || sticker.command),
      command: String(sticker.command),
      category: STICKER_CATEGORY_IDS.has(sticker.category) && sticker.category !== "all" ? sticker.category : "animal",
      path: String(sticker.path),
      custom: true
    }));
}

function getAllStickers() {
  const bundled = STICKERS.map((sticker) => ({
    ...sticker,
    label: game.i18n?.localize ? game.i18n.localize(sticker.label) : sticker.label
  }));
  return bundled.concat(getCustomStickers());
}

function findStickerByQuery(query) {
  const normalized = String(query || "").toLowerCase();
  return getAllStickers().find((sticker) => (
    sticker.id.toLowerCase() === normalized
    || sticker.command.toLowerCase() === normalized
    || sticker.label.toLowerCase() === normalized
  ));
}

const SIDEBAR_TABS = [
  { id: "chat", label: "DNDANIMALUI.Tabs.Chat", icon: () => CONFIG.ChatMessage?.sidebarIcon || "fas fa-comments" },
  { id: "combat", label: "DNDANIMALUI.Tabs.Combat", icon: () => CONFIG.Combat?.sidebarIcon || "fas fa-swords" },
  { id: "scenes", label: "DNDANIMALUI.Tabs.Scenes", icon: () => CONFIG.Scene?.sidebarIcon || "fas fa-map" },
  { id: "actors", label: "DNDANIMALUI.Tabs.Actors", icon: () => CONFIG.Actor?.sidebarIcon || "fas fa-user" },
  { id: "items", label: "DNDANIMALUI.Tabs.Items", icon: () => CONFIG.Item?.sidebarIcon || "fas fa-suitcase" },
  { id: "journal", label: "DNDANIMALUI.Tabs.Journal", icon: () => CONFIG.JournalEntry?.sidebarIcon || "fas fa-book-open" },
  { id: "tables", label: "DNDANIMALUI.Tabs.Tables", icon: () => CONFIG.RollTable?.sidebarIcon || "fas fa-th-list" },
  { id: "cards", label: "DNDANIMALUI.Tabs.Cards", icon: () => CONFIG.Cards?.sidebarIcon || "fa-solid fa-cards" },
  { id: "playlists", label: "DNDANIMALUI.Tabs.Playlists", icon: () => CONFIG.Playlist?.sidebarIcon || "fas fa-music" },
  { id: "compendium", label: "DNDANIMALUI.Tabs.Compendium", icon: () => "fas fa-atlas" },
  { id: "settings", label: "DNDANIMALUI.Tabs.Settings", icon: () => "fas fa-cogs" }
];

const DEFAULT_PLAYER_SIDEBAR_TABS = SIDEBAR_TABS.reduce((tabs, tab) => {
  tabs[tab.id] = true;
  return tabs;
}, {});

const SIDEBAR_TABS_BY_ID = new Map(SIDEBAR_TABS.map((tab) => [tab.id, tab]));
const FONT_AWESOME_PREFIXES = ["fa", "fas", "far", "fab", "fa-solid", "fa-regular", "fa-brands"];

function getSetting(key) {
  return game.settings.get(MODULE_ID, key);
}

function getPlayerSidebarTabsSetting() {
  const configured = getSetting(SETTINGS.playerSidebarTabs) || {};
  return { ...DEFAULT_PLAYER_SIDEBAR_TABS, ...configured };
}

function isPlayerSidebarTabVisible(tabId, visibleTabs = getPlayerSidebarTabsSetting()) {
  return visibleTabs[tabId] !== false;
}

function getFontAwesomeClasses(element) {
  if (!element) return [];
  return Array.from(element.classList).filter((className) => (
    FONT_AWESOME_PREFIXES.includes(className) || className.startsWith("fa-")
  ));
}

function getSidebarTabIcon(tabId, tabButton) {
  const knownIcon = SIDEBAR_TABS_BY_ID.get(tabId)?.icon?.();
  if (knownIcon) return knownIcon;

  const iconClasses = getFontAwesomeClasses(tabButton?.querySelector("i"));
  if (iconClasses.length) return iconClasses.join(" ");

  const buttonClasses = getFontAwesomeClasses(tabButton);
  return buttonClasses.length ? buttonClasses.join(" ") : "fas fa-circle";
}

function getSidebarTabLabel(tabId, tabButton) {
  const knownLabel = SIDEBAR_TABS_BY_ID.get(tabId)?.label;
  const labelKey = tabButton?.dataset?.tooltip
    || tabButton?.getAttribute("aria-label")
    || tabButton?.getAttribute("title")
    || tabButton?.textContent?.trim()
    || knownLabel
    || tabId;

  return game.i18n?.localize ? game.i18n.localize(labelKey) : labelKey;
}

// v12 and earlier render sidebar tabs inside #sidebar-tabs; v13 uses #sidebar > nav.tabs buttons.
const SIDEBAR_TAB_BUTTON_SELECTOR = "#sidebar-tabs [data-tab], #sidebar nav.tabs [data-tab]";

function getSidebarTabButtons() {
  const seenTabs = new Set();

  return Array.from(document.querySelectorAll(SIDEBAR_TAB_BUTTON_SELECTOR)).filter((tabButton) => {
    const tabId = tabButton.dataset.tab;

    if (!tabId || seenTabs.has(tabId)) return false;
    if (tabButton.dataset.action === "toggleState") return false;
    if (tabButton.classList.contains("collapse")) return false;

    seenTabs.add(tabId);
    return true;
  });
}

function getSidebarTabsFromDom() {
  return getSidebarTabButtons().map((tabButton, order) => {
    const id = tabButton.dataset.tab;
    return {
      id,
      label: getSidebarTabLabel(id, tabButton),
      icon: getSidebarTabIcon(id, tabButton),
      order
    };
  });
}

function getSidebarTabsForConfig() {
  const configuredTabs = getSetting(SETTINGS.playerSidebarTabs) || {};
  const tabs = new Map();

  for (const tab of getSidebarTabsFromDom()) tabs.set(tab.id, tab);

  for (const [order, tab] of SIDEBAR_TABS.entries()) {
    if (tabs.has(tab.id)) continue;
    tabs.set(tab.id, {
      id: tab.id,
      label: game.i18n?.localize ? game.i18n.localize(tab.label) : tab.label,
      icon: tab.icon?.() || "fas fa-circle",
      order: tabs.size + order
    });
  }

  for (const tabId of Object.keys(configuredTabs)) {
    if (tabs.has(tabId)) continue;
    tabs.set(tabId, {
      id: tabId,
      label: tabId,
      icon: "fas fa-circle",
      order: tabs.size
    });
  }

  return Array.from(tabs.values()).sort((a, b) => a.order - b.order);
}

function getDataTabElements(root, tabId) {
  if (!root) return [];
  return Array.from(root.querySelectorAll("[data-tab]")).filter((element) => element.dataset.tab === tabId);
}

function getSidebarTabContainer(tabButton) {
  return tabButton.closest("li") || tabButton;
}

function clearPlayerSidebarTabVisibility() {
  document.querySelectorAll(`.${HIDDEN_PLAYER_SIDEBAR_TAB_CLASS}`).forEach((element) => {
    element.classList.remove(HIDDEN_PLAYER_SIDEBAR_TAB_CLASS);
  });

  document.querySelectorAll(`.${HIDDEN_PLAYER_SIDEBAR_PANEL_CLASS}`).forEach((element) => {
    element.classList.remove(HIDDEN_PLAYER_SIDEBAR_PANEL_CLASS);
  });
}

function getActiveSidebarTabId() {
  const activeButton = document.querySelector(
    "#sidebar-tabs [data-tab].active, #sidebar-tabs [data-tab][aria-selected='true'], "
    + "#sidebar nav.tabs [data-tab].active, #sidebar nav.tabs [data-tab][aria-pressed='true']"
  );

  return activeButton?.dataset?.tab
    || ui.sidebar?.tabGroups?.primary
    || ui.sidebar?.activeTab;
}

function activateFirstVisibleSidebarTab(visibleTabs) {
  const activeTab = getActiveSidebarTabId();

  if (!activeTab || isPlayerSidebarTabVisible(activeTab, visibleTabs)) return;

  const sidebarTabs = getSidebarTabsFromDom();
  const firstVisible = (sidebarTabs.length ? sidebarTabs : SIDEBAR_TABS)
    .find((tab) => isPlayerSidebarTabVisible(tab.id, visibleTabs))?.id;
  if (!firstVisible) return;

  if (ui.sidebar?.changeTab) {
    ui.sidebar.changeTab(firstVisible, "primary");
    return;
  }

  if (ui.sidebar?.activateTab) {
    ui.sidebar.activateTab(firstVisible);
    return;
  }

  getDataTabElements(document.querySelector("#sidebar-tabs"), firstVisible)[0]?.click();
}

function applyPlayerSidebarTabVisibility() {
  if (!game.ready) return;

  clearPlayerSidebarTabVisibility();

  if (!getSetting(SETTINGS.enableTheme) || !getSetting(SETTINGS.enableSidebarVisibility)) return;
  if (game.user?.isGM) return;

  const visibleTabs = getPlayerSidebarTabsSetting();
  const hiddenTabs = Object.entries(visibleTabs)
    .filter(([_tabId, isVisible]) => isVisible === false)
    .map(([tabId]) => tabId);

  for (const tabButton of getSidebarTabButtons()) {
    if (isPlayerSidebarTabVisible(tabButton.dataset.tab, visibleTabs)) continue;
    getSidebarTabContainer(tabButton).classList.add(HIDDEN_PLAYER_SIDEBAR_TAB_CLASS);
  }

  for (const tabId of hiddenTabs) {
    getDataTabElements(document.querySelector("#sidebar-content"), tabId).forEach((panel) => {
      panel.classList.add(HIDDEN_PLAYER_SIDEBAR_PANEL_CLASS);
    });

    getDataTabElements(document.querySelector("#sidebar"), tabId).forEach((panel) => {
      if (panel.closest("#sidebar-tabs")) return;
      panel.classList.add(HIDDEN_PLAYER_SIDEBAR_PANEL_CLASS);
    });
  }

  activateFirstVisibleSidebarTab(visibleTabs);
}

function applyThemeState() {
  const body = document.body;
  if (!body) return;

  body.classList.remove(...BODY_CLASSES);

  if (!getSetting(SETTINGS.enableTheme)) {
    clearPlayerSidebarTabVisibility();
    removeStickerButton();
    return;
  }

  body.classList.add("dnd-animal-ui-enabled");

  const compatMode = getSetting(SETTINGS.compatMode);
  if (compatMode) body.classList.add("dnd-animal-ui-compat-mode");

  if (getSetting(SETTINGS.enableCursor)) body.classList.add("dnd-animal-ui-cursor-enabled");
  if (!compatMode && getSetting(SETTINGS.enableButtonPressFx)) body.classList.add("dnd-animal-ui-button-fx-enabled");
  if (getSetting(SETTINGS.enableStickers)) body.classList.add("dnd-animal-ui-stickers-enabled");
  if (!compatMode && getSetting(SETTINGS.enableFolderSoftening)) body.classList.add("dnd-animal-ui-folder-softening-enabled");
  if (!compatMode && getSetting(SETTINGS.enableJournalReadability)) body.classList.add("dnd-animal-ui-journal-readability-enabled");
  if (!compatMode && getSetting(SETTINGS.enableDnd5eCreamTheme)) body.classList.add("dnd-animal-ui-dnd5e-cream-enabled");

  const intensity = compatMode ? "low" : (getSetting(SETTINGS.assetIntensity) || "high");
  body.classList.add(`dnd-animal-ui-assets-${intensity}`);

  applyPlayerSidebarTabVisibility();
  injectStickerButton();
}

// dnd5e 5.x picks its palette from .theme-light/.theme-dark classes. The cream
// theme repaints the light branch, so sheets must always take it — even when
// the user's global Foundry theme is dark.
function isCreamThemeActive() {
  try {
    return getSetting(SETTINGS.enableTheme)
      && !getSetting(SETTINGS.compatMode)
      && getSetting(SETTINGS.enableDnd5eCreamTheme);
  } catch (_error) {
    return false;
  }
}

function forceDnd5eLightTheme(element) {
  if (!isCreamThemeActive()) return;
  const el = element instanceof HTMLElement ? element : element?.[0];
  if (!el?.classList?.contains("dnd5e2")) return;
  el.classList.add("themed", "theme-light");
  el.classList.remove("theme-dark");
}

function createLeafPop(target) {
  if (!document.body?.classList.contains("dnd-animal-ui-button-fx-enabled")) return;

  const rect = target.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const pop = document.createElement("span");
  pop.className = "dnd-animal-ui-leaf-pop";
  pop.style.left = `${Math.min(Math.max(rect.left + (rect.width / 2), 20), window.innerWidth - 20)}px`;
  pop.style.top = `${Math.min(Math.max(rect.top + (rect.height / 2), 20), window.innerHeight - 20)}px`;
  document.body.append(pop);

  window.setTimeout(() => pop.remove(), 700);
}

function getChatForm() {
  return document.querySelector("#chat-form") || document.querySelector("#chat-controls")?.closest("form");
}

// v13 moves #chat-message and #chat-controls between containers when the sidebar
// collapses/expands or chat pops out, so the sticker dock lives inside #chat-controls
// and travels with it instead of wrapping the input element.
function getStickerMount() {
  return document.getElementById("chat-controls") || getChatForm();
}

function closeStickerPanels(exceptPanel = null) {
  document.querySelectorAll(".dnd-animal-ui-sticker-panel").forEach((panel) => {
    if (panel !== exceptPanel) panel.classList.remove("open");
  });
}

function removeStickerButton() {
  document.querySelectorAll(".dnd-animal-ui-sticker-dock").forEach((dock) => dock.remove());

  // Clean up the <=0.3.1 input wrapper if it is still in the DOM.
  document.querySelectorAll(".dnd-animal-ui-chat-input-wrap").forEach((wrap) => {
    while (wrap.firstChild) wrap.parentElement?.insertBefore(wrap.firstChild, wrap);
    wrap.remove();
  });

  document.querySelectorAll(".dnd-animal-ui-chat-message-input").forEach((input) => {
    input.classList.remove("dnd-animal-ui-chat-message-input");
  });
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[ch]));
}

async function sendSticker(sticker) {
  const content = `
    <div class="dnd-animal-ui-chat-sticker-card" data-sticker-id="${escapeHTML(sticker.id)}">
      <span class="dnd-animal-ui-chat-sticker-chip">${escapeHTML(getStickerCategoryLabel(sticker.category))}</span>
      <img src="${escapeHTML(sticker.path)}" alt="${escapeHTML(sticker.label)}">
      <span>${escapeHTML(sticker.label)}</span>
    </div>
  `;

  const messageData = {
    speaker: ChatMessage.getSpeaker({ actor: game.user.character }),
    content
  };

  // ChatMessage#user was renamed to #author in v12.
  if ((game.release?.generation ?? 0) >= 12) messageData.author = game.user.id;
  else messageData.user = game.user.id;

  await ChatMessage.create(messageData);
}

function getStickerCategoryLabel(categoryId) {
  const label = STICKER_CATEGORIES.find((category) => category.id === categoryId)?.label
    || "DNDANIMALUI.Category.All";
  return game.i18n?.localize ? game.i18n.localize(label) : label;
}

function filterStickerPanel(panel, categoryId) {
  panel.dataset.activeCategory = categoryId;

  panel.querySelectorAll(".dnd-animal-ui-sticker-tab").forEach((tab) => {
    const active = tab.dataset.categoryId === categoryId;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-pressed", active ? "true" : "false");
  });

  panel.querySelectorAll(".dnd-animal-ui-sticker-option").forEach((option) => {
    const visible = categoryId === "all" || option.dataset.categoryId === categoryId;
    option.hidden = !visible;
  });
}

function buildStickerPanel() {
  const panel = document.createElement("div");
  panel.className = "dnd-animal-ui-sticker-panel";
  panel.dataset.activeCategory = "all";

  const tabs = document.createElement("div");
  tabs.className = "dnd-animal-ui-sticker-tabs";

  for (const category of STICKER_CATEGORIES) {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "dnd-animal-ui-sticker-tab";
    tab.dataset.categoryId = category.id;
    tab.textContent = game.i18n.localize(category.label);
    tab.setAttribute("aria-pressed", category.id === "all" ? "true" : "false");
    tab.addEventListener("click", () => filterStickerPanel(panel, category.id));
    tabs.append(tab);
  }

  const grid = document.createElement("div");
  grid.className = "dnd-animal-ui-sticker-grid";

  for (const sticker of getAllStickers()) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dnd-animal-ui-sticker-option";
    button.dataset.stickerId = sticker.id;
    button.dataset.categoryId = sticker.category;
    button.title = sticker.label;
    button.innerHTML = `<img src="${escapeHTML(sticker.path)}" alt=""><span>${escapeHTML(sticker.label)}</span><small>/${escapeHTML(sticker.command)}</small>`;
    button.addEventListener("click", async () => {
      panel.classList.remove("open");
      await sendSticker(sticker);
    });
    grid.append(button);
  }

  panel.append(tabs, grid);
  filterStickerPanel(panel, "all");
  return panel;
}

function parseStickerCommand(content) {
  const match = String(content || "").trim().match(/^\/(?:sticker|表情)\s+(.+)$/i);
  if (!match) return null;

  const query = match[1].trim();
  return {
    query,
    sticker: findStickerByQuery(query)
  };
}

function handleStickerCommand(_chatLog, content) {
  if (!getSetting(SETTINGS.enableTheme) || !getSetting(SETTINGS.enableStickers)) return true;

  const command = parseStickerCommand(content);
  if (!command) return true;

  if (!command.sticker) {
    const options = getAllStickers().map((sticker) => `/${sticker.command}`).join(" ");
    ui.notifications?.warn(game.i18n.format("DNDANIMALUI.Notify.UnknownSticker", {
      query: command.query,
      options
    }));
    return false;
  }

  void sendSticker(command.sticker);
  return false;
}

function injectStickerButton() {
  if (!game.ready || !getSetting(SETTINGS.enableTheme) || !getSetting(SETTINGS.enableStickers)) {
    removeStickerButton();
    return;
  }

  const mount = getStickerMount();
  if (!mount) return;

  const existing = document.querySelector(".dnd-animal-ui-sticker-dock");
  if (existing) {
    if (existing.parentElement === mount) return;
    existing.remove();
  }

  const wrapper = document.createElement("div");
  wrapper.className = "dnd-animal-ui-sticker-dock";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "dnd-animal-ui-sticker-button";
  button.title = game.i18n.localize("DNDANIMALUI.StickerButtonTitle");
  button.innerHTML = `<img src="modules/dnd-animal-ui/assets/stickers/duck.svg" alt="">`;

  const panel = buildStickerPanel();
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    panel.classList.toggle("open");
    closeStickerPanels(panel);
  });

  wrapper.append(button, panel);
  mount.append(wrapper);
}

class DndAnimalThemeConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "dnd-animal-ui-theme-config",
      title: game.i18n.localize("DNDANIMALUI.Config.Title"),
      template: "modules/dnd-animal-ui/templates/theme-config.hbs",
      width: 560,
      classes: ["dnd-animal-ui-theme-config-window"]
    });
  }

  getData() {
    const visibleTabs = getPlayerSidebarTabsSetting();
    const assetIntensity = getSetting(SETTINGS.assetIntensity);
    const categoryOptions = STICKER_CATEGORIES
      .filter((category) => category.id !== "all")
      .map((category) => ({ value: category.id, label: game.i18n.localize(category.label) }));

    return {
      isGM: game.user.isGM,
      enableTheme: getSetting(SETTINGS.enableTheme),
      compatMode: getSetting(SETTINGS.compatMode),
      enableCursor: getSetting(SETTINGS.enableCursor),
      enableButtonPressFx: getSetting(SETTINGS.enableButtonPressFx),
      enableStickers: getSetting(SETTINGS.enableStickers),
      enableFolderSoftening: getSetting(SETTINGS.enableFolderSoftening),
      enableJournalReadability: getSetting(SETTINGS.enableJournalReadability),
      enableDnd5eCreamTheme: getSetting(SETTINGS.enableDnd5eCreamTheme),
      enableSidebarVisibility: getSetting(SETTINGS.enableSidebarVisibility),
      assetIntensityOptions: [
        { value: "high", label: game.i18n.localize("DNDANIMALUI.Settings.AssetIntensity.ChoiceHigh"), selected: assetIntensity === "high" },
        { value: "low", label: game.i18n.localize("DNDANIMALUI.Settings.AssetIntensity.ChoiceLow"), selected: assetIntensity === "low" },
        { value: "off", label: game.i18n.localize("DNDANIMALUI.Settings.AssetIntensity.ChoiceOff"), selected: assetIntensity === "off" }
      ],
      customStickers: getCustomStickers().map((sticker) => ({
        ...sticker,
        categoryOptions: categoryOptions.map((option) => ({
          ...option,
          selected: option.value === sticker.category
        }))
      })),
      tabs: getSidebarTabsForConfig().map((tab) => ({
        ...tab,
        checked: isPlayerSidebarTabVisible(tab.id, visibleTabs)
      }))
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find("[data-action='select-all']").on("click", () => {
      html.find("input[data-sidebar-tab-id]").prop("checked", true);
    });

    html.find("[data-action='select-none']").on("click", () => {
      html.find("input[data-sidebar-tab-id]").prop("checked", false);
    });

    html.find("[data-action='hide-compendium']").on("click", () => {
      html.find("input[data-sidebar-tab-id]").prop("checked", true);
      html.find("input[data-sidebar-tab-id='compendium']").prop("checked", false);
    });

    html.find("[data-action='add-sticker']").on("click", (event) => {
      event.preventDefault();
      this._addStickerRow(html[0]?.querySelector(".dnd-animal-ui-custom-sticker-list"));
    });

    html.on("click", "[data-action='delete-sticker']", (event) => {
      event.preventDefault();
      event.currentTarget.closest("[data-custom-sticker-row]")?.remove();
    });

    html.on("click", "[data-action='pick-sticker-image']", (event) => {
      event.preventDefault();
      const row = event.currentTarget.closest("[data-custom-sticker-row]");
      const input = row?.querySelector("[data-sticker-field='path']");
      if (!input) return;

      const PickerClass = foundry.applications?.apps?.FilePicker?.implementation
        || foundry.applications?.apps?.FilePicker
        || globalThis.FilePicker;
      new PickerClass({
        type: "image",
        current: input.value || "",
        callback: (path) => {
          input.value = path;
        }
      }).render(true);
    });
  }

  _addStickerRow(list) {
    if (!list) return;

    const row = document.createElement("div");
    row.className = "dnd-animal-ui-custom-sticker-row";
    row.dataset.customStickerRow = "";

    const makeTextInput = (field, placeholderKey) => {
      const input = document.createElement("input");
      input.type = "text";
      input.dataset.stickerField = field;
      input.placeholder = game.i18n.localize(placeholderKey);
      return input;
    };

    const select = document.createElement("select");
    select.dataset.stickerField = "category";
    for (const category of STICKER_CATEGORIES) {
      if (category.id === "all") continue;
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = game.i18n.localize(category.label);
      select.append(option);
    }
    select.value = "animal";

    const makeIconButton = (action, icon, titleKey) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.action = action;
      button.title = game.i18n.localize(titleKey);
      button.innerHTML = `<i class="${icon}"></i>`;
      return button;
    };

    row.append(
      makeTextInput("label", "DNDANIMALUI.Config.StickerLabel"),
      makeTextInput("command", "DNDANIMALUI.Config.StickerCommand"),
      select,
      makeTextInput("path", "DNDANIMALUI.Config.StickerImage"),
      makeIconButton("pick-sticker-image", "fas fa-file-image", "DNDANIMALUI.Config.Browse"),
      makeIconButton("delete-sticker", "fas fa-trash", "DNDANIMALUI.Config.Delete")
    );
    list.append(row);
  }

  _collectCustomStickers(form) {
    const stickers = [];
    const seenCommands = new Set(STICKERS.map((sticker) => sticker.command.toLowerCase()));

    for (const row of form.querySelectorAll("[data-custom-sticker-row]")) {
      const getField = (field) => row.querySelector(`[data-sticker-field='${field}']`)?.value?.trim() || "";
      const command = getField("command").replace(/^\//, "").toLowerCase();
      const path = getField("path");
      if (!command || !path) continue;

      if (seenCommands.has(command)) {
        ui.notifications?.warn(game.i18n.format("DNDANIMALUI.Notify.DuplicateStickerCommand", { command }));
        continue;
      }

      seenCommands.add(command);
      stickers.push({
        id: `custom-${command}`,
        label: getField("label") || command,
        command,
        category: getField("category") || "animal",
        path
      });
    }

    return stickers;
  }

  async _updateObject(event) {
    const form = this.form || event?.currentTarget;

    // Personal client-scope preferences: every player may save these.
    await game.settings.set(MODULE_ID, SETTINGS.enableCursor, form.enableCursor.checked);
    await game.settings.set(MODULE_ID, SETTINGS.enableButtonPressFx, form.enableButtonPressFx.checked);
    await game.settings.set(MODULE_ID, SETTINGS.assetIntensity, form.assetIntensity.value);

    if (game.user.isGM) {
      const visibleTabs = {};
      for (const input of form.querySelectorAll("[data-sidebar-tab-id]")) {
        visibleTabs[input.dataset.sidebarTabId] = input.checked;
      }

      if (Object.keys(visibleTabs).length && !Object.values(visibleTabs).some(Boolean)) {
        const fallbackTab = visibleTabs.chat !== undefined ? "chat" : Object.keys(visibleTabs)[0];
        if (fallbackTab) visibleTabs[fallbackTab] = true;
        ui.notifications?.warn(game.i18n.localize("DNDANIMALUI.Notify.KeepOneTab"));
      }

      await game.settings.set(MODULE_ID, SETTINGS.enableTheme, form.enableTheme.checked);
      await game.settings.set(MODULE_ID, SETTINGS.compatMode, form.compatMode.checked);
      await game.settings.set(MODULE_ID, SETTINGS.enableStickers, form.enableStickers.checked);
      await game.settings.set(MODULE_ID, SETTINGS.enableFolderSoftening, form.enableFolderSoftening.checked);
      await game.settings.set(MODULE_ID, SETTINGS.enableJournalReadability, form.enableJournalReadability.checked);
      await game.settings.set(MODULE_ID, SETTINGS.enableDnd5eCreamTheme, form.enableDnd5eCreamTheme.checked);
      await game.settings.set(MODULE_ID, SETTINGS.enableSidebarVisibility, form.enableSidebarVisibility.checked);
      await game.settings.set(MODULE_ID, SETTINGS.playerSidebarTabs, visibleTabs);
      await game.settings.set(MODULE_ID, SETTINGS.customStickers, this._collectCustomStickers(form));
    }

    applyThemeState();
  }
}

function refreshStickerDock() {
  removeStickerButton();
  if (game.ready) applyThemeState();
}

function registerSettings() {
  game.settings.register(MODULE_ID, SETTINGS.enableTheme, {
    name: "DNDANIMALUI.Settings.EnableTheme.Name",
    hint: "DNDANIMALUI.Settings.EnableTheme.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.compatMode, {
    name: "DNDANIMALUI.Settings.CompatMode.Name",
    hint: "DNDANIMALUI.Settings.CompatMode.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: false,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableCursor, {
    name: "DNDANIMALUI.Settings.EnableCursor.Name",
    hint: "DNDANIMALUI.Settings.EnableCursor.Hint",
    scope: "client",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.assetIntensity, {
    name: "DNDANIMALUI.Settings.AssetIntensity.Name",
    hint: "DNDANIMALUI.Settings.AssetIntensity.Hint",
    scope: "client",
    config: false,
    type: String,
    choices: {
      high: "DNDANIMALUI.Settings.AssetIntensity.ChoiceHigh",
      low: "DNDANIMALUI.Settings.AssetIntensity.ChoiceLow",
      off: "DNDANIMALUI.Settings.AssetIntensity.ChoiceOff"
    },
    default: "high",
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableButtonPressFx, {
    name: "DNDANIMALUI.Settings.EnableButtonPressFx.Name",
    hint: "DNDANIMALUI.Settings.EnableButtonPressFx.Hint",
    scope: "client",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableStickers, {
    name: "DNDANIMALUI.Settings.EnableStickers.Name",
    hint: "DNDANIMALUI.Settings.EnableStickers.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.customStickers, {
    name: "DNDANIMALUI.Settings.CustomStickers.Name",
    scope: "world",
    config: false,
    type: Array,
    default: [],
    onChange: refreshStickerDock
  });

  game.settings.register(MODULE_ID, SETTINGS.enableFolderSoftening, {
    name: "DNDANIMALUI.Settings.EnableFolderSoftening.Name",
    hint: "DNDANIMALUI.Settings.EnableFolderSoftening.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableJournalReadability, {
    name: "DNDANIMALUI.Settings.EnableJournalReadability.Name",
    hint: "DNDANIMALUI.Settings.EnableJournalReadability.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableDnd5eCreamTheme, {
    name: "DNDANIMALUI.Settings.EnableDnd5eCreamTheme.Name",
    hint: "DNDANIMALUI.Settings.EnableDnd5eCreamTheme.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableSidebarVisibility, {
    name: "DNDANIMALUI.Settings.EnableSidebarVisibility.Name",
    hint: "DNDANIMALUI.Settings.EnableSidebarVisibility.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.playerSidebarTabs, {
    name: "DNDANIMALUI.Settings.PlayerSidebarTabs.Name",
    scope: "world",
    config: false,
    type: Object,
    default: DEFAULT_PLAYER_SIDEBAR_TABS,
    onChange: applyPlayerSidebarTabVisibility
  });

  game.settings.registerMenu(MODULE_ID, "themeConfig", {
    name: "DNDANIMALUI.Menu.Name",
    label: "DNDANIMALUI.Menu.Label",
    hint: "DNDANIMALUI.Menu.Hint",
    icon: "fas fa-leaf",
    type: DndAnimalThemeConfig,
    restricted: false
  });
}

Hooks.once("init", registerSettings);
Hooks.once("ready", () => {
  applyThemeState();
  injectStickerButton();
});
Hooks.on("renderSidebar", applyPlayerSidebarTabVisibility);
Hooks.on("renderChatLog", injectStickerButton);
Hooks.on("renderChatInput", injectStickerButton);
Hooks.on("chatMessage", handleStickerCommand);
Hooks.on("collapseSidebar", applyPlayerSidebarTabVisibility);
Hooks.on("renderApplicationV2", (_app, element) => forceDnd5eLightTheme(element));
Hooks.on("renderChatMessageHTML", (_message, html) => forceDnd5eLightTheme(html));
Hooks.on("updateSetting", (setting) => {
  const key = setting?.key || setting?.id;
  if (!key?.startsWith(`${MODULE_ID}.`)) return;
  applyThemeState();
});

document.addEventListener(
  "click",
  (event) => {
    if (!document.body?.classList.contains("dnd-animal-ui-button-fx-enabled")) return;

    const target = event.target.closest(PRESSABLE_SELECTOR);
    if (!target) return;
    if (target.closest(".dnd5e2.sheet, .window-app.dnd5e2, .application.dnd5e2")) return;

    target.classList.remove("dnd-animal-ui-pressing");
    void target.offsetWidth;
    target.classList.add("dnd-animal-ui-pressing");
    createLeafPop(target);

    window.setTimeout(() => {
      target.classList.remove("dnd-animal-ui-pressing");
    }, 420);
  },
  true
);

document.addEventListener("click", (event) => {
  if (event.target.closest(".dnd-animal-ui-sticker-dock")) return;
  closeStickerPanels();
});

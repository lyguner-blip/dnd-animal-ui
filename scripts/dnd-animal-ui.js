const MODULE_ID = "dnd-animal-ui";

const SETTINGS = {
  enableTheme: "enableTheme",
  enableCursor: "enableCursor",
  assetIntensity: "assetIntensity",
  enableButtonPressFx: "enableButtonPressFx",
  enableSidebarVisibility: "enableSidebarVisibility",
  playerSidebarTabs: "playerSidebarTabs"
};

const BODY_CLASSES = [
  "dnd-animal-ui-enabled",
  "dnd-animal-ui-cursor-enabled",
  "dnd-animal-ui-button-fx-enabled",
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

const SIDEBAR_TABS = [
  { id: "chat", label: "聊天", icon: () => CONFIG.ChatMessage?.sidebarIcon || "fas fa-comments" },
  { id: "combat", label: "战斗", icon: () => CONFIG.Combat?.sidebarIcon || "fas fa-swords" },
  { id: "scenes", label: "场景", icon: () => CONFIG.Scene?.sidebarIcon || "fas fa-map" },
  { id: "actors", label: "角色", icon: () => CONFIG.Actor?.sidebarIcon || "fas fa-user" },
  { id: "items", label: "物品", icon: () => CONFIG.Item?.sidebarIcon || "fas fa-suitcase" },
  { id: "journal", label: "日志", icon: () => CONFIG.JournalEntry?.sidebarIcon || "fas fa-book-open" },
  { id: "tables", label: "掷骰表", icon: () => CONFIG.RollTable?.sidebarIcon || "fas fa-th-list" },
  { id: "cards", label: "卡牌", icon: () => CONFIG.Cards?.sidebarIcon || "fa-solid fa-cards" },
  { id: "playlists", label: "播放列表", icon: () => CONFIG.Playlist?.sidebarIcon || "fas fa-music" },
  { id: "compendium", label: "合集包", icon: () => "fas fa-atlas" },
  { id: "settings", label: "设置", icon: () => "fas fa-cogs" }
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

function getSidebarTabButtons() {
  const seenTabs = new Set();

  return Array.from(document.querySelectorAll("#sidebar-tabs [data-tab]")).filter((tabButton) => {
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
      label: tab.label,
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

function activateFirstVisibleSidebarTab(visibleTabs) {
  const activeTab = document.querySelector("#sidebar-tabs [data-tab].active, #sidebar-tabs [data-tab][aria-selected='true']")?.dataset?.tab
    || ui.sidebar?.activeTab;

  if (!activeTab || isPlayerSidebarTabVisible(activeTab, visibleTabs)) return;

  const sidebarTabs = getSidebarTabsFromDom();
  const firstVisible = (sidebarTabs.length ? sidebarTabs : SIDEBAR_TABS)
    .find((tab) => isPlayerSidebarTabVisible(tab.id, visibleTabs))?.id;
  if (!firstVisible) return;

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
    return;
  }

  body.classList.add("dnd-animal-ui-enabled");

  if (getSetting(SETTINGS.enableCursor)) body.classList.add("dnd-animal-ui-cursor-enabled");
  if (getSetting(SETTINGS.enableButtonPressFx)) body.classList.add("dnd-animal-ui-button-fx-enabled");

  const intensity = getSetting(SETTINGS.assetIntensity) || "high";
  body.classList.add(`dnd-animal-ui-assets-${intensity}`);

  applyPlayerSidebarTabVisibility();
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

class DndAnimalThemeConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "dnd-animal-ui-theme-config",
      title: "DND 动物岛 UI 设置",
      template: "modules/dnd-animal-ui/templates/theme-config.hbs",
      width: 560,
      classes: ["dnd-animal-ui-theme-config-window"]
    });
  }

  getData() {
    const visibleTabs = getPlayerSidebarTabsSetting();
    const assetIntensity = getSetting(SETTINGS.assetIntensity);

    return {
      enableTheme: getSetting(SETTINGS.enableTheme),
      enableCursor: getSetting(SETTINGS.enableCursor),
      enableButtonPressFx: getSetting(SETTINGS.enableButtonPressFx),
      enableSidebarVisibility: getSetting(SETTINGS.enableSidebarVisibility),
      assetIntensityOptions: [
        { value: "high", label: "高还原", selected: assetIntensity === "high" },
        { value: "low", label: "轻量", selected: assetIntensity === "low" },
        { value: "off", label: "关闭素材", selected: assetIntensity === "off" }
      ],
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
  }

  async _updateObject(event) {
    const form = event.currentTarget;
    const visibleTabs = {};

    for (const input of form.querySelectorAll("[data-sidebar-tab-id]")) {
      visibleTabs[input.dataset.sidebarTabId] = input.checked;
    }

    if (!Object.values(visibleTabs).some(Boolean)) {
      const fallbackTab = visibleTabs.chat !== undefined ? "chat" : Object.keys(visibleTabs)[0];
      if (fallbackTab) visibleTabs[fallbackTab] = true;
      ui.notifications?.warn("至少需要保留一个玩家可见的右侧栏。已自动保留一个栏目。");
    }

    await game.settings.set(MODULE_ID, SETTINGS.enableTheme, form.enableTheme.checked);
    await game.settings.set(MODULE_ID, SETTINGS.enableCursor, form.enableCursor.checked);
    await game.settings.set(MODULE_ID, SETTINGS.enableButtonPressFx, form.enableButtonPressFx.checked);
    await game.settings.set(MODULE_ID, SETTINGS.enableSidebarVisibility, form.enableSidebarVisibility.checked);
    await game.settings.set(MODULE_ID, SETTINGS.assetIntensity, form.assetIntensity.value);
    await game.settings.set(MODULE_ID, SETTINGS.playerSidebarTabs, visibleTabs);

    applyThemeState();
  }
}

function registerSettings() {
  game.settings.register(MODULE_ID, SETTINGS.enableTheme, {
    name: "启用主题",
    hint: "开启 DND 动物岛 UI 全局主题。",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableCursor, {
    name: "动物岛光标",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.assetIntensity, {
    name: "素材强度",
    scope: "world",
    config: false,
    type: String,
    choices: {
      high: "高还原",
      low: "轻量",
      off: "关闭素材"
    },
    default: "high",
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableButtonPressFx, {
    name: "按钮按压动效",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.enableSidebarVisibility, {
    name: "玩家右侧栏可见项",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });

  game.settings.register(MODULE_ID, SETTINGS.playerSidebarTabs, {
    name: "玩家右侧栏可见项数据",
    scope: "world",
    config: false,
    type: Object,
    default: DEFAULT_PLAYER_SIDEBAR_TABS,
    onChange: applyPlayerSidebarTabVisibility
  });

  game.settings.registerMenu(MODULE_ID, "themeConfig", {
    name: "DND 动物岛 UI",
    label: "配置",
    hint: "配置动物岛主题、光标、素材强度、按钮动效和非 GM 玩家右侧栏可见项。",
    icon: "fas fa-leaf",
    type: DndAnimalThemeConfig,
    restricted: true
  });
}

Hooks.once("init", registerSettings);
Hooks.once("ready", applyThemeState);
Hooks.on("renderSidebar", applyPlayerSidebarTabVisibility);
Hooks.on("collapseSidebar", applyPlayerSidebarTabVisibility);
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

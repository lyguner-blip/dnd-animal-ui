# dnd5e 卡片奶油主题（Cream Sheets）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 dnd5e 5.x 卡片（PC/NPC/物品）、核心随机表、合集浏览器、聊天掷骰卡和原生宏栏全面奶油化，消灭"亮壳深芯"色差。

**Architecture:** dnd5e 5.x 的卡片配色全部经由 CSS 自定义属性（`--dnd5e-color-*` 基础调色板 + `--dnd5e-application-background`/`--dnd5e-character-header-image` 等应用层钩子变量，定义在 `body.theme-light .dnd5e2` / `.themed.theme-light.dnd5e2`）。本计划：① JS 给 dnd5e 窗口强制补 `themed theme-light` 类走亮色分支；② 新建 `styles/dnd-animal-sheets.css`，在 `body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled` 作用域内重映射这两层变量（特异性 0,3,1 > 系统的 0,3,0，必胜）；③ 对七个目标逐个精修。旧的"sheet-safety 深色面板"规则全部删除，两个旧设置合并为一个 `enableDnd5eCreamTheme`。

**Tech Stack:** 纯 CSS + 原生 JS（无构建步骤），Foundry VTT v13.351 + dnd5e 5.3.3。无测试运行器——验证 = `node --check` + JSON 解析 + Foundry F5 手测检查点。

**Spec:** `docs/superpowers/specs/2026-06-10-dnd5e-cream-sheets-design.md`

**工作目录：** `D:\fvtt\Data\modules\dnd-animal-ui`（下文相对路径均以此为根）

**关键事实（实现者必读）：**
- dnd5e 亮色变量块定义在 `body.theme-light .dnd5e2` 和 `.themed.theme-light.dnd5e2`（见 `D:\fvtt\Data\systems\dnd5e\dnd5e.css`，grep `theme-light`）。给窗口元素同时加 `themed theme-light` 类即可强制亮色分支，无论 Foundry 全局主题。
- 应用层钩子变量（亮色分支里可整体覆盖）：`--dnd5e-application-background`、`--dnd5e-character-header-image`、`--dnd5e-character-body-image`、`--dnd5e-npc-header-image/content`、`--dnd5e-item-header-image/content`、`--dnd5e-card-header-1/2`、`--dnd5e-border-gold`、`--dnd5e-inventory-border`、`--dnd5e-ability-tab`、`--dnd5e-gold-icon-background`、`--filigree-background-color`、`--filigree-border-color`、`--color-text-primary/secondary/emphatic/title`、`--separated-list-item-background-color/border-color`。
- **CSS 变量里的 `url()` 必须写绝对路径**（`/modules/dnd-animal-ui/assets/...`）：相对路径按"定义处样式表"解析，行为有历史差异，绝对路径最稳。
- v13 宏栏 DOM：`#hotbar #action-bar .slot`（含 `.key` 编号、`.slot-icon`）、`#hotbar #hotbar-page-controls .hotbar-page-control`、`.hotbar-page-number`、`#hotbar .hotbar-controls button`。
- v13 随机表 DOM：`.roll-table-sheet table`，行内 `td.image > img`、`td.details > strong.name`、`td.controls`。
- 主题色板（来自 `styles/dnd-animal-ui.css` 的 `:root`）：奶油纸 `rgb(247,243,223)`、米杏 `#f0e8d8`、暖白 `#fffdf2`、棕标题 `#794f27`、棕正文 `#725d42`、青绿 `#19c8b9`（active `#11a89b`）、暖黄 `#f7cd67`、珊瑚 `#f8a6b2`、亮绿 `#6fba2c`、暖橙 `#e59266`、描边棕 `rgba(159,146,125,…)`、阴影 `#bdaea0`。
- F5 检查点需要真人看 Foundry 界面。重启命令：`C:\Users\WINDOWS\Desktop\restart-fvtt.ps1 -Silent`（会提示活动会话）。改 CSS 后通常浏览器 F5 即可，不必重启服务。

---

### Task 1: 设置迁移 — 合并两个旧开关为 `enableDnd5eCreamTheme`

**Files:**
- Modify: `scripts/dnd-animal-ui.js`（SETTINGS、BODY_CLASSES、applyThemeState、getData、_updateObject、registerSettings）
- Modify: `templates/theme-config.hbs:50-64`
- Modify: `lang/zh-cn.json:67-74`、`lang/en.json:67-74`

- [ ] **Step 1.1: 替换 SETTINGS 键**

`scripts/dnd-animal-ui.js:12-13`，把：

```js
  enableDnd5eSheetSafety: "enableDnd5eSheetSafety",
  enableDnd5eAnimalBackground: "enableDnd5eAnimalBackground",
```

替换为：

```js
  enableDnd5eCreamTheme: "enableDnd5eCreamTheme",
```

- [ ] **Step 1.2: 替换 BODY_CLASSES 项**

`scripts/dnd-animal-ui.js:27-28`，把：

```js
  "dnd-animal-ui-dnd5e-sheet-safety-enabled",
  "dnd-animal-ui-dnd5e-animal-background-enabled",
```

替换为：

```js
  "dnd-animal-ui-dnd5e-cream-enabled",
```

- [ ] **Step 1.3: 替换 applyThemeState 中的类挂载**

`scripts/dnd-animal-ui.js:338-339`，把：

```js
  if (getSetting(SETTINGS.enableDnd5eSheetSafety)) body.classList.add("dnd-animal-ui-dnd5e-sheet-safety-enabled");
  if (!compatMode && getSetting(SETTINGS.enableDnd5eAnimalBackground)) body.classList.add("dnd-animal-ui-dnd5e-animal-background-enabled");
```

替换为（兼容模式下也关掉深度主题，与旧 animal-background 行为一致）：

```js
  if (!compatMode && getSetting(SETTINGS.enableDnd5eCreamTheme)) body.classList.add("dnd-animal-ui-dnd5e-cream-enabled");
```

- [ ] **Step 1.4: 替换 getData 字段**

`scripts/dnd-animal-ui.js:581-582`，把：

```js
      enableDnd5eSheetSafety: getSetting(SETTINGS.enableDnd5eSheetSafety),
      enableDnd5eAnimalBackground: getSetting(SETTINGS.enableDnd5eAnimalBackground),
```

替换为：

```js
      enableDnd5eCreamTheme: getSetting(SETTINGS.enableDnd5eCreamTheme),
```

- [ ] **Step 1.5: 替换 _updateObject 中的保存**

`scripts/dnd-animal-ui.js:747-748`，把：

```js
      await game.settings.set(MODULE_ID, SETTINGS.enableDnd5eSheetSafety, form.enableDnd5eSheetSafety.checked);
      await game.settings.set(MODULE_ID, SETTINGS.enableDnd5eAnimalBackground, form.enableDnd5eAnimalBackground.checked);
```

替换为：

```js
      await game.settings.set(MODULE_ID, SETTINGS.enableDnd5eCreamTheme, form.enableDnd5eCreamTheme.checked);
```

- [ ] **Step 1.6: 替换 registerSettings 中的两个注册**

`scripts/dnd-animal-ui.js:858-876`，把 `enableDnd5eSheetSafety` 和 `enableDnd5eAnimalBackground` 两段 `game.settings.register` 整体替换为：

```js
  game.settings.register(MODULE_ID, SETTINGS.enableDnd5eCreamTheme, {
    name: "DNDANIMALUI.Settings.EnableDnd5eCreamTheme.Name",
    hint: "DNDANIMALUI.Settings.EnableDnd5eCreamTheme.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: true,
    onChange: applyThemeState
  });
```

- [ ] **Step 1.7: 模板换行**

`templates/theme-config.hbs:50-64`，把两个旧 `<label class="dnd-animal-ui-config-row">`（enableDnd5eSheetSafety、enableDnd5eAnimalBackground）整体替换为：

```handlebars
    <label class="dnd-animal-ui-config-row">
      <span>
        <strong>{{localize "DNDANIMALUI.Settings.EnableDnd5eCreamTheme.Name"}}</strong>
        <small>{{localize "DNDANIMALUI.Settings.EnableDnd5eCreamTheme.Hint"}}</small>
      </span>
      <input type="checkbox" name="enableDnd5eCreamTheme" {{#if enableDnd5eCreamTheme}}checked{{/if}}>
    </label>
```

- [ ] **Step 1.8: lang 键替换**

`lang/zh-cn.json:67-74`，把 `EnableDnd5eSheetSafety` 和 `EnableDnd5eAnimalBackground` 两个对象替换为：

```json
      "EnableDnd5eCreamTheme": {
        "Name": "DnD5e 卡片奶油主题",
        "Hint": "角色卡、物品卡、随机表、聊天卡和宏栏全面使用动物岛奶油配色。关闭后恢复系统原生样式。"
      },
```

`lang/en.json:67-74` 同位置替换为：

```json
      "EnableDnd5eCreamTheme": {
        "Name": "DnD5e Cream Sheets",
        "Hint": "Theme actor sheets, item sheets, roll tables, chat cards and the hotbar with the full Animal Island cream palette. Disable to restore native system styling."
      },
```

- [ ] **Step 1.9: 校验**

```powershell
node --check D:/fvtt/Data/modules/dnd-animal-ui/scripts/dnd-animal-ui.js
node -e "JSON.parse(require('fs').readFileSync('D:/fvtt/Data/modules/dnd-animal-ui/lang/zh-cn.json','utf8')); JSON.parse(require('fs').readFileSync('D:/fvtt/Data/modules/dnd-animal-ui/lang/en.json','utf8')); console.log('OK')"
```

预期：无输出（node --check）+ `OK`。再确认旧键无残留（应只在 CHANGELOG/docs 出现）：

```powershell
git grep -n "Dnd5eSheetSafety\|Dnd5eAnimalBackground" -- scripts templates lang styles
```

预期：无输出。

- [ ] **Step 1.10: Commit**

```bash
git add scripts/dnd-animal-ui.js templates/theme-config.hbs lang/zh-cn.json lang/en.json
git commit -m "Merge dnd5e sheet toggles into single cream theme setting"
```

---

### Task 2: 删除旧深色面板 CSS，注册新样式文件

**Files:**
- Modify: `styles/dnd-animal-ui.css`（只删）
- Create: `styles/dnd-animal-sheets.css`（占位头）
- Modify: `module.json:35-37`（styles 数组）

- [ ] **Step 2.1: 删除旧规则块**

在 `styles/dnd-animal-ui.css` 中删除以下规则块（按选择器定位，整块删除，含注释行）：

1. `body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-sheet-safety-enabled :is(.dnd5e2.sheet, …) :is(.items-section, …)`（约 777-793 行，`--color-text-primary` 重映射块）
2. `body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-animal-background-enabled …` 全部块（约 795-851 行：window-content 背景 ×1、sheet-header 背景 ×1、sheet-body 列表清背景 ×1、::before/::after 清背景 ×1、header 透明度 ×1、header 文字描影 ×1）
3. `…sheet-safety-enabled … :is(.ability-scores, .ability-score, .skills, .saves, filigree-box)` 文字块（约 853-875 行，含 `#f7d77d` 金字块）
4. `…sheet-safety-enabled … :is(.items-section, .items-header, …)` 深色物品列表全部块（约 877-915 行，含 `#3a2025` 表头和 `#e2c779` 标签）
5. `…sheet-safety-enabled .dnd5e2.compendium-browser …`（约 917-924 行）
6. 文件尾部 0.3.1 的三个块（约 1303-1334 行）：animal-background 的 window-content 渐变、sheet-header 渐变、sheet-body 色块，以及 sheet-safety 的 `.ability-scores …` 深底块和 `.items-header … #4a2f31` 块
7. 0.1.1/0.1.3 的三个守护块里**保留**（约 1137-1152 行）：`transform: none`、`overflow: auto`、`background-image: unset` 这三块改挂到新类——把其中的 `.dnd-animal-ui-dnd5e-sheet-safety-enabled` 类名替换为 `.dnd-animal-ui-dnd5e-cream-enabled`，`…sheet-safety-enabled:not(.dnd-animal-ui-dnd5e-animal-background-enabled)` 那一块直接删除（新主题统一管背景）。

⚠️ 行号会随删除漂移——**按选择器文本搜索定位**，不要按行号删。每删一块都确认选择器里含 `sheet-safety` 或 `animal-background`。

最后确认：

```powershell
grep -c "sheet-safety\|animal-background" D:/fvtt/Data/modules/dnd-animal-ui/styles/dnd-animal-ui.css
```

预期：`0`。

- [ ] **Step 2.2: 同时删除 JS 残留排除项**

`scripts/dnd-animal-ui.js:930`（document click 监听里）有 `.dnd5e2.sheet, .window-app.dnd5e2, .application.dnd5e2` 的果冻动效排除——**保留不动**（卡片内按钮不做果冻下压，避免干扰系统交互，这是有意行为）。本步骤只是确认，无改动。

- [ ] **Step 2.3: 创建新样式文件占位**

创建 `styles/dnd-animal-sheets.css`：

```css
/* dnd-animal-sheets.css — DnD5e 5.x 卡片、核心随机表、合集浏览器、聊天卡、
   原生宏栏的深度奶油主题（FVTT v13）。
   全部规则挂在 body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled
   之下，单开关可整体关闭，关闭后回到系统原生样式。 */
```

- [ ] **Step 2.4: module.json 注册**

`module.json` 的 `styles` 数组改为：

```json
  "styles": [
    "styles/dnd-animal-ui.css",
    "styles/dnd-animal-sheets.css"
  ],
```

校验：

```powershell
node -e "JSON.parse(require('fs').readFileSync('D:/fvtt/Data/modules/dnd-animal-ui/module.json','utf8')); console.log('OK')"
```

预期：`OK`。

- [ ] **Step 2.5: Commit**

```bash
git add styles/dnd-animal-ui.css styles/dnd-animal-sheets.css module.json
git commit -m "Remove dark-panel sheet safety CSS, register cream sheets stylesheet"
```

---

### Task 3: JS 强制 dnd5e 窗口走亮色主题分支

**Files:**
- Modify: `scripts/dnd-animal-ui.js`（新函数 + 两个 hook）

- [ ] **Step 3.1: 加 forceDnd5eLightTheme 函数**

在 `applyThemeState` 函数定义之后（约 346 行 `}` 后）插入：

```js
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
```

- [ ] **Step 3.2: 挂 hook**

在文件底部 hooks 区（`Hooks.on("collapseSidebar", …)` 之后）插入：

```js
Hooks.on("renderApplicationV2", (_app, element) => forceDnd5eLightTheme(element));
Hooks.on("renderChatMessageHTML", (_message, html) => forceDnd5eLightTheme(html));
```

（dnd5e 5.x 的卡片全部是 ApplicationV2；聊天消息 li 自带 `dnd5e2` 类时同样补亮色类，命中 `.themed.theme-light.dnd5e2` 选择器。非 dnd5e2 元素直接 return，零开销。）

- [ ] **Step 3.3: 校验 + Commit**

```powershell
node --check D:/fvtt/Data/modules/dnd-animal-ui/scripts/dnd-animal-ui.js
```

预期：无输出。

```bash
git add scripts/dnd-animal-ui.js
git commit -m "Force dnd5e windows onto the light theme branch for cream theming"
```

---

### Task 4: 调色板层 — dnd5e 变量重映射

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）

- [ ] **Step 4.1: 追加变量重映射块**

追加到 `styles/dnd-animal-sheets.css`：

```css
/* ===================================================================
   Layer 1 — 调色板重映射。
   特异性 body.X.Y :is(.dnd5e2…) = 0,3,1，压过系统的
   body.theme-light .dnd5e2 (0,2,1) 和 .themed.theme-light.dnd5e2 (0,3,0)。
   =================================================================== */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled :is(.dnd5e2, .dnd5e2-journal),
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.chat-message {
  /* —— 基础色板：深蓝灰 → 奶油，金 → 青绿，暗红 → 珊瑚 —— */
  --dnd5e-color-blue-gray-1: rgb(247, 243, 223);
  --dnd5e-color-blue-gray-2: #f7f3df;
  --dnd5e-color-blue-gray-3: #f0e8d8;
  --dnd5e-color-blue-gray-4: #ece2cf;
  --dnd5e-color-blue-white: #794f27;
  --dnd5e-color-gold: #19c8b9;
  --dnd5e-color-card: #fffdf2;
  --dnd5e-color-parchment: #fffdf2;
  --dnd5e-color-groove: #f0e8d8;
  --dnd5e-color-faint: #e8dfc8;
  --dnd5e-color-beige: #d8d0c3;
  --dnd5e-color-olive: #8a7b66;
  --dnd5e-color-light-gray: #f0e8d8;
  --dnd5e-color-iron-gray: #e8dfc8;
  --dnd5e-color-dark-gray: #794f27;
  --dnd5e-color-dark: #725d42;
  --dnd5e-color-black: #5d4423;
  --dnd5e-color-maroon: #d97583;
  --dnd5e-color-crimson: #c2606e;
  --dnd5e-color-tan: #c4b89e;

  /* —— 表格/列表 —— */
  --dnd5e-color-table-header-1: #f7cd67;
  --dnd5e-color-table-header-2: #f7d77d;
  --dnd5e-color-table-row-odd: #f7f3df;
  --dnd5e-color-table-row-even: #fffdf2;
  --dnd5e-color-table-border: #d8d0c3;
  --dnd5e-color-scrollbar: #19c8b9;

  /* —— 资源条：HP 亮绿、生命骰暖橙、法术位青绿 —— */
  --dnd5e-color-hp-1: #4f8f1f;
  --dnd5e-color-hp-2: #6fba2c;
  --dnd5e-color-hp-3: #5da626;
  --dnd5e-color-hd-1: #c97a4a;
  --dnd5e-color-hd-2: #e59266;
  --dnd5e-color-hd-3: #b56636;
  --dnd5e-color-sc-1: #4aa9a0;
  --dnd5e-color-sc-2: #19c8b9;

  /* —— 语义色：保色相，调明度适配奶油底 —— */
  --dnd5e-color-success: #2e7d32;
  --dnd5e-color-success-background: #d9ecd0;
  --dnd5e-color-failure: #b23a48;
  --dnd5e-color-failure-background: #f8dde0;

  /* —— 文字 —— */
  --color-text-primary: #725d42;
  --color-text-secondary: #8a7b66;
  --color-text-tertiary: #9f927d;
  --color-text-emphatic: #794f27;
  --color-text-title: #794f27;
}
```

- [ ] **Step 4.2: F5 检查点 ①**

浏览器 F5 后打开一张 PC 角色卡。预期：深蓝灰面板全部变成奶油/米杏，文字变棕。允许残留：头部横幅还是 D&D 原图、属性底座 svg 还是旧色、部分硬编码角落仍突兀——这些是后续任务的活。**确认无白字白底/棕字深底的不可读组合后**继续。

- [ ] **Step 4.3: Commit**

```bash
git add styles/dnd-animal-sheets.css
git commit -m "Remap dnd5e palette variables to cream theme"
```

---

### Task 5: 装饰层 — 应用背景、横幅、filigree、果冻卡

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）

- [ ] **Step 5.1: 追加应用层钩子变量覆盖**

```css
/* ===================================================================
   Layer 2 — 装饰层：背景纹理、卡头横幅、filigree 框、分隔线。
   注意：自定义属性里的 url() 一律绝对路径。
   =================================================================== */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled :is(.dnd5e2, .dnd5e2-journal),
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.chat-message {
  /* 整窗背景：奶油渐变替代灰纸纹理 */
  --dnd5e-application-background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(247, 243, 223, 0.96)),
    rgb(247, 243, 223);

  /* 角色卡头部：岛景横幅 + 青天渐变压暗；正文不再用红纸纹理 */
  --dnd5e-character-header-image:
    linear-gradient(180deg, rgba(125, 202, 194, 0.55), rgba(239, 232, 207, 0.92) 78%),
    url("/modules/dnd-animal-ui/assets/backgrounds/animalisland_1440_2560.jpg");
  --dnd5e-character-body-image: none;
  --dnd5e-character-background-content: none;
  --dnd5e-character-background-image: transparent;

  /* NPC / 物品 / 遭遇 / 团体卡头部统一岛景 */
  --dnd5e-npc-header-content: "";
  --dnd5e-npc-header-image:
    linear-gradient(180deg, rgba(125, 202, 194, 0.55), rgba(239, 232, 207, 0.92) 78%),
    url("/modules/dnd-animal-ui/assets/backgrounds/animalisland_1440_2560.jpg");
  --dnd5e-item-header-content: "";
  --dnd5e-item-header-image:
    linear-gradient(180deg, rgba(125, 202, 194, 0.55), rgba(239, 232, 207, 0.92) 78%),
    url("/modules/dnd-animal-ui/assets/backgrounds/animalisland_1440_2560.jpg");
  --dnd5e-encounter-header-content: none;
  --dnd5e-encounter-header-image: transparent;
  --dnd5e-group-header-content: none;
  --dnd5e-group-header-image: transparent;

  /* 面板与边框：金线 → 暖棕圆线 */
  --dnd5e-background-card: #fffdf2;
  --dnd5e-background-parchment: #fffdf2;
  --dnd5e-background-alt-1: #f0e8d8;
  --dnd5e-background-alt-2: #ece2cf;
  --dnd5e-gold-icon-background: #f0e8d8;
  --dnd5e-border-gold: 2px solid rgba(159, 146, 125, 0.62);
  --dnd5e-inventory-border: 2px solid rgba(159, 146, 125, 0.42);
  --dnd5e-slot-border: 1px solid rgba(159, 146, 125, 0.62);
  --dnd5e-border-dotted: 1px dotted #c4b89e;
  --dnd5e-border-dashed: 1px dashed #c4b89e;
  --dnd5e-border-dashed-faint: 1px dashed #e8dfc8;
  --dnd5e-border-dark: 1px solid #c4b89e;
  --dnd5e-border-separator-faint: 1px solid #e8dfc8;
  --dnd5e-border-separator-heavy: 1px solid #d8d0c3;
  --separated-list-item-background-color: #fffdf2;
  --separated-list-item-border-color: rgba(159, 146, 125, 0.5);

  /* 物品/特性区卡头（原暗红渐变）→ 暖黄 */
  --dnd5e-card-header-1: #f7cd67;
  --dnd5e-card-header-2: #f7d77d;
  --dnd5e-card-header-disabled-1: #d8d0c3;
  --dnd5e-card-header-disabled-2: #e8dfc8;

  /* 属性区 */
  --dnd5e-attribute-color: #794f27;
  --dnd5e-ability-color: #8a7b66;
  --dnd5e-ability-mod-color: #11a89b;
  --dnd5e-heading-3-color: #794f27;
  --dnd5e-condition-hover: #f0e8d8;

  /* filigree 哥特框 → 奶油填充 + 暖棕描线 */
  --filigree-background-color: #fffdf2;
  --filigree-border-color: rgba(159, 146, 125, 0.6);
}
```

- [ ] **Step 5.2: 窗口圆角与果冻 chrome**

继续追加：

```css
/* dnd5e 窗口外壳与主文件的果冻语言对齐 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .application.dnd5e2:not(.minimized) {
  border: 2px solid rgba(159, 146, 125, 0.62) !important;
  border-radius: var(--dnd-animal-radius-lg) !important;
  box-shadow:
    0 5px 0 0 rgba(189, 174, 160, 0.88),
    0 10px 24px rgba(61, 52, 40, 0.14) !important;
}

/* 卡头横幅上的标题文字保持可读（沿用 0.4.0 描影方案） */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .application.dnd5e2.sheet
  :is(.sheet-header, header.sheet-header) :is(.document-name, input.document-name, .title, h1, h2) {
  color: #fff9e3 !important;
  text-shadow:
    0 2px 0 rgba(114, 93, 66, 0.75),
    0 0 5px rgba(61, 52, 40, 0.82) !important;
}
```

- [ ] **Step 5.3: F5 检查点 ②**

打开 PC 卡 + 物品卡。预期：灰纸/红纸纹理消失，卡头是岛景横幅，filigree 框变奶油底暖棕线，物品区表头变暖黄。记录任何仍是深色/红色的残留区域（带 devtools 选择器），供 Task 6-8 精修。

- [ ] **Step 5.4: Commit**

```bash
git add styles/dnd-animal-sheets.css
git commit -m "Cream decoration layer: backgrounds, banners, filigree, jelly chrome"
```

---

### Task 6: PC 角色卡精修

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）

- [ ] **Step 6.1: 追加 PC 卡精修规则**

```css
/* ===================================================================
   Layer 3.1 — PC 角色卡精修
   =================================================================== */
/* 属性六宫格底座 svg：奶油化（svg 本身是 mask/背景，调滤镜近似暖色） */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.actor .ability-scores .ability-score {
  filter: none;
}

/* 技能/豁免列表：熟练点用青绿 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.actor
  :is(.skills, .saves) :is(proficiency-cycle-icon, .proficiency-toggle) {
  --color-fill: #19c8b9;
  color: #11a89b;
}

/* 列表行悬停：青绿 13% 高亮（与侧边栏一致） */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet
  :is(.items-list .item, .item-list .item, .activities .activity):hover {
  background: rgba(25, 200, 185, 0.13) !important;
  box-shadow: inset 4px 0 0 #19c8b9;
}

/* 检定/施法等行内小按钮：奶油果冻微缩版 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.actor
  :is(.rollable.ability-check, .rollable.saving-throw, button.radius-button, .sheet-header-buttons button) {
  color: #794f27;
  background: #f8f8f0;
  border: 2px solid rgba(159, 146, 125, 0.72);
  border-radius: 50px;
  box-shadow: 0 3px 0 0 #bdaea0;
}

/* 货币栏与负重条 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.actor .currency input {
  background: #fffdf2;
  border: 1px solid #c4b89e;
  border-radius: 10px;
  color: #725d42;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.actor .encumbrance .bar {
  background: linear-gradient(90deg, #6fba2c, #f7cd67);
  border-radius: 999px;
}

/* tab 导航：药丸 tab */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet nav.tabs .item {
  color: #794f27;
  border-radius: 50px;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet nav.tabs .item.active {
  color: #fff9e3;
  background: #19c8b9;
  box-shadow: 0 3px 0 0 #11a89b;
  text-shadow: none;
}
```

⚠️ 本任务的选择器是按 dnd5e 5.3.3 已知结构写的初稿。**Step 6.2 的 F5 检查是本任务的真正验收**——逐个元素用 devtools 校正选择器（结构若有出入，以 `D:\fvtt\Data\systems\dnd5e\dnd5e.css` 内同名规则的实际选择器为准修改），不准带着失效选择器提交。

- [ ] **Step 6.2: F5 检查点 ③（PC 卡全 tab 走查）**

PC 卡逐 tab（角色/物品栏/法术书/特性/效果/传记）检查：无深色残留面板、无低对比文字、悬停行为正常、tab 高亮正确、HP/HD/法术位颜色正确。修正选择器直到干净。

- [ ] **Step 6.3: Commit**

```bash
git add styles/dnd-animal-sheets.css
git commit -m "Polish PC actor sheet: skills, tabs, currency, hover states"
```

---

### Task 7: NPC 卡精修

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）

- [ ] **Step 7.1: 追加 NPC 精修规则**

```css
/* ===================================================================
   Layer 3.2 — NPC/怪物卡精修（变量层已覆盖大头，这里处理 NPC 专属件）
   =================================================================== */
/* CR / XP 徽章 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.actor.npc
  :is(.cr-badge, .badge.cr, .level-badge) {
  color: #fff9e3;
  background: #e59266;
  border: 2px solid rgba(181, 102, 54, 0.8);
  border-radius: 999px;
  text-shadow: 0 1px 0 rgba(114, 93, 66, 0.6);
}

/* 传奇抗性/行动点 pip */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.actor.npc
  :is(.legendary-resistance .pip, .legendary-actions .pip, .pips .pip) {
  background: #f7cd67;
  border-color: #d6b866;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.actor.npc
  :is(.legendary-resistance .pip.filled, .legendary-actions .pip.filled, .pips .pip.filled) {
  background: #19c8b9;
  border-color: #11a89b;
}
```

- [ ] **Step 7.2: F5 检查点 ④**

打开两张 NPC 卡（一张带传奇动作的，一张普通的）。同 Task 6 标准走查 + 校正选择器。

- [ ] **Step 7.3: Commit**

```bash
git add styles/dnd-animal-sheets.css
git commit -m "Polish NPC sheet: CR badge and legendary pips"
```

---

### Task 8: 物品卡精修

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）

- [ ] **Step 8.1: 追加物品卡精修规则**

```css
/* ===================================================================
   Layer 3.3 — 物品卡精修
   =================================================================== */
/* 右栏属性 pill（重量/价格/稀有度等） */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.item
  :is(.pills .pill, .pill) {
  color: #794f27;
  background: #fffdf2;
  border: 1px solid rgba(159, 146, 125, 0.5);
  border-radius: 999px;
}

/* 描述编辑/阅读区 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.item
  :is(.editor-content, .ProseMirror, .description .value) {
  color: #725d42;
  background: rgba(255, 253, 242, 0.92);
  border-radius: 12px;
}

/* 激活/伤害等配置区的嵌入面板 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.item
  :is(fieldset, .form-fields, .card) {
  background: rgba(240, 232, 216, 0.55);
  border-color: rgba(159, 146, 125, 0.42);
  border-radius: 14px;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.sheet.item fieldset > legend {
  color: #794f27;
  font-weight: 800;
}
```

- [ ] **Step 8.2: F5 检查点 ⑤**

打开一张武器卡 + 一张法术卡，走查描述 tab、细节 tab、活动配置弹窗。校正选择器。

- [ ] **Step 8.3: Commit**

```bash
git add styles/dnd-animal-sheets.css
git commit -m "Polish item sheet: pills, description, config fieldsets"
```

---

### Task 9: 聊天掷骰/物品使用卡精修

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）

- [ ] **Step 9.1: 追加聊天卡规则**

```css
/* ===================================================================
   Layer 3.4 — dnd5e 聊天卡（掷骰、物品使用、伤害应用）
   =================================================================== */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message :is(.dnd5e2.chat-card, .chat-card) {
  color: #725d42;
  background: transparent;
}

/* 骰子结果总值：大号深棕；大成功青绿描边、大失败珊瑚描边 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message .dice-roll .dice-total {
  color: #794f27;
  background: #fffdf2;
  border: 2px solid rgba(159, 146, 125, 0.62);
  border-radius: 14px;
  font-weight: 900;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message .dice-roll .dice-total.critical,
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message .dice-roll .dice-total.success {
  color: #11a89b;
  border-color: #19c8b9;
  box-shadow: 0 0 0 3px rgba(25, 200, 185, 0.18);
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message .dice-roll .dice-total.fumble,
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message .dice-roll .dice-total.failure {
  color: #b23a48;
  border-color: #d97583;
  box-shadow: 0 0 0 3px rgba(217, 117, 131, 0.18);
}

/* 骰子展开 tooltip 的每粒骰子 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message .dice-tooltip :is(.dice-rolls .roll, .die) {
  color: #794f27;
  filter: none;
}

/* 攻击/伤害/豁免按钮行：奶油果冻；伤害应用色只调明度 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message :is(.card-buttons button, .chat-card button) {
  color: #794f27 !important;
  background: #f8f8f0 !important;
  border: 2px solid rgba(159, 146, 125, 0.72) !important;
  border-radius: 50px !important;
  box-shadow: 0 3px 0 0 #bdaea0 !important;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .chat-message
  :is([data-action="applyDamage"], .damage-application button) {
  --dnd5e-color-application-damage: #c2606e;
  --dnd5e-color-application-healing: #4f8f1f;
  --dnd5e-color-application-temp: #19c8b9;
}
```

- [ ] **Step 9.2: F5 检查点 ⑥**

发三种消息：武器攻击（含命中/伤害按钮）、伤害掷骰（展开 tooltip）、法术使用卡。检查总值徽章、暴击/大失败配色、按钮可读性。校正选择器。

- [ ] **Step 9.3: Commit**

```bash
git add styles/dnd-animal-sheets.css
git commit -m "Polish dnd5e chat cards: dice totals, crit colors, card buttons"
```

---

### Task 10: 随机表配置窗精修

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）

- [ ] **Step 10.1: 追加随机表规则**

```css
/* ===================================================================
   Layer 3.5 — 核心随机表（v13 .roll-table-sheet）
   =================================================================== */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet table {
  border: 2px solid rgba(159, 146, 125, 0.42);
  border-radius: 14px;
  overflow: hidden;
  background: #fffdf2;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet table th {
  color: #794f27;
  background: #f7cd67;
  text-shadow: none;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet table tbody tr:nth-child(odd) {
  background: #f7f3df;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet table tbody tr:nth-child(even) {
  background: #fffdf2;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet table td {
  color: #725d42;
  border-color: #e8dfc8;
}
/* 范围列：青绿粗体 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet table td:has(input[name$=".range"]) input,
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet table td.range {
  color: #11a89b;
  font-weight: 800;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet table td.details > strong.name {
  color: #794f27;
}
/* 行内文档链接 chip */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .roll-table-sheet :is(a.content-link, .content-link) {
  color: #794f27;
  background: rgba(25, 200, 185, 0.13);
  border: 1px solid rgba(25, 200, 185, 0.4);
  border-radius: 999px;
  padding: 0 0.5em;
}
```

（抽取/重置按钮已被主文件的全局果冻按钮规则覆盖，无需重写。）

- [ ] **Step 10.2: F5 检查点 ⑦**

打开一张有 5+ 结果行、含文档引用结果的随机表。检查条纹、表头、范围列、链接 chip、底部按钮。校正选择器。

- [ ] **Step 10.3: Commit**

```bash
git add styles/dnd-animal-sheets.css
git commit -m "Theme core roll table sheet with cream stripes and teal ranges"
```

---

### Task 11: 合集浏览器精修

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）
- Modify: `styles/dnd-animal-ui.css`（删旧的半成品块）

- [ ] **Step 11.1: 删除主文件里的旧合集浏览器块**

`styles/dnd-animal-ui.css` 中删除 `…sheet-safety-enabled .dnd5e2.compendium-browser …` 块（若 Task 2 已删则跳过；grep 确认）：

```powershell
grep -n "compendium-browser" D:/fvtt/Data/modules/dnd-animal-ui/styles/dnd-animal-ui.css
```

预期：无输出。

- [ ] **Step 11.2: 追加合集浏览器规则**

```css
/* ===================================================================
   Layer 3.6 — dnd5e 合集浏览器（变量层已接管配色，这里补结构件）
   =================================================================== */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.compendium-browser .sidebar {
  background: rgba(240, 232, 216, 0.6);
  border-right: 2px solid rgba(159, 146, 125, 0.32);
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.compendium-browser
  :is(.results .item, .item-list .item):nth-child(odd) {
  background: rgba(247, 243, 223, 0.6);
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.compendium-browser
  :is(.results .item, .item-list .item):hover {
  background: rgba(25, 200, 185, 0.13);
  box-shadow: inset 4px 0 0 #19c8b9;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled .dnd5e2.compendium-browser nav.tabs .item.active {
  color: #fff9e3;
  background: #19c8b9;
  border-radius: 50px;
}
```

- [ ] **Step 11.3: F5 检查点 ⑧**

打开合集浏览器（物品 tab + 法术 tab），翻页加载更多。校正选择器。

- [ ] **Step 11.4: Commit**

```bash
git add styles/dnd-animal-sheets.css styles/dnd-animal-ui.css
git commit -m "Complete compendium browser cream theming"
```

---

### Task 12: 原生宏栏

**Files:**
- Modify: `styles/dnd-animal-sheets.css`（追加）

注意：主文件 `dnd-animal-ui.css` 里果冻按钮规则的 `:not(#hotbar button)` 排除**保留不动**——宏栏不用药丸按钮语言，用下面的专属方格语言。

- [ ] **Step 12.1: 追加宏栏规则**

```css
/* ===================================================================
   Layer 3.7 — 原生宏栏（v13 #hotbar）
   =================================================================== */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled #hotbar #action-bar {
  gap: 6px;
  border: 0;
  background: transparent;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled #hotbar #action-bar .slot {
  width: 44px;
  height: 44px;
  border: 2px solid rgba(159, 146, 125, 0.62) !important;
  border-radius: 14px !important;
  background: rgba(248, 248, 240, 0.82) !important;
  box-shadow: 0 3px 0 0 rgba(189, 174, 160, 0.72);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s, box-shadow 0.25s;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled #hotbar #action-bar .slot:hover {
  transform: translateY(-2px);
  border-color: #19c8b9 !important;
  box-shadow: 0 5px 0 0 rgba(189, 174, 160, 0.72);
}
/* 槽位编号徽章 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled #hotbar #action-bar .slot .key {
  color: #794f27;
  background: rgba(247, 205, 103, 0.9);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 800;
  text-shadow: none;
}
/* 宏图标本身不加滤镜，保持可辨认 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled #hotbar #action-bar .slot .slot-icon {
  filter: none;
}
/* 翻页与折叠控件：果冻化 */
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled #hotbar
  :is(#hotbar-page-controls .hotbar-page-control, .hotbar-controls button) {
  color: #794f27 !important;
  background: #f8f8f0 !important;
  border: 2px solid rgba(159, 146, 125, 0.62) !important;
  border-radius: 50px !important;
  box-shadow: 0 3px 0 0 #bdaea0 !important;
}
body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled #hotbar #hotbar-page-controls .hotbar-page-number {
  color: #794f27;
  font-weight: 900;
  text-shadow: none;
}
```

- [ ] **Step 12.2: F5 检查点 ⑨**

宏栏满槽（拖 3 个宏）+ 空槽 + 翻页 + 折叠展开。检查拖放高亮（`.slot.drop-target`）是否仍可见——若被覆盖，补一条 `.slot.drop-target { border-color: #f7cd67 !important; }`。

- [ ] **Step 12.3: Commit**

```bash
git add styles/dnd-animal-sheets.css
git commit -m "Theme native hotbar with cream slots and jelly page controls"
```

---

### Task 13: 版本与文档

**Files:**
- Modify: `module.json:5`（version）、`module.json:8`（download）
- Modify: `CHANGELOG.md`（顶部插入）
- Create: `docs/updates/2026-06-10-130000-dnd5e-cream-sheets.md`
- Modify: `README.md`（功能列表如有提及旧开关则更新）

- [ ] **Step 13.1: module.json 版本**

`"version": "0.4.0"` → `"0.5.0"`；download URL 中 `v0.4.0/dnd-animal-ui-0.4.0.zip` → `v0.5.0/dnd-animal-ui-0.5.0.zip`。

- [ ] **Step 13.2: CHANGELOG 顶部插入**

`CHANGELOG.md` 在 `# Changelog` 之后、`## 0.4.0` 之前插入：

```markdown
## 0.5.0 - 2026-06-10

- Added full cream theming for dnd5e 5.x sheets: palette variables remapped so PC/NPC/item sheets drop the dark slate panels entirely; island banner headers, cream filigree boxes, warm-yellow section headers, teal accents.
- Added cream theming for core roll table sheets, the dnd5e compendium browser, dnd5e chat cards (dice totals with crit/fumble rings) and the native v13 hotbar.
- Changed dnd5e sheets to always use the system light-theme branch while the cream theme is active, regardless of the global Foundry theme.
- Removed the `enableDnd5eSheetSafety` and `enableDnd5eAnimalBackground` settings; both are replaced by a single `enableDnd5eCreamTheme` world toggle (default on).
- Changed author to 蟀蟀.
```

- [ ] **Step 13.3: docs/updates 记录**

创建 `docs/updates/2026-06-10-130000-dnd5e-cream-sheets.md`（按既有 docs/updates 文件的格式，记录：动机=色差、方案=变量重映射三层、影响面=七个目标、设置迁移说明）。参考同目录 `2026-06-10-120000-custom-stickers-client-prefs-i18n.md` 的结构。

- [ ] **Step 13.4: README 检查**

```powershell
grep -n "安全\|SheetSafety\|AnimalBackground\|动物背景" D:/fvtt/Data/modules/dnd-animal-ui/README.md
```

有命中则把对应描述改为新开关的说法；无命中跳过。

- [ ] **Step 13.5: 校验 + Commit**

```powershell
node -e "JSON.parse(require('fs').readFileSync('D:/fvtt/Data/modules/dnd-animal-ui/module.json','utf8')); console.log('OK')"
```

```bash
git add module.json CHANGELOG.md docs/updates README.md
git commit -m "Release 0.5.0 dnd5e cream sheets deep theming"
```

---

### Task 14: 最终 QA（docs/qa.md 全量）

- [ ] **Step 14.1: 静态校验全量**

```powershell
node --check D:/fvtt/Data/modules/dnd-animal-ui/scripts/dnd-animal-ui.js
node -e "['module.json','lang/zh-cn.json','lang/en.json'].forEach(f=>JSON.parse(require('fs').readFileSync('D:/fvtt/Data/modules/dnd-animal-ui/'+f,'utf8'))); console.log('OK')"
git grep -n "Dnd5eSheetSafety\|Dnd5eAnimalBackground" -- scripts templates lang styles
```

预期：`OK`，grep 无输出。再校验所有新 CSS `url(...)` 指向存在的文件（qa.md 要求）：确认 `assets/backgrounds/animalisland_1440_2560.jpg` 存在。

- [ ] **Step 14.2: F5 终检（回归项）**

按 spec 验证清单全量过一遍，额外四个回归项：
1. 窗口最小化/还原动画正常（PC 卡 + 物品卡）。
2. 卡内输入框无全局 pill 污染（武器卡数值输入框应是系统方角输入框 + 我们的配色）。
3. 把 Foundry 全局主题切到 dark，卡片仍是奶油亮色。
4. 配置窗里关掉"DnD5e 卡片奶油主题"开关 → 卡片完全回到系统原生样式（包括宏栏、随机表）。

- [ ] **Step 14.3: 收尾**

全部通过后报告用户：0.5.0 完成，待用户决定是否推送 GitHub + 打 Release（作者变更 commit 也将一并推送）。**不要主动 push。**

---

## Self-Review 记录

- **Spec 覆盖**：调色板映射 → Task 4；亮色基底 → Task 3；装饰层（纹理/横幅/filigree）→ Task 5；七目标 = Task 6(PC)/7(NPC)/8(物品)/9(聊天卡)/10(随机表)/11(合集浏览器)/12(宏栏)；设置迁移 → Task 1；旧规则移除 → Task 2；验证与回归 → 各 F5 检查点 + Task 14；版本与文档 → Task 13。无缺口。
- **占位符**：Task 13.3 引用既有文件做格式参考（文件确认存在），其余步骤均含完整代码/命令。
- **一致性**：新设置键 `enableDnd5eCreamTheme`、body 类 `dnd-animal-ui-dnd5e-cream-enabled`、lang 键 `DNDANIMALUI.Settings.EnableDnd5eCreamTheme.*` 在 Task 1/3/4-12 中拼写一致。
- **已知风险**：Task 6-12 的精修选择器基于 dnd5e.css 静态分析，未经活 DOM 验证——计划已将 F5 检查点定义为各任务的验收门，选择器修正属于任务内工作而非计划外变更。

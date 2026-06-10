# dnd5e 卡片奶油主题（Cream Sheets）设计

日期：2026-06-10
状态：已与用户确认
目标版本：0.5.0
目标环境：Foundry VTT v13 + dnd5e 5.x（其他版本停留现状，不回归、不适配）

## 背景与问题

当前模块对 dnd5e 卡片采用"安全模式"：保留系统原生深色面板（蓝灰 `#242731`、暗红 `#741b2b` 表头、金色 `#9f9275` 强调），仅外壳奶油化。结果是"亮壳深芯"的强烈色差——这是用户的核心痛点。随机表、宏栏、合集浏览器、聊天掷骰卡则只有外壳或半成品处理。

用户要求：深度定制、全面奶油化、打磨最佳效果。

## 决策记录（已确认）

- 方向：**全面奶油化**（不保留深色面板调和方案，不做双版本开关）。
- "宏的UI" = **原生宏栏 `#hotbar`**（不是宏编辑窗口；用户不用 BG3 hotbar）。
- 范围：PC 角色卡、NPC/怪物卡、物品卡、随机表配置窗、合集浏览器、聊天掷骰/物品使用卡、原生宏栏。
- 版本：只针对 FVTT v13 + dnd5e 5.x 精调。
- 实现方式：**方案二 = 变量重映射 + 装饰层全面改造 + 逐目标精修**（否决了纯变量轻量方案和重写 Sheet 类方案）。

## 架构

### 文件结构

- 新建 `styles/dnd-animal-sheets.css`，追加到 `module.json#styles[]`。卡片深度主题只写在这个文件里。
- `styles/dnd-animal-ui.css` 只删不加：移除现有 sheet-safety 深色面板规则块（`.dnd-animal-ui-dnd5e-sheet-safety-enabled` 相关、`.dnd-animal-ui-dnd5e-animal-background-enabled` 相关）。
- 所有新规则挂在 `body.dnd-animal-ui-enabled.dnd-animal-ui-dnd5e-cream-enabled` 之下，单开关整体可关。

### 亮色基底策略

dnd5e 5.x 内部用 `.theme-dark` / `.theme-light` 分支配色。JS 侧在卡片窗口渲染时补 `themed theme-light` 类，强制卡片走亮色分支，再在亮色基础上重映射变量。即使用户 Foundry 全局是暗色主题，卡片也保持奶油亮色。

### 调色板映射（`.dnd5e2` 作用域内重定义）

| dnd5e 变量 | 原值 | 映射 |
|---|---|---|
| `--dnd5e-color-blue-gray-1/2` | `#242731` / `#252830` | 奶油纸 `rgb(247,243,223)` |
| `--dnd5e-color-blue-gray-3/4` | `#434857` / `#333742` | 米杏 `#f0e8d8` |
| `--dnd5e-color-gold` | `#9f9275` | 青绿 `#19c8b9` |
| `--dnd5e-color-card` / `parchment` | `#f8f4f1` / `#f1ebe8` | 暖白 `#fffdf2` |
| `--dnd5e-color-maroon` / `crimson` | `#741b2b` / `#44191A` | 珊瑚 `#d97583`（深档）/ `#f8a6b2` |
| `--dnd5e-color-table-header-1/2` | `#491d25` 系 | 暖黄 `#f7cd67` 系 |
| `--dnd5e-color-table-row-odd/even` | 灰条纹 | `#fffdf2` / `#f7f3df` |
| `--dnd5e-color-hp-*` | 暗绿系 | 亮绿 `#6fba2c` 系 |
| `--dnd5e-color-hd-*` | 暗红系 | 暖橙 `#e59266` 系 |
| `--dnd5e-color-scrollbar` | gold/maroon | 青绿 |
| 卡内 `--color-text-*` | 蓝白/金 | 棕 `#794f27`（标题）/ `#725d42`（正文） |

**语义色不动色相**：success/failure/damage/healing/temp 保持绿/红/蓝色相，只调明度与奶油底协调。掷骰可读性优先于风格。

### 装饰层

- 纹理置换：`texture-gray1/2.webp`、`texture1/2.webp`、`denim075.png` → 纯色奶油底，或 `assets/backgrounds/content_bg_pc.jpg` 极淡叠加。不新增图片资源。
- 头部横幅：`ui/official/banner-*.{jpg,webp,avif}` → `assets/backgrounds/animalisland_1440_2560.jpg` 青天岛景 + 渐变压暗，所有 sheet 类型统一。
- filigree 金线框 → 圆角 18–22px + 2px 暖棕描边 + 下沉 3px 实色阴影（"果冻卡"，与聊天气泡/侧边栏一致）。
- `ability-score-tab.svg` 异形底座：保留形状只调色。

## 逐目标精修

1. **PC 角色卡** `.dnd5e2.sheet.actor`：岛景横幅头部（名字/职业/等级暖白字+棕描影，沿用 0.4.0 做法微调色值）；属性六宫格/技能/豁免改奶油圆角卡（属性名深棕粗体、调整值青绿粗体）；物品栏/法术书/特性表头暖黄底深棕字；行条纹奶油双色，悬停青绿 13% 高亮；HP/HD 条、法术位点用亮绿/暖橙/青绿；货币栏、负重条、检定按钮果冻化。
2. **NPC/怪物卡**：变量层自动覆盖为主；精修 banner-npc 替换、CR/XP 徽章调色、动作列表表头同物品栏。
3. **物品卡** `.dnd5e2.sheet.item`：banner-item 替换；属性 pill（重量/价格/稀有度）奶油化；描述区暖白底；激活/伤害配置的深色嵌入面板翻米杏底。
4. **随机表**（核心 Foundry 窗口，非 dnd5e）：结果行条纹奶油双色；范围列青绿粗体；权重/抽取按钮果冻化；行内文档链接 chip 调色。
5. **合集浏览器**：筛选侧栏奶油化补全；列表行条纹+悬停统一；顶部 tab 药丸化；加载更多按钮果冻化。
6. **聊天掷骰/物品卡**：`.dnd5e2.chat-card`、骰子 tooltip、伤害应用条奶油底；骰子总值大号深棕字；大成功描青绿、大失败描珊瑚红；伤害应用按钮只调明度不改色相。
7. **原生宏栏** `#hotbar`（v13）：移除现有排除规则；槽位 44px 圆角方格、奶油半透明底、2px 暖棕描边；悬停上浮+青绿描边；槽位编号小号棕字徽章；翻页按钮果冻化；宏图标不加滤镜。

## 设置迁移

- 新增 world 开关 `enableDnd5eCreamTheme`，默认 `true`，lang 键前缀 `DNDANIMALUI.*`，中英双份（`lang/zh-cn.json`、`lang/en.json`）。
- 移除 `enableDnd5eSheetSafety`、`enableDnd5eAnimalBackground` 的注册、CSS 类挂载逻辑及配置窗行；改为一行新开关。旧世界残留设置值无害，不写迁移代码。

## 错误处理与兼容守护

- 保留现有最小化动画守护规则（minimized/minimizing/maximizing）。
- 全局输入框 pill 样式继续以 `:not(.dnd5e2 *)` 排除卡片内部，卡内输入框由新文件单独定义。
- 开关关闭时（无 `dnd-animal-ui-dnd5e-cream-enabled` 类）卡片回到 dnd5e 原生样式，零残留。

## 验证

- `node --check scripts/dnd-animal-ui.js`；JSON 解析 `module.json`、两个 lang 文件。
- Foundry F5 手测清单：PC 卡全部 tab、NPC 卡、武器+法术两张物品卡、一张随机表、合集浏览器、攻击/伤害/法术三种聊天卡、宏栏满槽+空槽+翻页。
- 回归点：窗口最小化动画；卡内输入框无 pill 污染；Foundry 全局暗色主题下卡片仍为亮色；开关关闭后卡片完全原生。
- 发布：版本 0.5.0，更新 CHANGELOG、docs/updates、README（如功能列表有提及）。

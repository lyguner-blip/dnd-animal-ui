# DND Animal UI

Animal Island 风格的 Foundry VTT / DnD5e UI 主题模块。

Manifest:
https://raw.githubusercontent.com/lyguner-blip/dnd-animal-ui/main/module.json

Download:
https://github.com/lyguner-blip/dnd-animal-ui/releases/download/v0.5.0/dnd-animal-ui-0.5.0.zip

## Features

- 米白、暖棕、薄荷青绿的动物岛风格主题。
- 本地打包 Nunito、Noto Sans SC、Zen Maru Gothic 字体。
- 高还原素材：背景、分割线、光标、NookPhone 图标和 footer 装饰。
- 设置窗口（GM 与玩家都可打开）：GM 管理主题总开关、兼容模式、聊天表情、兼容修正、自定义表情和玩家右侧栏可见项；每位玩家独立管理本机的光标、按钮动效和素材强度。
- 覆盖 Foundry 外层 UI、窗口、表单、聊天、sidebar、controls、players、navigation 和 dnd5e2 常见 sheet，兼容 Foundry v11–v13。
- 聊天输入栏内嵌动物表情按钮，可发送本地打包的萌系动物 SVG 表情；按钮跟随原生聊天控制条，支持侧边栏折叠与聊天弹窗。
- GM 可通过设置窗口添加世界共享的自定义表情（FilePicker 选图，自动获得聊天命令）。
- 表情面板支持分类筛选，并支持 `/sticker duck`、`/表情 duck` 等聊天命令。
- 可单独开关右侧栏文件夹柔化、journal 可读性、DnD5e 奶油主题（`enableDnd5eCreamTheme`，默认开启，取代旧版的 sheet 兼容保护与角色卡动物背景两个独立开关）。
- 玩家右侧栏隐藏属于界面级"减少干扰"功能，不是权限控制：被隐藏的目录仍可通过宏或 API 访问，敏感内容请用 Foundry 自身的文档权限管理。
- 兼容模式可临时关闭高风险装饰层，用于快速排查 UI 冲突。
- 界面文案支持 i18n（简体中文 / English）。

## Install

1. Open Foundry VTT setup.
2. Choose **Install Module**.
3. Paste the manifest URL above.
4. Enable **DND 动物岛 UI** in your world.

For local development, place this folder at:

`D:\fvtt\Data\modules\dnd-animal-ui`

## Source Credit

Visual tokens, component styling references, and bundled source assets are based on the authorized use of `animal-island-ui` by guokaigdg:

https://github.com/guokaigdg/animal-island-ui

`animal-island-ui` is distributed under the MIT License. Keep its copyright notice when redistributing this module or substantial derived parts.

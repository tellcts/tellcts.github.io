---
title: 终端编辑器Helix
layout: doc
---

# 终端编辑器Helix
用 Rust 编写的模态编辑器，操作逻辑接近 Vim，但把 LSP、Tree-sitter 语法高亮和模糊查找都做进了核心，装完即用，不需要像 Neovim 那样先搭一套插件体系。终端轻量编辑也可替代Vim。

## 安装
- **Windows**：`winget install Helix.Helix`
- **Fedora**：`sudo dnf install helix`
- **macOS**：`brew install helix`
- 其他安装方式：[一键直达官网](https://docs.helix-editor.cn/package-managers)

安装后的可执行文件叫`hx`，用`hx --health`可以检查语言支持和配置是否正常。

## 配置
- 配置文件路径：`~/.config/helix/config.toml`，主题和语言配置在同目录的`languages.toml`（Windows 为`%AppData%\helix\`）

- 获取我的配置：
~~~bash
# Linux
cd ~/.config/ && git clone --depth=1 https://github.com/tellcts/helix.git

# Windows
cd $env:AppData
git clone --depth=1 https://github.com/tellcts/helix.git
~~~
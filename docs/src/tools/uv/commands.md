---
title: 常用命令与配置
titleTemplate: :title - Python构建工具UV
aside: false
---

# 常用命令与配置

## 🐍 Python版本管理

~~~bash
# 安装、卸载Python版本
uv python install <version>
uv python uninstall <version>

# 查看可用的Python版本
uv python list

# 将所在项目的Python版本固定至指定值
uv python pin <version>

# 查找已安装的Python版本
uv python find
~~~

## 📦 项目管理

~~~bash
# 初始化项目，生成 pyproject.toml
uv init <项目名>

# 添加、移除依赖，同步更新 pyproject.toml 与 uv.lock
uv add <包名>
uv remove <包名>

# 创建虚拟环境
uv venv

# 按 uv.lock 同步虚拟环境
uv sync

# 在项目环境里执行命令，不需要手工激活
uv run <命令>

# 查看依赖结构
uv tree
~~~

> [!TIP]
> `uv run`会在环境缺失或与锁文件不一致时自动补齐，日常不必反复`activate`。

## 🛠️ 运行命令行工具

~~~bash
# 安装命令行工具
uv tool install <工具名>

# 临时运行某个工具，不安装到全局
uvx <工具名>
~~~

## ⚡ 开启UV和UVX的Shell Tab自动补全功能

~~~bash
# Bash
echo 'eval "$(uv generate-shell-completion bash)"' >> ~/.bashrc
echo 'eval "$(uvx --generate-shell-completion bash)"' >> ~/.bashrc

# Zsh
echo 'eval "$(uv generate-shell-completion zsh)"' >> ~/.zshrc
echo 'eval "$(uvx --generate-shell-completion zsh)"' >> ~/.zshrc
~~~

## 🌏 镜像配置

配置文件：

- **Linux**：`~/.config/uv/uv.toml`
- **Windows**：`%AppData\uv\uv.toml`

> [!TIP]
> 在上述配置文件写入以下内容配置镜像加速！

~~~toml
# Python解释器镜像
python-install-mirror = "https://registry.npmmirror.com/-/binary/python-build-standalone/"

# PyPI 清华镜像源，也可配置其他
[[index]]
name = "Tsinghua"
url = "https://pypi.tuna.tsinghua.edu.cn/simple"
default = true
~~~

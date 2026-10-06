---
title: Python构建工具UV
layout: doc
---

# Python构建工具UV
Astral 用 Rust 写的 Python 包与项目管理器，把`pip`、`virtualenv`、`pipx`、`poetry`这几个工具收敛成一条命令，依赖解析和安装速度通常比`pip`快一到两个数量级。[一键直达UV中文文档](https://uv.doczh.com/)。

## 一、UV的安装

- **Linux or MacOS**

  ~~~bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  # OR
  wget -qO- https://astral.sh/uv/install.sh | sh
  ~~~

- **Windows**

  ~~~powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ~~~

  

## 二、UV的升级与卸载

~~~bash
# 升级
uv self update

# 卸载
uv cache clean
rm -r "$(uv python dir)"
rm -r "$(uv tool dir)"
rm ~/.local/bin/uv ~/.local/bin/uvx
~~~



## 三、开启UV和UVX的Shell自动补全功能

~~~bash
# Bash
echo 'eval "$(uv generate-shell-completion bash)"' >> ~/.bashrc
echo 'eval "$(uvx --generate-shell-completion bash)"' >> ~/.bashrc

# Zsh
echo 'eval "$(uv generate-shell-completion zsh)"' >> ~/.zshrc
echo 'eval "$(uvx --generate-shell-completion zsh)"' >> ~/.zshrc
~~~



## 四、Python版本管理

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



## 五、UV 镜像配置
配置文件：
- Linux：`~/.config/uv/uv.toml`
- Windows：`%AppData\uv\uv.toml`

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


> [!WARNING]
> 用包管理器装的 uv 不能用`uv self update`升级，`self update`只对官方独立安装脚本装的版本生效。用 winget/dnf/brew 装的要走对应的包管理器升级，比如`brew upgrade uv`。

## 代码检查与格式化工具Ruff
一个Astral主导开发的极速Python代码检查、格式化工具。

~~~bash
# 安装 Ruff
uv tool install ruff

# 更新 Ruff
uv tool update ruff
~~~
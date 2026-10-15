---
title: UV简介与安装
titleTemplate: :title - Python构建工具UV
aside: false
---

# UV简介与安装

## 🤔 UV是什么

Astral 用 Rust 写的 Python 包与项目管理器，把`pip`、`virtualenv`、`pipx`、`poetry`这几个工具收敛成一条命令，依赖解析和安装速度通常比`pip`快一到两个数量级。

## ✨ 为什么选择UV

- 🔧 **工具链一次收敛**：过去装依赖用`pip`、开虚拟环境用`virtualenv`、跑命令行工具用`pipx`、管项目和锁文件用`poetry`，现在这些活都由`uv`一条命令覆盖。
- ⚡ **快**：Rust 实现的依赖解析器加上并行下载，依赖解析与安装速度通常比`pip`快一到两个数量级。
- 🐍 **自带 Python 版本管理**：`uv python`可以直接安装、查看、固定解释器版本，不必再额外装`pyenv`。
- 🔒 **原生锁文件**：依赖声明写在`pyproject.toml`，锁定结果落到`uv.lock`，环境用`uv sync`一键对齐，不用手工维护`requirements.txt`。
- 🌏 **国内可用**：解释器和包索引都能指向镜像源，配置方式见[常用命令与配置](/tools/uv/commands)。

## ⚖️ 相比pip与传统打包工具

| 对比项         | pip 与传统工具链                              | UV                                                      |
| -------------- | --------------------------------------------- | ------------------------------------------------------- |
| 依赖解析与安装 | 纯 Python 实现的解析器，逐个下载              | Rust 实现的解析器，解析与下载并行，通常快一到两个数量级 |
| 需要几个工具   | `pip`、`virtualenv`、`pipx`、`poetry`各管一摊 | 一套命令全覆盖                                          |
| 虚拟环境       | 手工`python -m venv`创建，再激活              | 项目命令自动创建并同步                                  |
| Python 版本    | 依赖`pyenv`等额外工具                         | `uv python install`直接管理解释器                       |
| 锁文件         | `requirements.txt`靠手工维护                  | `uv.lock`自动生成与同步                                 |
| 镜像加速       | 改`pip.conf`                                  | 改`uv.toml`                                             |

> [!TIP]
> 如果暂时不想改掉 pip 的使用习惯，`uv pip install`提供了兼容的 pip 接口，可以平滑过渡；想彻底换掉传统流程时，再用[常用命令与配置](/tools/uv/commands)里的项目管理命令。

## 🚀 如何下载

- **Linux、macOS**：

  ~~~bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  # 或者
  wget -qO- https://astral.sh/uv/install.sh | sh
  ~~~

- **Windows**：

  ~~~powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ~~~

## 🔄 升级与卸载

~~~bash
# 升级
uv self update

# 卸载
uv cache clean
rm -r "$(uv python dir)"
rm -r "$(uv tool dir)"
rm ~/.local/bin/uv ~/.local/bin/uvx
~~~

> [!WARNING]
> 用包管理器装的 uv 不能用`uv self update`升级，`self update`只对官方独立安装脚本装的版本生效。用 winget/dnf/brew 装的要走对应的包管理器升级，比如`brew upgrade uv`。

## 📚 延伸阅读

- 🧭 [UV官方文档](https://docs.astral.sh/uv/)：命令、配置与迁移指南的权威参考。
- 🇨🇳 [UV中文文档](https://uv.doczh.com/)：中文版文档入口。

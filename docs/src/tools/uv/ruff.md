---
title: 代码检查与格式化工具Ruff
titleTemplate: :title - Python构建工具UV
aside: false
---

# 代码检查与格式化工具Ruff

一次调用跑完 900 多条规则，官方口径比 Flake8 快一到两个数量级。

## 🤔 Ruff是什么

Astral（[uv](/tools/uv/)的同一团队）用 Rust 写的 Python 代码检查与格式化工具，一个二进制替掉过去要装一串的东西：Flake8 及其几十个插件、Black、isort、pydocstyle、pyupgrade、autoflake。

内置 900 多条规则，默认开启`F`、`E`、`B`、`UP`、`RUF`等类别，并主动略过与格式化重叠的风格类规则，免得检查和格式化互相打架。Apache Airflow、FastAPI、Pandas、SciPy 这些项目已经把它用在 CI 里。

> [!IMPORTANT]
> Ruff 不是类型检查器。把整数传给了期望字符串的函数这类问题它看不出来，那是`mypy`、`pyright`的活。它接手的是风格与常见错误检查，和类型检查器互补。

## ⚡ 性能如何

官方口径是比现有 linter（如 Flake8）和 formatter（如 Black）快 10-100 倍，基准场景是把 CPython 代码库从头检查一遍。社区实测的数字更大：

- Bokeh 的作者：比 Flake8 快约 150-200 倍，整个仓库从 20 秒降到 0.2 秒。
- Elementl 的创始人：dagster 25 万行代码，Pylint 在 4 核上并行要 2.5 分钟，Ruff 跑完整个代码库 0.4 秒。

快的原因不神秘：Rust 实现、文件并行处理，加上内置缓存让没改动的文件不重复分析。不过倍数和规则集强相关，只开几条规则时差距会缩小，规则开得越多越划算，因为别的工具那边往往是好几个工具各跑一遍。

| 对比项   | 传统工具链                                       | Ruff                                                                          |
| -------- | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| 工具数量 | Flake8 加一堆插件，再加 Black、isort 等          | 一个二进制全覆盖                                                              |
| 执行方式 | 每个工具各跑一遍，插件还要逐个安装               | 一次调用跑完所有已开启的规则                                                  |
| 配置文件 | `setup.cfg`、`.flake8`、`pyproject.toml`各写一份 | 统一写在`pyproject.toml`或`ruff.toml`                                         |
| 自动修复 | 多数工具只报不改                                 | `--fix`直接改，不安全修复要额外加`--unsafe-fixes`                             |
| 兼容性   | —                                                | 与 Black 格式基本一致；替换 Flake8 需要不带插件或插件很少，且是 Python 3 代码 |

## 🚀 安装与更新

~~~bash
# 安装 Ruff
uv tool install ruff

# 更新 Ruff
uv tool update ruff
~~~

> [!TIP]
> Ruff 通过`uv tool`安装后是全局可用的独立命令，用法见[官方文档](https://docs.astral.sh/ruff/)。

## ⌨️ 常用命令

~~~bash
# 检查当前目录及子目录
ruff check

# 只检查指定路径
ruff check src/

# 自动修复能安全修复的问题
ruff check --fix

# 按规则号汇总问题数量，先看分布再决定修哪些
ruff check --statistics

# 文件变动后自动重跑
ruff check --watch

# 查看某条规则的说明与示例
ruff rule E501

# 列出所有规则来源（pycodestyle、pyflakes 等）
ruff linter

# 格式化代码，风格与 Black 基本一致
ruff format

# 只检查格式是否合规，不写回文件
ruff format --check

# 看看会被改成什么样
ruff format --diff

# 清空缓存
ruff clean
~~~

> [!TIP]
> `ruff check --fix`只修安全可自动修复的问题，剩下的要靠`ruff rule <规则号>`看说明手动改。在 CI 里通常跑`ruff check`和`ruff format --check`这两条，前者管质量，后者管格式。

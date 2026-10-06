---
title: 文件完整性监控FileMonitor
layout: doc
---

# 文件完整性监控FileMonitor
用 Rust 写的文件完整性校验守护进程：定时轮询指定文件，比对 SHA-256 哈希，一旦发现内容被改或被删除，就通过 QQ 邮箱 SMTP 发一封 HTML 告警邮件。适合盯住`/etc`下的关键配置、`.bashrc`这类改一下就能影响登录环境的文件。

仓库地址：[github.com/tellcts/file-monitor](https://github.com/tellcts/file-monitor)，MIT 协议。

> [!WARNING]
> 依赖`std::os::unix::fs::PermissionsExt`等 Unix 专有模块，**只支持 Unix-like 系统**，Windows 暂不支持。

## 工作原理
轮询不是每个周期都无脑算哈希，哈希只在必要时才算：

1. 启动时对所有监控文件算一次 SHA-256 建立基线，并发一封启动报告邮件
2. 每隔 N 秒用`stat()`取文件的修改时间和大小
3. mtime 和 size 都没变就跳过，不算哈希
4. 两者任一变化，才重新算 SHA-256 与基线比对
5. 确认变化或文件被删，发告警邮件
6. 收到 SIGTERM/SIGINT 时保存基线并发送退出通知

mtime+size 快速筛选是整个设计里最关键的一步：绝大多数轮询周期里只做一次`stat()`系统调用，CPU 开销可以忽略，所以间隔设成 30 秒甚至更短也很轻。

## 构建与安装
要求 Rust 1.85+（edition 2024）与 Linux x86-64。

~~~bash
cargo build --release
sudo cp target/release/fm /usr/local/bin/
~~~

## 快速开始

~~~bash
# 1. 初始化配置
fm init

# 2. 编辑配置（填入邮箱授权码）
vim ~/.file_monitor/config.toml

# 3. 启动
fm run
~~~

> [!TIP]
> 建议先跑`fm run -v`看一轮详细日志，确认基线建立和邮件发送都正常，再改成静默模式常驻。

## 命令一览

| 命令 | 说明 |
| --- | --- |
| `fm init` | 生成配置文件模板 |
| `fm add -r "email"` | 添加收件人 |
| `fm add -f "/path/to/file"` | 添加监控文件 |
| `fm remove -r "email"` | 移除收件人 |
| `fm remove -f "/path/to/file"` | 移除监控文件 |
| `fm interval 60` | 设置轮询间隔（秒） |
| `fm paths` | 显示配置和基线文件路径 |
| `fm files` | 显示当前监控的文件列表 |
| `fm run` | 启动守护进程 |
| `fm run -v` | 启动（详细日志） |

所有状态都存在`~/.file_monitor/`下，记不清路径时用`fm paths`查看。

## 配置文件

`~/.file_monitor/config.toml`：

~~~toml
[smtp]
host = "smtp.qq.com"
port = 465
username = "your-email@qq.com"
auth_code = "your-authorization-code"
from_name = "File Monitor"

[notification]
to = ["admin@qq.com"]
subject_prefix = "[FileMonitor]"

[monitor]
interval_seconds = 30

[[files]]
path = "/home/<username>/.bashrc"

[[files]]
path = "/home/<username>/.bash_profile"
~~~

> [!IMPORTANT]
> `auth_code`填的是 QQ 邮箱的 SMTP 授权码，不是登录密码。获取路径：登录 QQ 邮箱 → 设置 → 账户 → 开启 POP3/SMTP 服务 → 生成授权码。

## 安全
`fm init`会顺手收紧权限，避免授权码被同机其他用户读到：

~~~
drwx------  ~/.file_monitor/              # 700
-rw-------  ~/.file_monitor/config.toml   # 600
-rw-------  ~/.file_monitor/store.json    # 600
~~~

## 技术栈
- **CLI**：`clap` 4，用`derive`宏声明子命令
- **配置与持久化**：`serde` + `toml`读配置，`serde_json`存基线（记录每个文件的 hash、mtime、size）
- **哈希**：`sha2` + `hex`，输出 64 位十六进制摘要
- **邮件**：`lettre` 0.11，走纯 Rust 的`rustls-tls`，不依赖系统 OpenSSL
- **异步**：`tokio`桥接 lettre 的异步 SMTP 发送
- **其他**：`chrono`记时间戳（邮件里转北京时间显示），`log` + `env_logger`输出日志，`ctrlc`捕获信号做优雅退出

## 项目结构
~~~
src/
├── main.rs      # CLI 入口、子命令路由、轮询主循环、信号处理
├── config.rs    # TOML 配置解析
├── store.rs     # 哈希基线 JSON 持久化
├── monitor.rs   # 文件扫描、mtime+size 筛选、SHA-256 计算、变化比对
├── mailer.rs    # SMTP 发送与 HTML 邮件模板
└── lib.rs       # 库根节点，供集成测试引用
tests/
└── integration_test.rs  # 完整流程集成测试
~~~

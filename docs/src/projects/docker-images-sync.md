---
title: 用GitHub镜像服务免费加速Docker镜像拉取
layout: doc
aside: false
---

<h1 align="center">用GitHub镜像服务免费加速Docker镜像拉取</h1>

## 🌐 ghcr.io是什么 {#what-is-ghcr}

`ghcr.io`是GitHub Container Registry的访问域名，也就是GitHub提供的容器镜像仓库。它兼容标准Docker Registry协议，可以像Docker Hub一样存储和拉取容器镜像，并直接复用GitHub账号、仓库和组织权限。

`docker-images-sync`使用GitHub Actions和Skopeo，把配置中的Docker Hub镜像按`linux/amd64`架构增量复制到GHCR。它是镜像同步模板，不是实时代理、镜像构建器、漏洞扫描器或供应链审计工具。

项目地址：[**github.com/tellcts/docker-images-sync**](https://github.com/tellcts/docker-images-sync)

## 🚏 两种使用方式 {#usage-modes}

项目提供两条路径：直接使用作者已经同步的镜像，或者Fork后同步到自己的GHCR。

| 使用方式 | 镜像地址 | 适合场景 |
| --- | --- | --- |
| 直接使用作者镜像 | `ghcr.io/tellcts/<name>:<tag>` | 想立即使用，不维护Actions |
| 自行同步 | `ghcr.io/<your-owner>/<name>:<tag>` | 需要独立存储、权限和更新控制 |

### ⚡ 直接使用作者镜像 {#use-author-images}

如果对应Package已经公开，可以直接拉取：

~~~bash
docker pull ghcr.io/tellcts/nginx:1.30.5
docker pull ghcr.io/tellcts/postgres:18.6
~~~

作者镜像没有可用性SLA，标签也可能随`images.yml`调整。匿名拉取失败时，Package可能尚未公开，也可能需要登录GHCR。

> [!IMPORTANT]
> 生产环境或需要长期稳定版本时，更推荐Fork后自行同步。自己维护GHCR Package、权限和标签，不会受作者仓库后续调整影响。

### 🛠️ 自行同步 {#sync-yourself}

Fork项目并启用Actions后，镜像会同步到你自己的账号：

~~~text
ghcr.io/<your-owner>/<name>:<tag>
~~~

目标地址中的`owner`由运行工作流时的仓库所有者决定。比如`tellcts/docker-images-sync`同步`nginx:1.30.5`后，目标地址就是`ghcr.io/tellcts/nginx:1.30.5`。

## 🆓 为什么可以免费加速 {#free}

这套方案不需要购买服务器、域名或额外存储，核心是把GitHub已有的能力串起来：

| 环节 | 使用的免费能力 | 作用 |
| --- | --- | --- |
| 执行同步 | GitHub Actions | 在GitHub托管运行器上读取并复制镜像 |
| 保存镜像 | GHCR公开Package | 存放镜像清单和层 |
| 下载镜像 | GitHub容器分发网络 | 本地、CI或服务器直接从GHCR拉取 |
| 身份认证 | `GITHUB_TOKEN` | 工作流自动登录GHCR，无需额外Secret |

公共仓库可以使用GitHub托管的标准运行器，公开的GHCR Package也不收取存储和流量费用。因此，个人开发、家庭实验室和团队内部同步常用镜像，不需要单独维护一台镜像服务器。

> [!TIP]
> 免费不等于无限。GitHub Actions和GHCR仍受GitHub服务条款、用量策略及合理使用限制约束，不适合用来搭建面向公众的高并发镜像分发平台。

## ✨ 项目特性 {#features}

- **增量同步**：GHCR中已存在的固定标签直接跳过，不重复推送。
- **更新`latest`**：只有当源镜像与GHCR的`linux/amd64` digest不同时才更新。
- **多标签支持**：同一个镜像可以同时维护固定版本、稳定标签和`latest`。
- **失败保护**：查询GHCR时遇到网络或鉴权错误会终止任务，不会把查询失败误判为镜像不存在。
- **并发保护**：手动、定时和推送任务不会并行修改同一仓库。
- **同步前测试**：工作流先运行离线测试，测试失败时不会登录或推送镜像。
- **无需额外Secret**：直接使用Actions自动提供的`GITHUB_TOKEN`。

## 🧭 工作原理 {#how-it-works}

工作流会读取`images.yml`，逐个镜像、逐个标签检查GHCR中的目标状态：

~~~text
images.yml
    │
    ▼
检查 GHCR 目标标签
    │
    ├── 固定标签已存在 ──▶ 跳过
    ├── 标签不存在 ──────▶ 复制镜像
    └── latest 且 digest 不同 ──▶ 更新镜像
~~~

完整流程如下：

1. 检出仓库，运行`bash tests/sync-images.test.sh`做离线测试。
2. 安装`yq`和`skopeo`。
3. 使用`GITHUB_TOKEN`登录`ghcr.io`。
4. 读取`images.yml`并逐个处理镜像标签。
5. 使用`skopeo copy --preserve-digests --override-os linux --override-arch amd64`复制缺失或需要更新的镜像。

`--preserve-digests`会尽量保留原有镜像摘要；复制过程不会启动容器，也不会重新构建镜像。当前工作流只处理`linux/amd64`，因此ARM64、Apple Silicon原生容器等场景无法直接使用新建的固定标签。

## 🚀 快速开始 {#quickstart}

### 1️⃣ Fork或导入仓库 {#fork-repository}

Fork本项目，或者在GitHub上创建自己的仓库并导入这些文件。目标GHCR地址由运行时仓库的所有者决定：

~~~text
ghcr.io/<owner>/<name>:<tag>
~~~

### 2️⃣ 启用Actions {#enable-actions}

进入仓库的**Actions**页面，确认`Sync Images to GHCR`工作流已经启用。

工作流已经包含操作GHCR所需权限：

~~~yaml
permissions:
  contents: read
  packages: write
~~~

因为使用的是GitHub自动提供的`GITHUB_TOKEN`，不需要再创建Personal Access Token或添加额外Secret。

### 3️⃣ 配置镜像 {#configure-images}

编辑仓库根目录的`images.yml`。`tag`既可以写单个字符串，也可以写数组：

~~~yaml
images:
  - name: nginx
    source: nginx
    tag:
      - "1.30.5"
      - "latest"

  - name: postgres
    source: postgres
    tag: "18.6"
~~~

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | GHCR中的目标镜像名称 |
| `source` | 是 | Docker Hub源镜像名称，不包含标签或`docker://`前缀 |
| `tag` | 是 | 单个标签字符串，或标签字符串列表 |

建议给所有标签加引号，避免`18.6`等内容被YAML解析成数字，也方便兼容不同版本解析器。

### 4️⃣ 运行同步 {#run-sync}

工作流有三种触发方式：

| 触发方式 | 时间或条件 |
| --- | --- |
| Push | 推送到`main`分支 |
| Schedule | 每天`07:00 UTC`，即北京时间`15:00` |
| Manual | 在Actions页面手动运行`Sync Images to GHCR` |

修改`images.yml`并推送到`main`后，新增标签会进入同步流程。定时任务可能因GitHub负载延迟，并且只从仓库默认分支运行。公开仓库长期没有活动时，定时工作流可能被自动停用，重新推送提交或手动运行即可恢复。

同步完成后，到GitHub的**Packages**页面检查Package是否公开、是否与仓库正确关联，以及匿名拉取是否符合预期。

## 📋 同步规则 {#sync-rules}

| 标签类型 | GHCR状态 | 行为 |
| --- | --- | --- |
| 非`latest` | 已存在 | 跳过，不查询源镜像 |
| 非`latest` | 不存在 | 复制`linux/amd64`镜像 |
| `latest` | 不存在 | 复制`linux/amd64`镜像 |
| `latest` | digest相同 | 跳过 |
| `latest` | digest不同 | 更新`linux/amd64`镜像 |
| 任意标签 | 查询发生网络或鉴权错误 | 任务失败，不执行复制 |

只有标签名称完全等于`latest`才会比较digest并自动更新。`stable`、`main`、`trixie`等移动标签仍然按固定标签处理，只要GHCR中已经存在就不会刷新。

## 📦 使用同步镜像 {#use-images}

同步完成后，把原来的Docker Hub地址替换成GHCR地址即可：

~~~bash
# Docker Hub
docker pull nginx:1.30.5

# 作者已同步的公开镜像
docker pull ghcr.io/tellcts/nginx:1.30.5

# 自己同步的镜像
docker pull ghcr.io/<your-owner>/nginx:1.30.5
~~~

直接运行容器时也只替换镜像地址：

~~~bash
docker run -d --name web -p 8080:80 ghcr.io/<your-owner>/nginx:1.30.5
~~~

在Dockerfile中使用：

~~~dockerfile
FROM ghcr.io/<your-owner>/postgres:18.6
~~~

在Docker Compose中使用：

~~~yaml
services:
  redis:
    image: ghcr.io/<your-owner>/redis:7.4.11
    restart: unless-stopped
~~~

如果目标Package是私有的，拉取前需要登录：

~~~bash
echo "$GHCR_TOKEN" \
  | docker login ghcr.io -u <github-username> --password-stdin
~~~

推荐使用带`read:packages`权限的Personal Access Token或Actions的`GITHUB_TOKEN`，不要使用GitHub账号密码。

## 🐳 默认镜像清单 {#catalog}

项目自带一批常用镜像，可以作为个人配置的起点：

| 镜像 | 源镜像 | 标签 |
| --- | --- | --- |
| nginx | `nginx` | `1.30.5` |
| ubuntu | `ubuntu` | `24.04` |
| postgres | `postgres` | `18.6` |
| mysql | `mysql` | `8.4.11` |
| redis | `redis` | `7.4.11` |
| alpine | `alpine` | `3.23.6` |
| debian | `debian` | `trixie` |
| mongo | `mongo` | `8.3.11` |
| prometheus | `prom/prometheus` | `v3.13.4` |
| node-exporter | `prom/node-exporter` | `v1.11.1` |
| grafana | `grafana/grafana` | `13.2.3` |
| texlive | `texlive/texlive` | `latest` |

完整配置以仓库中的`images.yml`为准，作者也可能随时调整标签。

## 🧪 本地运行 {#local-run}

本地运行需要Linux或兼容的Bash环境，以及`yq`和`skopeo`。Ubuntu/Debian可以这样安装：

~~~bash
sudo apt-get update
sudo apt-get install -y yq skopeo
~~~

先运行离线测试：

~~~bash
bash tests/sync-images.test.sh
~~~

测试使用模拟的`yq`和`skopeo`，不会访问Docker Hub或GHCR。确认真实同步时，先登录GHCR，再设置目标仓库所有者并运行脚本：

~~~bash
echo "$GHCR_TOKEN" \
  | skopeo login ghcr.io -u <github-username> --password-stdin

REGISTRY=ghcr.io \
OWNER=<github-owner> \
bash scripts/sync-images.sh
~~~

脚本默认读取当前目录的`images.yml`，也可以通过`IMAGES_FILE`指定其他文件：

~~~bash
IMAGES_FILE=/path/to/images.yml bash scripts/sync-images.sh
~~~

## ⚠️ 注意事项 {#limits}

### 🖥️ 仅支持`linux/amd64` {#linux-amd64-only}

新建和更新的标签都是单平台镜像。这能减少CI时间、网络流量和GHCR存储占用，但不适用于ARM64、Apple Silicon原生容器或其他架构。如果GHCR中已经存在旧的多架构标签，当前工作流不会自动将其改成单架构。

### 📌 固定标签不会自动刷新 {#fixed-tags}

固定标签只要在GHCR中已经存在就会被跳过。即使上游用同名标签重新发布了不同内容，本项目也不会自动覆盖。需要更新时，应先删除GHCR中的旧标签，再重新运行工作流。删除标签不可逆，操作前要确认没有服务仍依赖它。

### 🔐 Package可见性 {#package-visibility}

首次同步可能创建新的GHCR Package。Package可见性通常会继承仓库或组织设置，但GitHub默认行为可能变化。同步后应检查Package是Public还是Private、是否与仓库正确关联，以及匿名拉取是否正常。

### 🚦 Docker Hub限流 {#docker-hub-rate-limits}

当前工作流使用匿名方式读取Docker Hub，可能受到限流、镜像暂时不可用或上游标签删除的影响。它不是实时镜像代理，也不会同步需要登录才能访问的私有Docker Hub镜像。

### ⏳ 镜像不是即时更新 {#sync-delay}

镜像只在`main`推送、每日定时或手动运行时同步。GitHub Actions可能排队，Docker Hub也可能延迟更新标签。生产环境应优先使用固定版本或digest，不要依赖`latest`。

### 🗑️ 工作流不会删除镜像 {#no-image-deletion}

从`images.yml`移除配置不会删除GHCR中已有的Package或标签。旧镜像需要手动清理，并且要先确认没有服务仍在使用。

### ✅ 同步前测试是强制门禁 {#test-gate}

工作流会先运行`bash tests/sync-images.test.sh`。测试失败时，安装工具、登录GHCR和同步镜像都不会执行，避免错误逻辑覆盖现有镜像。

## ⚖️ 许可与合规 {#license}

本项目代码和文档采用[MIT许可](https://github.com/tellcts/docker-images-sync/blob/main/LICENSE)，可以复制、修改、分发或商业使用，但需要保留原始版权声明和许可证文本。

> [!WARNING]
> MIT许可只适用于本仓库，不适用于同步的任何上游镜像。镜像仍受原始许可证、服务条款、商标政策、出口管制和再分发规则约束。同步到GHCR不会改变镜像许可证，也不代表可以无条件公开再分发。

在配置或公开敏感、专有、商业受限镜像前，应先确认上游许可。必要时使用私有GHCR Package并限制访问权限。镜像同步成功也不代表镜像安全、无漏洞或适合生产环境。

## 📚 项目文档 {#details}

- [README](https://github.com/tellcts/docker-images-sync)：完整使用说明、同步规则和合规注意事项。
- [images.yml](https://github.com/tellcts/docker-images-sync/blob/main/images.yml)：默认镜像清单。
- [sync-images.yml](https://github.com/tellcts/docker-images-sync/blob/main/.github/workflows/sync-images.yml)：GitHub Actions工作流。
- [sync-images.sh](https://github.com/tellcts/docker-images-sync/blob/main/scripts/sync-images.sh)：镜像查询、跳过和复制逻辑。
- [sync-images.test.sh](https://github.com/tellcts/docker-images-sync/blob/main/tests/sync-images.test.sh)：本地离线测试。

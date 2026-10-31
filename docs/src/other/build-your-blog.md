---
title: 从0到1免费构建你的个人博客
titleTemplate: :title - 其他
aside: false
---

# 从0到1免费构建你的个人博客 {#build-your-blog}

拥有一个自己的网站并不需要先买服务器。只要准备好域名之外的基础工具，就可以用VitePress生成本地静态页面，再让GitHub Actions在每次推送代码后自动构建，并把结果发布到GitHub Pages。

这份教程会从空文件夹开始，按照VitePress官方的默认初始化流程搭建个人博客，最后得到一套完全属于自己的内容目录、导航系统、文章页面和自动化部署流程。

> [!TIP]
> 使用公开仓库时，GitHub Pages可以免费托管静态网站。网站源码和文章仍然掌握在自己手里，Markdown文件就是最可靠的备份。

## 🎯 教程目标 {#goals}

完成教程后，你会得到一个可以公开访问的博客：

- 使用Markdown撰写文章，不需要维护数据库。
- 通过VitePress生成静态HTML、CSS和JavaScript。
- 使用本地搜索查找文章内容。
- 把代码推送到`main`分支后自动部署。
- 后续新增文章时，只需新建Markdown文件并补充导航配置。

整个方案适合个人博客、项目文档和知识库。它不适合依赖登录、实时数据库或服务端接口的应用。

## ✅ 开始前准备 {#preparation}

需要准备以下工具：

| 工具 | 用途 |
| ---- | ---- |
| Git | 管理版本并推送代码 |
| Node.js | 运行VitePress和构建脚本 |
| pnpm或npm | 安装依赖、运行开发与构建命令 |
| 代码编辑器 | 编写Markdown和配置文件 |
| GitHub账号 | 存放仓库并免费部署网站 |

Node.js可以从[Node.js官网](https://nodejs.org/)下载。推荐使用Node.js 24，并优先选择pnpm；不想额外安装包管理器时，可以直接使用Node.js自带的npm。

检查环境：

::: code-group

~~~bash [pnpm]
npm install -g pnpm@12.9.1
node --version
pnpm --version
git --version
~~~

~~~bash [npm]
node --version
npm --version
git --version
~~~

:::

> [!IMPORTANT]
> 安装pnpm后如果命令提示“找不到pnpm”，先关闭并重新打开终端。Windows用户还需要确认Node.js安装时已经把相关命令加入`PATH`。

## 🚀 初始化项目 {#initialize}

创建一个空目录并进入其中：

~~~bash
mkdir my-blog
cd my-blog
~~~

安装VitePress并启动官方初始化向导：

::: code-group

~~~bash [pnpm]
pnpm add -D vitepress
pnpm vitepress init
~~~

~~~bash [npm]
npm add -D vitepress
npx vitepress init
~~~

:::

向导会依次询问配置目录、站点名称、站点描述、主题和TypeScript设置。可以直接使用下面的选择：

- 配置目录选择`./docs`。
- 主题选择`Default Theme`。
- 配置和主题文件使用TypeScript。
- 允许向导向`package.json`添加VitePress命令。

完成之后，向导会自动生成`docs/.vitepress/config.mts`、`docs/index.md`和示例Markdown文件，并在`package.json`中写入开发、构建和预览脚本。

~~~json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
~~~

接下来编辑向导生成的`docs/.vitepress/config.mts`：

~~~ts
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '我的博客',
  description: '记录技术、项目和生活',
  lang: 'zh-CN',
  lastUpdated: true,

  markdown: {
    lineNumbers: true,
  },

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      {
        text: '其他',
        items: [{ text: '关于本站', link: '/about' }],
      },
    ],

    sidebar: {
      '/posts/': [
        {
          text: '全部文章',
          collapsed: false,
          items: [{ text: '第一篇文章', link: '/posts/hello-world' }],
        },
      ],
    },

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/你的用户名' },
    ],
  },
});
~~~

把配置中的站点名称和GitHub地址换成自己的信息。这里不需要额外设置`srcDir`，因为内容已经放在VitePress默认的`docs/`目录中。`nav`控制顶部导航，`items`数组会生成可展开的下拉菜单；`sidebar`控制某个路径下的侧边栏。

> [!TIP]
> VitePress默认主题不要求每个文件都手写HTML。一个Markdown文件会自动变成一个页面，配置只负责决定入口如何展示、侧边栏如何组织。

## 🧱 项目总体架构 {#architecture}

使用官方初始化向导并选择`./docs`、`Default Theme`和TypeScript后，VitePress默认生成的项目结构如下：

~~~text
my-blog/
├── docs/
│   ├── .vitepress/
│   │   └── config.mts
│   ├── api-examples.md
│   ├── index.md
│   └── markdown-examples.md
├── package.json
└── pnpm-lock.yaml
~~~

各部分的职责如下：

- `docs/.vitepress/config.mts`：配置站点标题、导航栏、侧边栏、搜索和页面地址。
- `docs/api-examples.md`和`docs/markdown-examples.md`：VitePress提供的示例文章，可以保留阅读，也可以删除。
- `docs/index.md`：网站首页。
- `docs/`：站点根目录。后续创建的Markdown文章和资源目录都放在这里，目录结构会直接映射为网站路径。
- `package.json`：记录项目依赖和开发、构建、预览命令。
- `pnpm-lock.yaml`或`package-lock.json`：记录实际依赖版本，使用哪个包管理器就提交对应的锁文件。

教程后续会在这个默认结构上创建`docs/posts/`、`docs/assets/images/`和`docs/public/`，用于放文章、文章图片和原样输出的公共资源；部署时还会在仓库根目录添加`.github/workflows/deploy.yml`。这些目录都不由官方初始化向导自动生成。

默认情况下，`docs/`就是站点的内容根目录：

~~~text
docs/index.md            -> /
docs/about.md            -> /about
docs/posts/hello.md      -> /posts/hello
~~~

`.vitepress/`有特殊用途，不会直接生成文章页面。构建完成后，静态文件会输出到`docs/.vitepress/dist/`，这个目录只用于预览和部署，不需要提交到仓库。

## 🏠 配置首页与导航 {#home-and-navigation}

编辑向导生成的`docs/index.md`。首页使用`layout: home`开启VitePress提供的主页布局，并在`features`中展示主要栏目：

~~~md
---
layout: home

hero:
  name: 我的博客
  text: 记录学习与生活
  tagline: 用Markdown写下值得长期保存的内容。
  actions:
    - theme: brand
      text: 开始阅读
      link: /posts/hello-world

features:
  - title: 技术文章
    details: 记录工具、项目和开发过程中的实践经验。
    link: /posts/
    linkText: 查看文章
  - title: 个人项目
    details: 展示自己完成的项目，以及背后的设计思路。
    link: /projects/
    linkText: 浏览项目
---
~~~

首页的`features`适合放3到6个核心入口。栏目逐渐增多时，可以像本站一样使用Font Awesome图标并补充颜色，但先保证链接和内容准确，再考虑装饰。

导航和侧边栏都由`config.mts`手动配置。新增文章后，需要在侧边栏中添加对应链接：

~~~ts
sidebar: {
  '/posts/': [
    {
      text: '全部文章',
      collapsed: false,
      items: [
        { text: '第一篇文章', link: '/posts/hello-world' },
        { text: 'VitePress入门', link: '/posts/vitepress-guide' },
      ],
    },
  ],
}
~~~

路径规则要保持一致：文件是`docs/posts/vitepress-guide.md`，页面链接就写`/posts/vitepress-guide`。不要写本地文件路径。

## ✍️ 撰写文章 {#writing}

新建`docs/posts/hello-world.md`：

~~~md
---
title: 第一篇文章
description: 记录博客搭建完成后的第一篇文章。
---

# 第一篇文章 {#first-post}

这里是正文。

## 一个二级标题 {#section-one}

可以写`行内代码`、**粗体文字**，也可以插入[链接](https://vitepress.dev/)。
~~~

Markdown文件开头的两行`---`之间是frontmatter。最常用字段有：

| 字段 | 作用 |
| ---- | ---- |
| `title` | 页面标题，也会用于浏览器标题 |
| `description` | 页面摘要，供搜索引擎和分享预览使用 |
| `outline` | 页面右侧目录的层级，例如`[2, 3]` |
| `aside` | 是否显示右侧区域，设为`false`可关闭 |

正文中最常用的格式如下：

- `#`到`######`表示六级标题。
- `[文字](/posts/hello-world)`创建站内链接。
- `![图片说明](../assets/images/example.png)`插入文章图片。
- `> [!TIP]`、`> [!IMPORTANT]`和`> [!WARNING]`创建提示块。
- 三反引号代码块可以标记语言；本站统一使用三个波浪线包围代码，避免和示例中的反引号冲突。

给标题添加稳定的ASCII锚点：

~~~md
## 常用配置 {#common-config}
~~~

之后就可以用`/posts/hello-world#common-config`直接跳转到这一节。中文标题也可以自动生成锚点，但自己声明ASCII ID更容易在侧边栏和外部链接中复用。

### 图片应该放在哪里 {#where-to-put-images}

文章专属截图建议放在`docs/assets/images/`。如果文章位于`docs/posts/`，从文章引用时使用相对路径：

~~~md
![VitePress运行效果](../assets/images/vitepress-preview.png)
~~~

需要固定网址、不需要构建处理的文件则放在`docs/public/`，并通过根路径引用：

~~~md
![网站图标](/favicon.png)
~~~

> [!WARNING]
> 不要用本地绝对路径引用图片。`C:\Users\...`或`/Users/...`只在你的电脑上有效，构建完成后会变成无法访问的图片链接。

### 代码块与目录 {#code-and-outline}

代码块中标记语言可以获得语法高亮：

~~~ts
const siteName = '我的博客';
console.log(siteName);
~~~

长文章建议保留页面右侧目录。配置`outline: [2, 3]`只显示二级和三级标题，页面结构会更清楚：

~~~md
---
title: 一篇较长的文章
outline: [2, 3]
---
~~~

## 🧪 本地预览与构建 {#preview-and-build}

启动开发服务器：

::: code-group

~~~bash [pnpm]
pnpm docs:dev
~~~

~~~bash [npm]
npm run docs:dev
~~~

:::

终端会显示一个本地地址，通常是`http://localhost:5173`。修改Markdown或配置后，页面会自动刷新。

生成正式构建产物：

::: code-group

~~~bash [pnpm]
pnpm docs:build
~~~

~~~bash [npm]
npm run docs:build
~~~

:::

构建结果位于`docs/.vitepress/dist/`。这个目录已经被`.gitignore`忽略，不需要提交。

在本地预览构建结果：

::: code-group

~~~bash [pnpm]
pnpm docs:preview
~~~

~~~bash [npm]
npm run docs:preview
~~~

:::

开发服务器能显示但正式构建失败时，优先查看终端中的完整报错。常见原因包括配置语法错误、frontmatter格式不正确，以及图片路径的大小写不一致。

> [!TIP]
> Linux和GitHub Actions区分文件名大小写，Windows通常不区分。开发时用`Hero.png`、引用时写`hero.png`，本机可能正常，部署后却会显示破图。

## 🚢 部署到GitHub Pages {#github-pages}

### 选择仓库名称 {#repository-name}

先在GitHub创建一个公开仓库。仓库名称会影响网站地址：

| 仓库名称 | 访问地址 | 是否需要设置`base` |
| -------- | -------- | ------------------ |
| `用户名.github.io` | `https://用户名.github.io/` | 否 |
| `my-blog` | `https://用户名.github.io/my-blog/` | 是 |

仓库路径、`base`配置和自定义域名等细节，可以参考VitePress官方的[GitHub Pages部署说明](https://vitepress.dev/zh/guide/deploy#github-pages)。

如果要使用项目仓库名，在VitePress配置中加入：

~~~ts
export default defineConfig({
  base: '/my-blog/',
});
~~~

`base`必须和仓库名一致，末尾也要保留斜杠。本站使用`tellcts.github.io`作为仓库名，所以可以直接部署在域名根路径。

### 创建自动部署工作流 {#create-workflow}

在仓库中创建`.github/workflows/deploy.yml`。下面是VitePress官方提供的GitHub Pages工作流示例：

~~~yaml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v4 # 如果使用 pnpm，请取消此区域注释
      #   with:
      #     version: 9
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
~~~

这段工作流完成六个步骤：

1. 检出`main`分支的代码。
2. 安装Node.js 24并恢复依赖缓存。
3. 配置GitHub Pages。
4. 安装依赖并构建VitePress静态网站。
5. 上传构建产物。
6. 发布到GitHub Pages。

### 开启GitHub Pages {#enable-github-pages}

首次部署前，进入GitHub仓库的`Settings`，打开`Pages`，把`Build and deployment`中的`Source`设为`GitHub Actions`。然后在本地提交所有文件并推送到`main`：

~~~bash
git add .
git commit -m "feat: initialize VitePress blog"
git push origin main
~~~

工作流运行结束后，可以在仓库的`Actions`页面查看每一步日志，也可以在`Settings > Pages`中找到网站地址。

之后每次修改文章并推送到`main`，GitHub都会自动重新构建和部署，不需要手动上传生成文件。

> [!IMPORTANT]
> 使用pnpm时要提交`pnpm-lock.yaml`，使用npm时要提交`package-lock.json`，否则CI无法按锁文件安装依赖。构建产物`docs/.vitepress/dist/`不需要提交到Git。

### 免费方案的使用边界 {#free-plan}

公开仓库的静态站点可以免费使用GitHub Pages和标准GitHub Actions额度。GitHub Pages适合静态HTML、CSS和JavaScript文件，不提供数据库或传统服务端运行环境。

如果以后需要评论、访问统计或搜索服务，可以像本站一样接入第三方静态服务，并单独评估它们的免费额度、隐私政策和稳定性。

## 💬 接入Giscus评论区 {#giscus-comments}

静态网站没有自己的服务端，但可以通过Giscus把评论保存在GitHub Discussions中。读者使用GitHub账号登录并发表评论，网站不需要数据库，也不需要单独维护评论接口。

### 准备GitHub Discussions {#giscus-github}

1. 打开博客所在仓库的`Settings`。
2. 在`General`页面找到`Features`，勾选`Discussions`。
3. 打开仓库的`Discussions`页面，创建一个分类，例如`Blog Comments`，类型建议选择`Announcements`。
4. 打开[Giscus GitHub App](https://github.com/apps/giscus)，把博客仓库授权给Giscus。

仓库需要保持公开，Giscus才能读取公开的Discussion数据。评论内容会真实写入该仓库的Discussions，因此不要把它当成完全匿名或私有留言板。

### 获取Giscus配置 {#giscus-config}

打开[Giscus配置页面](https://giscus.app/zh-CN)，填写仓库名称并选择刚创建的Discussion分类。建议使用以下配置：

| 配置项 | 建议值 |
| ------ | ------ |
| Discussion映射 | `pathname` |
| 启用反应 | 开启 |
| 评论输入位置 | 顶部 |
| 主题 | 跟随网站明暗模式 |
| 语言 | `zh-CN` |

配置页面会生成`data-repo-id`和`data-category-id`。这两个ID用于定位仓库和分类，需要和下面代码中的值完全一致。

### 安装Giscus组件 {#giscus-install}

::: code-group

~~~bash [pnpm]
pnpm add @giscus/vue vue
~~~

~~~bash [npm]
npm add @giscus/vue vue
~~~

:::

### 创建评论组件 {#giscus-component}

在`docs/.vitepress/theme/`中创建`GiscusComment.vue`：

~~~vue
<script setup lang="ts">
import Giscus from '@giscus/vue';
import { useData, useRoute } from 'vitepress';

const { isDark } = useData();
const route = useRoute();
</script>

<template>
  <div class="giscus-container">
    <Giscus
      :key="`${route.path}-${isDark ? 'dark' : 'light'}`"
      repo="你的用户名/你的仓库名"
      repo-id="R_xxx"
      category="Blog Comments"
      category-id="DIC_xxx"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="1"
      input-position="top"
      :theme="isDark ? 'dark' : 'light'"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.giscus-container {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
~~~

`pathname`映射会让每个文章路径拥有独立的讨论。切换页面或站点明暗模式时，`key`会重新创建评论组件，避免继续显示上一页的评论区。

### 挂载到VitePress主题 {#giscus-theme}

创建或编辑`docs/.vitepress/theme/index.ts`：

~~~ts
import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import GiscusComment from './GiscusComment.vue';

export default {
  extends: DefaultTheme,

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(GiscusComment),
    });
  },
};
~~~

`doc-after`会把评论组件挂到每篇文档正文之后。首页使用独立布局，不会自动显示评论区。

### 限制允许的网站来源 {#giscus-origins}

可以在仓库根目录创建`giscus.json`，只允许正式域名和本地开发服务器加载评论：

~~~json
{
  "origins": ["https://你的用户名.github.io"],
  "originsRegex": [
    "http://localhost:[0-9]+",
    "http://127\\.0\\.0\\.1:[0-9]+"
  ]
}
~~~

### 验证评论区 {#giscus-verify}

启动本地开发服务器，打开任意文章页面。评论区首次加载时可能显示“未找到匹配的Discussion”，发表第一条评论后，Giscus会按照页面路径创建对应讨论。

如果评论区没有显示，依次检查：

- 仓库的Discussions是否启用。
- Giscus App是否有该仓库的访问权限。
- `repo`、`repo-id`、`category`和`category-id`是否与配置页面一致。
- 正式域名是否包含在`giscus.json`中。
- 浏览器控制台是否拦截了Giscus的跨域请求。

## 🔎 发布前检查 {#publish-checklist}

推送前依次确认：

- 首页、导航栏和侧边栏中的链接都能打开。
- 新文章已经加入对应侧边栏。
- 图片路径使用相对路径或`public`目录的根路径。
- 本地构建命令可以成功完成。
- 部署工作流使用`main`分支，Pages的来源已设为GitHub Actions。
- `pnpm-lock.yaml`或`package-lock.json`已经提交。
- 启用Giscus时，仓库、分类和站点来源配置正确。
- 仓库中没有令牌、密码或私人信息。

静态博客的意义不只是省下服务器费用，更重要的是把内容的组织方式变成一个清楚、可维护、可迁移的目录。即使以后更换部署平台，`docs/`中的Markdown仍然可以直接带走。

## 📚 延伸阅读 {#further-reading}

- [VitePress快速开始](https://vitepress.dev/zh/guide/getting-started)：官方安装步骤和项目初始化说明。
- [VitePress站点配置](https://vitepress.dev/zh/reference/site-config)：标题、`base`、内容目录和构建选项。
- [VitePress默认主题](https://vitepress.dev/zh/reference/default-theme-config)：导航栏、侧边栏、搜索和首页功能卡片配置。
- [GitHub Pages部署文档](https://docs.github.com/zh/pages/getting-started-with-github-pages)：仓库、发布来源和自定义域名。
- [GitHub Actions文档](https://docs.github.com/zh/actions)：查看工作流日志、权限和运行记录。
- [Giscus官方文档](https://giscus.app/zh-CN)：创建Discussion分类、生成配置和查看主题参数。
- [Giscus Vue组件](https://github.com/giscus/giscus-component/tree/main/vue)：在Vue或VitePress中渲染评论区的组件用法。

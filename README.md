# Tzcan Blog

一个记录开源工具、技术笔记和个人项目的静态博客。

[🌐 在线访问](https://tellcts.github.io)

## ✨ 内容

- 🧰 **开源工具**：介绍日常在用的开源工具，并提供可以直接上手的配置与使用教程。
- 📝 **技术笔记**：整理学习过程中的知识点、案例与思考，方便复习和查阅。
- 📦 **个人项目**：分享自己开发的开源项目，记录用途、实现思路和使用方法。

## 🛠️ 技术栈

- [VitePress](https://vitepress.dev/)
- Vue
- GitHub Pages
- pnpm
- Prettier

## 🚀 本地运行

需要Node.js和pnpm。

~~~bash
pnpm install
pnpm docs:dev
~~~

其他常用命令：

~~~bash
pnpm docs:build
pnpm docs:preview
pnpm format
~~~

## 📁 项目结构

~~~text
docs/
├── .vitepress/
│   ├── config.mts
│   └── theme/
└── src/
    ├── notes/
    ├── projects/
    └── tools/
~~~

## 🚢 部署

推送到`main`分支后，GitHub Actions会自动构建并部署到GitHub Pages。

## 🤝 参与贡献

欢迎提交Issue或Pull Request，补充内容或修正问题。

## 📄 许可

- 代码：[MIT](LICENSE)
- 文章与图片：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

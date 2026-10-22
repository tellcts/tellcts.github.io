---
title: 首页
layout: home

hero:
  name: 欢迎来到我的世界！
  text: |-
    Keep learning,
    Keep improving.
  tagline: 🧰 开源工具实践、📒 学习笔记、📦 个人项目，能直接拿来用，也能回头查。
  image:
    src: /favicon.png
    alt: VitePress
  actions:
    - theme: brand
      text: 开源工具推荐
      link: /tools/
    - theme: alt
      text: 个人项目
      link: /projects/
    - theme: alt
      text: 笔记
      link: /notes/

features:
  - icon: '<i class="fa-solid fa-star fa-spin" style="color: rgb(255, 212, 59);"></i>'
    title: 个人项目
    details: 自己写的开源项目。resumes-CV 用 LaTeX 把简历的内容与版式彻底分离；docker-images-sync 借助 GitHub Actions 和公开 GHCR 免费同步常用 Docker 镜像。
    link: /projects/
    linkText: 查看项目
  - icon: '<i class="fa-solid fa-fire" style="color: rgb(255, 108, 60);"></i>'
    title: 开源工具推荐
    details: 日常在用的开源工具，写成照着敲就能跑通的教程。目前收了 Python 构建工具UV，以及同一团队的代码检查与格式化工具Ruff。
    link: /tools/
    linkText: 浏览工具
  - icon: '<i class="fa-solid fa-marker" style="color: rgb(0, 184, 148);"></i>'
    title: 笔记
    details: 学习时整理的知识笔记，目前是软考「信息安全工程师」。基础篇按章节铺开知识点，案例篇偏实战，iptables 规则和 Wireshark 过滤器都能照着配。
    link: /notes/
    linkText: 阅读笔记
---

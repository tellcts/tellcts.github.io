---
title: 模块化LaTeX简历模板resumes-CV
layout: doc
aside: false
---

<h1 align="center">模块化LaTeX简历模板resumes-CV</h1>

## 📄 resumes-CV是什么 {#what-is-resumes-cv}

把简历当代码写：**内容归内容，排版归排版**。

resumes-CV 是我用 LaTeX 写的一个模块化简历模板库。起因挺朴素的：用在线简历网站改一个词就可能重排一次版面，Word 里拖来拖去、换个设备打开又是另一副样子。把简历当代码写之后，加一段经历不会把整页挤乱，想换配色也只改`.sty`里的一个变量。

## 🧩 怎么使用 {#usage}

用起来只有两条边界：

- 📝 **你只编辑`main.tex`**：里面只写内容——姓名、教育背景、项目经历，全部是`键 = {值}`的键值对。
- 🎨 **版式交给模板**：字号、纸张、页边距、边框由文档类和组件统一提供，不需要会写 LaTeX 宏包。

一句话：**会填空，就能改简历**。

仓库地址：[**github.com/tellcts/resumes-CV**](https://github.com/tellcts/resumes-CV)，采用 [**PolyForm Noncommercial 1.0.0 许可**](https://creativecommons.org/licenses/by-nc-sa/4.0/)，个人求职、学习等非商业用途免费。

## 📸 效果展示 {#preview}

下面是模板自带的示例简历，内容由你填，版式不用动。

![tzcan模板第1页：项目经历、实习经历与工作经历](../assets/images/template-tzcan-preview-1.jpg)

![tzcan模板第2页：教育背景、专业技能、荣誉证书与自我评价](../assets/images/template-tzcan-preview-2.jpg)

## ✨ 为什么值得一试 {#why}

- 🔒 **数据不出本地**：简历上有真实姓名、手机号、学历、工作经历，本地编译全程不联网、不上传、不注册，比把简历传上第三方服务器踏实得多。
- 🧩 **内容与版式彻底分离**：`main.tex`里一行版式代码都没有，增删模块不会留下空行，也不会多出一根多余的分隔线。
- 📐 **排版精确且可复现**：分割线右端自动对齐证件照右边界，换照片宽度也自动重算；同一份源码在任何机器上编译，输出完全一致。
- 🧱 **模块化，按需取用**：`\cvsection`、`\cvproject`、`\cvskillcategory`、`\cvhonor`等十余个组件彼此独立，用不上的直接删。

## 🚀 快速上手 {#quickstart}

不用安装TeX Live，也不用克隆仓库。下载打包好的模板后，直接导入Overleaf就能在线编辑和编译。

### 📦 下载模板

打开[resumes-CV最新Release](https://github.com/tellcts/resumes-CV/releases/latest)，下载名为`Resume.Template.tzcan-*.zip`的模板压缩包。

### 🌐 导入 Overleaf

1. 登录[Overleaf](https://www.overleaf.com/)，选择`New Project` → `Upload Project`。
2. 上传刚下载的ZIP压缩包。
3. 打开项目中的`main.tex`，修改姓名、教育背景、项目经历等内容。
4. 点击`Recompile`生成 PDF。

> [!TIP]
> Overleaf默认使用pdfLaTeX，无法正常编译时，点击左下角的齿轮设置按钮，在编译器选项界面将编译器切换为XeLaTeX，然后重新编译。

> [!IMPORTANT]
> 只需要编辑`main.tex`里的键值对，版式文件无需改动。也不要把ZIP里的文件拆散后单独上传，否则可能找不到模板依赖。

## 📚 深入了解 {#details}

### 📖 项目文档

- [README](https://github.com/tellcts/resumes-CV#-相比之下有什么优势)：项目总览，以及和简历网站、Word 模板的逐项对比。
- [tzcan 模板 USAGE.md](https://github.com/tellcts/resumes-CV/blob/main/src/templates/tzcan/USAGE.md)：从导入Overleaf、修改内容到每个组件的字段说明。

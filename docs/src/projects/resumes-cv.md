---
title: 模块化LaTeX简历模板resumes-CV
layout: doc
---

# 模块化LaTeX简历模板resumes-CV

把简历当代码写：**内容归内容，排版归排版**。

resumes-CV 是我用 LaTeX 写的一个模块化简历模板库。起因挺朴素的：用在线简历网站改一个词就可能重排一次版面，Word 里拖来拖去、换个设备打开又是另一副样子。把简历当代码写之后，加一段经历不会把整页挤乱，想换配色也只改`.sty`里的一个变量。

你唯一要编辑的文件是`main.tex`，里面只写内容 —— 姓名、教育背景、项目经历，全部是`键 = {值}`的键值对。字号、纸张、页边距、边框这些版式由文档类和组件统一提供，不需要会写 LaTeX 宏包。一句话：**会填空，就能改简历**。

仓库地址：[github.com/tellcts/resumes-CV](https://github.com/tellcts/resumes-CV)，采用 PolyForm Noncommercial 1.0.0 许可，个人求职、学习等非商业用途免费。

## 📸 效果展示

下面是模板自带的示例简历，内容由你填，版式不用动。

![tzcan模板第1页：项目经历、实习经历与工作经历](../assets/images/template-tzcan-preview-1.jpg)

![tzcan模板第2页：教育背景、专业技能、荣誉证书与自我评价](../assets/images/template-tzcan-preview-2.jpg)

## ✨ 为什么值得一试

- 🔒 **数据不出本地**：简历上有真实姓名、手机号、学历、工作经历，本地编译全程不联网、不上传、不注册，比把简历传上第三方服务器踏实得多。
- 🧩 **内容与版式彻底分离**：`main.tex`里一行版式代码都没有，增删模块不会留下空行，也不会多出一根多余的分隔线。
- 📐 **排版精确且可复现**：分割线右端自动对齐证件照右边界，换照片宽度也自动重算；同一份源码在任何机器上编译，输出完全一致。
- 🧱 **模块化，按需取用**：`\cvsection`、`\cvproject`、`\cvskillcategory`、`\cvhonor`等十余个组件彼此独立，用不上的直接删。

## 🚀 快速上手

### 🧰 环境准备

只需要 TeX Live 2026 自带的 XeLaTeX 与 latexmk，装完用`xelatex --version`和`latexmk --version`各确认一次。

### ⚡ 编译出 PDF

~~~bash
git clone https://github.com/tellcts/resumes-CV.git
cd resumes-CV/src/templates/tzcan
latexmk main.tex        # 产物：build/main.pdf
~~~

不想在本机装几个 GB 的 TeX Live 也没关系，官方文档里还给了 Overleaf 在线编译和 Docker 容器编译两条路。

> [!WARNING]
> 必须在`src/templates/tzcan/`目录下编译 ——`main.tex`里的文档类走的是相对路径，在仓库根目录编译会直接报找不到文档类。

## 📚 深入了解

### 📖 项目文档

- [README](https://github.com/tellcts/resumes-CV#-相比之下有什么优势)：项目总览，以及和简历网站、Word 模板的逐项对比。
- [tzcan 模板 USAGE.md](https://github.com/tellcts/resumes-CV/blob/main/src/templates/tzcan/USAGE.md)：从装环境一路讲到每个组件的每个字段说明。

### 📦 模板下载

- [Releases](https://github.com/tellcts/resumes-CV/releases)：打包好的`Resume.Template.tzcan-*.zip`，Overleaf 用户下载后直接上传即可。

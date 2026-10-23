---
title: GitHub CLI
titleTemplate: :title - 开源工具
aside: false
---

# GitHub CLI {#github-cli}

`gh`是GitHub官方提供的命令行工具，把仓库、Issue、Pull Request、Actions和Release等常用操作从网页搬进终端。它不替代`git`，而是补上GitHub平台侧的能力，让“查看、创建、审查、合并、发布”这些动作不必反复切换浏览器。

## 🤔 GitHub CLI是什么 {#what-is-gh}

`git`负责版本历史与分支管理，`gh`负责调用GitHub API处理平台功能。两者组合之后，一条命令就能完成“从当前分支创建PR”或“下载最新Release中的指定附件”。

它适合这些场景：

- 在终端里创建、查看、审查和合并Pull Request。
- 快速创建仓库、Fork项目、克隆仓库或查看仓库状态。
- 下载Release附件，不必手动点进页面逐个查找。
- 在CI、脚本或自动化任务中调用GitHub数据。
- 用`--json`和`--jq`直接输出可继续处理的结构化结果。

| 操作            | 网页                         | `gh`                        |
| --------------- | ---------------------------- | --------------------------- |
| 从分支创建PR    | 打开仓库、选择分支、填写表单 | `gh pr create --fill`       |
| 查看CI状态      | 进入PR页面等待刷新           | `gh pr checks --watch`      |
| 下载Release附件 | 找到版本，再逐个点击资产     | `gh release download`       |
| 跨仓库操作      | 切换页面和账号上下文         | `-R owner/repo`直接指定仓库 |
| 自动化查询      | 手动复制页面数据             | `--json`配合`--jq`          |

> [!TIP]
> 不确定某个命令有哪些参数时，直接运行`gh <命令> --help`。例如`gh pr create --help`和`gh release download --help`展示的就是当前安装版本的准确用法。

## 🚀 安装与登录 {#installation}

安装方式因操作系统和包管理器而异，请直接按照[GitHub CLI官方安装文档](https://cli.github.com/)选择对应平台完成安装。

安装后确认版本：

~~~bash
gh --version
~~~

首次使用先登录：

~~~bash
gh auth login
~~~

交互流程依次选择`GitHub.com`、`HTTPS`或`SSH`以及是否使用浏览器登录。完成授权后检查状态：

~~~bash
gh auth status
~~~

如果希望`git push`、`git pull`也复用`gh`保存的凭据：

~~~bash
gh auth setup-git
~~~

退出登录：

~~~bash
gh auth logout
~~~

> [!WARNING]
> 在服务器、容器和CI中不要使用需要交互的浏览器登录。可以把最小权限令牌放进`GH_TOKEN`环境变量，但不要把令牌写进仓库、命令历史或博客示例。细粒度Personal Access Token优先通过`GH_TOKEN`提供。

## 🧭 日常用法 {#daily-usage}

查看自己在GitHub上的待办、被分配的Issue、待审查的PR和仓库动态：

~~~bash
gh status
~~~

打开当前仓库、指定路径或某个PR：

~~~bash
gh browse
gh browse src/
gh browse 42
gh browse --releases
~~~

在终端中查看当前登录用户：

~~~bash
gh api user --jq .login
~~~

大多数支持远程仓库的命令都能通过`-R`临时指定目标，避免先切换目录：

~~~bash
gh repo view cli/cli
gh pr list -R cli/cli
gh release list -R cli/cli
~~~

## 📁 仓库管理 {#repository-management}

### 创建仓库 {#create-repository}

创建一个公开仓库并立即克隆到本地：

~~~bash
gh repo create my-project --public --clone
~~~

把当前本地目录发布为私有仓库，并推送已有提交：

~~~bash
gh repo create my-project --private --source=. --remote=origin --push
~~~

不带参数运行`gh repo create`会进入交互模式，可以选择仓库名、可见性、README、许可证和`.gitignore`模板。

### 克隆与Fork {#clone-and-fork}

~~~bash
gh repo clone owner/repo
gh repo clone owner/repo custom-directory
gh repo fork owner/repo --clone
~~~

Fork并克隆时，`gh`通常会把原仓库添加为`upstream`远程。之后可以用它同步原项目：

~~~bash
git fetch upstream
git switch main
git merge --ff-only upstream/main
~~~

如果Fork的工作流不同，也可以用`--remote-name`调整远程名称。

### 查看与管理 {#view-and-manage-repository}

~~~bash
gh repo list --source --limit 20
gh repo list owner --language TypeScript
gh repo view
gh repo view --web
gh repo edit --description "项目简介" --homepage "https://example.com"
~~~

仓库功能开关同样可以在终端修改：

~~~bash
gh repo edit --enable-issues --enable-wiki
gh repo edit --enable-issues=false
gh repo edit --delete-branch-on-merge
~~~

> [!WARNING]
> 修改仓库可见性可能影响Fork网络、观察者和Actions历史。`gh repo delete`会删除仓库，这是不可逆操作；执行前务必通过`gh repo view owner/repo`确认目标。

## 🔀 Pull Request {#pull-request}

下面的流程覆盖从提交分支到创建、审查和合并PR的常见路径。

### 创建PR {#create-pull-request}

先把功能分支推送到远程：

~~~bash
git switch -c feature/github-cli
git add .
git commit -m "feat: add GitHub CLI guide"
git push -u origin HEAD
~~~

根据提交信息自动填写标题和正文：

~~~bash
gh pr create --fill
~~~

需要明确指定标题、正文、目标分支、草稿状态和审查人时：

~~~bash
gh pr create \
  --title "feat: add GitHub CLI guide" \
  --body "补充安装、PR、仓库和Release用法。" \
  --base main \
  --reviewer alice \
  --label documentation
~~~

- **Linux、macOS**：上面的反斜杠续行方式可以直接在Bash或Zsh中使用。
- **Windows**：在PowerShell中可以把命令写成一行，或把`\`换成反引号续行。

创建草稿PR：

~~~bash
gh pr create --draft --fill
~~~

准备进入审查时再切换状态：

~~~bash
gh pr ready
~~~

在PR正文写`Fixes #123`或`Closes #123`，PR合并后对应Issue会自动关闭。`gh pr create --attach ./screenshot.png`还可以直接上传图片或视频。

### 查看与检出PR {#view-and-checkout-pull-request}

~~~bash
gh pr list
gh pr list --author "@me" --state all
gh pr list --search "review-requested:@me"
gh pr view 42
gh pr view 42 --comments
gh pr view 42 --web
~~~

把别人的PR检出到本地：

~~~bash
gh pr checkout 42
~~~

也可以直接用PR的URL或分支名：

~~~bash
gh pr checkout https://github.com/owner/repo/pull/42
gh pr checkout feature/example
~~~

查看差异和CI状态：

~~~bash
gh pr diff 42
gh pr checks 42
gh pr checks 42 --watch
~~~

### 审查与合并PR {#review-and-merge-pull-request}

批准PR：

~~~bash
gh pr review 42 --approve --body "改动符合预期。"
~~~

要求修改或只发表评论：

~~~bash
gh pr review 42 --request-changes --body "请补充错误处理。"
gh pr review 42 --comment --body "这个命名可以再统一一下。"
~~~

使用Squash方式合并，并在合并后删除远程和本地分支：

~~~bash
gh pr merge 42 --squash --delete-branch
~~~

等必需检查通过后自动合并：

~~~bash
gh pr merge 42 --auto --squash --delete-branch
~~~

> [!IMPORTANT]
> 合并方式必须与仓库允许的设置匹配。`--admin`会绕过分支保护规则，只应在明确拥有管理员权限且确实需要时使用。自动合并也需要仓库提前开启，否则命令会失败。

## 🏷️ Release查看与下载 {#release-download}

GitHub Release通常包含版本说明和编译好的附件，例如`.zip`、`.tar.gz`、安装包或校验文件。`gh`可以查看版本并批量下载附件。

### 查看Release {#view-release}

~~~bash
gh release list
gh release list --exclude-pre-releases
gh release view
gh release view v1.2.3
gh release view v1.2.3 --web
~~~

只获取最新Release的标签名：

~~~bash
gh release view --json tagName --jq .tagName
~~~

### 下载Release附件 {#download-release}

下载指定版本的全部附件：

~~~bash
gh release download v1.2.3 --dir downloads
~~~

不指定标签时，会从最新Release下载；此时必须同时指定文件名模式或源码归档格式：

~~~bash
gh release download --pattern "*.zip" --dir downloads
~~~

只下载匹配的安装包：

~~~bash
gh release download v1.2.3 \
  --pattern "*.deb" \
  --pattern "*.rpm" \
  --dir downloads
~~~

下载该版本自动生成的源码归档：

~~~bash
gh release download v1.2.3 --archive=zip --dir source
~~~

下载唯一匹配的附件并指定输出文件名：

~~~bash
gh release download v1.2.3 \
  --pattern "checksums.txt" \
  --output checksums-v1.2.3.txt
~~~

重复下载时可以选择跳过已有文件或覆盖：

~~~bash
gh release download v1.2.3 --skip-existing --dir downloads
gh release download v1.2.3 --clobber --dir downloads
~~~

> [!TIP]
> Release附件是项目发布者上传的文件；`--archive=zip`下载的是GitHub根据标签生成的源码快照，两者并不相同。生产环境优先固定标签或校验摘要，不要长期依赖“最新版本”的不确定内容。

### 创建Release {#create-release}

使用自动生成的发布说明创建Release：

~~~bash
gh release create v1.0.0 --generate-notes
~~~

上传构建产物并标记为预发布：

~~~bash
gh release create v1.0.0 ./dist/*.zip \
  --generate-notes \
  --prerelease
~~~

如果标签已经存在，并希望标签不存在时直接失败，可以加`--verify-tag`：

~~~bash
gh release create v1.0.0 ./dist/*.zip \
  --verify-tag \
  --generate-notes
~~~

## 🧰 结构化输出与自动化 {#automation}

`gh`的列表和查看命令通常支持`--json`指定字段，再用`--jq`筛出需要的值：

~~~bash
gh pr list --json number,title,author --jq '.[] | "\(.number) \(.title)"'
gh repo list --json name,visibility --jq '.[] | select(.visibility == "public") | .name'
gh release view --json tagName,assets --jq '{tag: .tagName, files: [.assets[].name]}'
~~~

在GitHub Actions中使用内置令牌：

~~~yaml
env:
  GH_TOKEN: ${{ github.token }}
~~~

随后可以运行`gh pr list`、`gh release download`等不需要额外个人令牌的命令。

## 📋 常用命令速查 {#command-reference}

| 目的         | 命令                                        |
| ------------ | ------------------------------------------- |
| 查看登录状态 | `gh auth status`                            |
| 查看个人待办 | `gh status`                                 |
| 创建仓库     | `gh repo create`                            |
| 克隆仓库     | `gh repo clone owner/repo`                  |
| Fork并克隆   | `gh repo fork owner/repo --clone`           |
| 创建PR       | `gh pr create --fill`                       |
| 列出PR       | `gh pr list --author "@me"`                 |
| 检出PR       | `gh pr checkout 42`                         |
| 查看CI       | `gh pr checks 42 --watch`                   |
| 合并PR       | `gh pr merge 42 --squash --delete-branch`   |
| 查看Release  | `gh release view`                           |
| 下载最新附件 | `gh release download -p "*.zip"`            |
| 下载指定版本 | `gh release download v1.2.3`                |
| 创建Release  | `gh release create v1.0.0 --generate-notes` |

## 📚 延伸阅读 {#further-reading}

- 📖 [GitHub CLI官方手册](https://cli.github.com/manual/)：所有命令、参数和示例的权威参考。
- 🐙 [cli/cli仓库](https://github.com/cli/cli)：源码、Release和问题反馈。
- 🔐 [管理个人访问令牌](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)：细粒度令牌与权限范围说明。
- 📦 [GitHub Releases文档](https://docs.github.com/en/repositories/releasing-projects-on-github)：Release、标签和附件的工作方式。

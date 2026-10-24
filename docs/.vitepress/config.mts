import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Tzcan Blog',
  titleTemplate: ':title - Tzcan Blog',
  lang: 'zh-CN',
  srcDir: './src',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  lastUpdated: true,

  sitemap: {
    hostname: 'https://tellcts.github.io',
    lastmodDateOnly: false,
  },

  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
  },

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/tellcts/tellcts.github.io/edit/main/docs/src/:path',
      text: '在 GitHub 上编辑此页',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '关闭搜索',
            displayDetails: '显示详细列表',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    lastUpdated: {
      text: '最后更新于',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/tellcts',
      },
      {
        icon: 'gmail',
        link: 'mailto:tzcanme@gmail.com',
        ariaLabel: '邮箱',
      },
    ],

    footer: {
      message:
        '本站内容采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 许可协议',
      copyright:
        'Copyright © 2026-present Tzcan<br>Powered by <a href="https://vitepress.dev/" target="_blank" rel="noopener noreferrer">VitePress</a>',
    },

    sidebar: {
      '/tools/': [
        {
          text: '<i class="fa-brands fa-python" style="color: rgb(55, 118, 171);"></i>Python构建工具UV',
          link: '/tools/uv/',
          collapsed: false,
          items: [
            {
              text: 'UV简介与安装',
              link: '/tools/uv/intro',
            },
            {
              text: '常用命令与配置',
              link: '/tools/uv/commands',
            },
            {
              text: '代码检查与格式化工具Ruff',
              link: '/tools/uv/ruff',
            },
          ],
        },
        {
          text: '<i class="fa-brands fa-github"></i>GitHub CLI',
          link: '/tools/github-cli',
          collapsed: false,
          items: [
            {
              text: 'GitHub CLI是什么',
              link: '/tools/github-cli#what-is-gh',
            },
            {
              text: '安装与登录',
              link: '/tools/github-cli#installation',
            },
            {
              text: '日常用法',
              link: '/tools/github-cli#daily-usage',
            },
            {
              text: '仓库管理',
              link: '/tools/github-cli#repository-management',
            },
            {
              text: 'Pull Request',
              link: '/tools/github-cli#pull-request',
            },
            {
              text: 'Release查看与下载',
              link: '/tools/github-cli#release-download',
            },
            {
              text: '结构化输出与自动化',
              link: '/tools/github-cli#automation',
            },
            {
              text: '常用命令速查',
              link: '/tools/github-cli#command-reference',
            },
          ],
        },
      ],
      '/projects/': [
        {
          text: '<i class="fa-solid fa-id-card"></i>模块化简历模板',
          link: '/projects/resumes-cv',
          collapsed: false,
          items: [
            {
              text: 'resumes-CV是什么',
              link: '/projects/resumes-cv#what-is-resumes-cv',
            },
            {
              text: '怎么使用',
              link: '/projects/resumes-cv#usage',
            },
            {
              text: '效果展示',
              link: '/projects/resumes-cv#preview',
            },
            {
              text: '为什么值得一试',
              link: '/projects/resumes-cv#why',
            },
            {
              text: '快速上手',
              link: '/projects/resumes-cv#quickstart',
            },
            {
              text: '深入了解',
              link: '/projects/resumes-cv#details',
            },
          ],
        },
        {
          text: '<i class="fa-brands fa-docker"></i>Docker镜像加速',
          link: '/projects/docker-images-sync',
          collapsed: false,
          items: [
            {
              text: 'ghcr.io是什么',
              link: '/projects/docker-images-sync#what-is-ghcr',
            },
            {
              text: '两种使用方式',
              link: '/projects/docker-images-sync#usage-modes',
            },
            {
              text: '为什么可以免费加速',
              link: '/projects/docker-images-sync#free',
            },
            {
              text: '项目特性',
              link: '/projects/docker-images-sync#features',
            },
            {
              text: '工作原理',
              link: '/projects/docker-images-sync#how-it-works',
            },
            {
              text: '快速上手',
              link: '/projects/docker-images-sync#quickstart',
            },
            {
              text: '同步规则',
              link: '/projects/docker-images-sync#sync-rules',
            },
            {
              text: '使用同步镜像',
              link: '/projects/docker-images-sync#use-images',
            },
            {
              text: '默认镜像清单',
              link: '/projects/docker-images-sync#catalog',
            },
            {
              text: '本地运行',
              link: '/projects/docker-images-sync#local-run',
            },
            {
              text: '注意事项',
              link: '/projects/docker-images-sync#limits',
            },
            {
              text: '许可与合规',
              link: '/projects/docker-images-sync#license',
            },
            {
              text: '项目文档',
              link: '/projects/docker-images-sync#details',
            },
          ],
        },
      ],
      '/thoughts/': [
        {
          text: '📄 AI时代，我们最需要的是什么？',
          link: '/thoughts/what-we-need-in-ai-era',
          collapsed: false,
          items: [
            {
              text: '当答案变得容易，问题反而更珍贵',
              link: '/thoughts/what-we-need-in-ai-era#questions-matter',
            },
            {
              text: 'AI掌握的是已经发生过的世界',
              link: '/thoughts/what-we-need-in-ai-era#existing-knowledge',
            },
            {
              text: '创造力不是凭空造物',
              link: '/thoughts/what-we-need-in-ai-era#creativity',
            },
            {
              text: '主观能动性，决定你如何使用客观知识',
              link: '/thoughts/what-we-need-in-ai-era#agency',
            },
            {
              text: '不要把思考也外包出去',
              link: '/thoughts/what-we-need-in-ai-era#dont-outsource-thinking',
            },
            {
              text: '最后，问你一个问题',
              link: '/thoughts/what-we-need-in-ai-era#final-question',
            },
          ],
        },
      ],
      '/other/': [
        {
          text: '📘 从0到1免费构建你的个人博客',
          link: '/other/build-your-blog',
          collapsed: false,
          items: [
            {
              text: '教程目标',
              link: '/other/build-your-blog#goals',
            },
            {
              text: '开始前准备',
              link: '/other/build-your-blog#preparation',
            },
            {
              text: '初始化项目',
              link: '/other/build-your-blog#initialize',
            },
            {
              text: '项目总体架构',
              link: '/other/build-your-blog#architecture',
            },
            {
              text: '配置首页与导航',
              link: '/other/build-your-blog#home-and-navigation',
            },
            {
              text: '撰写文章',
              link: '/other/build-your-blog#writing',
            },
            {
              text: '本地预览与构建',
              link: '/other/build-your-blog#preview-and-build',
            },
            {
              text: '部署到GitHub Pages',
              link: '/other/build-your-blog#github-pages',
            },
            {
              text: '接入Giscus评论区',
              link: '/other/build-your-blog#giscus-comments',
            },
            {
              text: '发布前检查',
              link: '/other/build-your-blog#publish-checklist',
            },
          ],
        },
      ],
    },

    nav: [
      {
        text: '<i class="fa-solid fa-house" style="color: rgb(20, 126, 211);"></i>首页',
        link: '/',
      },
      {
        text: '<i class="fa-solid fa-star fa-spin" style="color: rgb(255, 212, 59);"></i>个人项目',
        link: '/projects/',
      },
      {
        text: '<i class="fa-solid fa-lightbulb" style="color: rgb(0, 184, 148);"></i>笔者思考',
        link: '/thoughts/',
      },
      {
        text: '<i class="fa-solid fa-fire" style="color: rgb(255, 108, 60);"></i>开源工具推荐',
        link: '/tools/',
      },
      {
        text: '<i class="fa-solid fa-ellipsis" style="color: rgb(124, 99, 255);"></i>其他',
        items: [
          {
            text: '从0到1免费构建你的个人博客',
            link: '/other/build-your-blog',
          },
        ],
      },
    ],
  },
});

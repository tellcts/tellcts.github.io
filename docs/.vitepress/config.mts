import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Tzcan Blog',
  titleTemplate: ':title - Tzcan Blog',
  description: '开源工具实践、学习笔记、个人项目，能直接拿来用，也能回头查。',
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
        '本站内容采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 许可协议。',
      copyright: 'Copyright © 2026-present Tzcan',
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
      ],
      '/projects/': [
        {
          text: '<i class="fa-solid fa-id-card"></i>模块化简历模板resumes-CV',
          link: '/projects/resumes-cv',
          collapsed: false,
          items: [
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
      ],
      '/notes/': [
        {
          text: '软考·信息安全工程师',
          link: '/notes/info-sec/',
          collapsed: false,
          items: [
            {
              text: '安全基础知识',
              link: '/notes/info-sec/basic',
            },
            {
              text: '案例知识总结',
              link: '/notes/info-sec/advanced',
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
        text: '<i class="fa-solid fa-marker" style="color: rgb(0, 184, 148);"></i>笔记',
        link: '/notes/',
      },
      {
        text: '<i class="fa-solid fa-fire" style="color: rgb(255, 108, 60);"></i>开源工具推荐',
        link: '/tools/',
      },
    ],
  },
});

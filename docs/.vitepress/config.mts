import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Tzcan Blog',
  description: '分享各种有趣内容，看看有你喜欢的吗😋😋😋',
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
    ],

    footer: {
      message:
        '本站内容采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 许可协议。',
      copyright: 'Copyright © 2026-present Tzcan',
    },

    sidebar: {
      '/os/beautify/': [
        {
          text: '终端美化',
          link: '/os/beautify/terminal/',
          collapsed: false,
          items: [
            {
              text: '终端显示字体',
              link: '/os/beautify/terminal/#font',
            },
            {
              text: '命令提示符',
              link: '/os/beautify/terminal/#cmd',
            },
            {
              text: '一键概览系统信息',
              link: '/os/beautify/terminal/#fastfetch',
            },
          ],
        },
      ],
      '/tools/': [
        {
          text: '终端编辑器Helix',
          link: '/tools/helix',
        },
        {
          text: 'Python构建工具UV',
          link: '/tools/uv',
        },
      ],
      '/projects/': [
        {
          text: '文件完整性监控FileMonitor',
          link: '/projects/file-monitor',
        },
      ],
      '/notes/info-sec/': [
        {
          text: '信息安全工程师',
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
        text: '🌐首页',
        link: '/',
      },
      {
        text: '🌟个人项目',
        link: '/projects/',
      },
      {
        text: '✏️笔记',
        items: [
          {
            text: '信息安全工程师',
            link: '/notes/info-sec/',
          },
        ],
      },
      {
        text: '💻操作系统OS',
        items: [
          {
            text: 'Linux',
            link: '/os/linux/',
          },
          {
            text: 'Windows',
            link: '/os/windows/',
          },
          {
            text: '系统美化',
            link: '/os/beautify/',
          },
        ],
      },
      {
        text: '🔥开源工具推荐',
        link: '/tools/',
      },
    ],
  },
});

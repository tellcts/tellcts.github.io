import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Tzcan Blog',
  description: '分享各种有趣内容，看看有你喜欢的吗😋😋😋',
  lang: 'zh-CN',
  srcDir: './src',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  lastUpdated: true,

  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
  },

  themeConfig: {
    search: {
      provider: 'local',
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

    nav: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: 'Linux',
        link: '/linux/',
      },
    ],
  },
});

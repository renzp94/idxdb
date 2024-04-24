import { defineConfig } from 'vitepress'
import pkg from '../../package.json'

export default defineConfig({
  title: '@renzp/idxdb',
  description: '一款零依赖、快速灵活、简单易用的indexedDB API库',
  cleanUrls: true,
  lastUpdated: true,
  metaChunk: true,
  rewrites: {
    'pages/guide/getting-started.md': 'index.md',
    'pages/:category/:page.md': ':category/:page.md',
  },
  head: [['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }]],
  themeConfig: {
    logo: {
      src: '/logo.png',
      style: 'border-radius: 50%;height: 32px;width: 32px;',
    },
    siteTitle: 'idxdb',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
      },
    },
    nav: [
      {
        text: pkg.version,
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/renzp94/idxdb/blob/main/CHANGELOG.md',
          },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/renzp94/idxdb' }],
    sidebar: [
      {
        text: '简介',
        items: [
          { text: '什么是@renzp/idxdb?', link: '/guide/what-is' },
          { text: '快速开始', link: '/' },
        ],
      },
      {
        text: '功能',
        items: [
          { text: 'IdxDB', link: '/class/IdxDB' },
          { text: 'Store', link: '/class/Store' },
        ],
      },
    ],
    editLink: {
      pattern: 'https://github.com/renzp94/idxdb/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    outline: {
      label: '页面导航',
    },
  },
})

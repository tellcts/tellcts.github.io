# 项目背景
这个项目是静态个人博客网站，采用VitePress技术，托管在Github Pages。

# 技术栈
- VitePress ^1.6.4 —— 静态站点生成器，基于 Vite + Vue
- pnpm 12.9.1（packageManager 字段已锁定），Node.js 运行时
- Prettier ^3.9.9 负责代码格式化
- 部署：GitHub Pages，工作流在 .github/workflows/deploy.yml

# 常用命令
- pnpm docs:dev      # 本地开发
- pnpm docs:build    # 构建
- pnpm docs:preview  # 预览构建结果
- pnpm format        # Prettier 格式化

# 注意事项
- 你只需要帮我编写代码,不需要附带相关注释，不要管理git操作,
- 不需要帮我执行任何的pnpm相关命令
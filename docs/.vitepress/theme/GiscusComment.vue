<script setup lang="ts">
import Giscus from '@giscus/vue';
import { useData } from 'vitepress';

const { isDark } = useData();

// 替换为你从 giscus.app 获取的真实配置
const repo = 'tellcts/tellcts.github.io';
const repoId = 'R_kgDOU8JljQ';
const category = 'Blog Comments';
const categoryId = 'DIC_kwDOU8Jljc4DHeI-';
</script>

<template>
  <div class="giscus-container">
    <Giscus
      :key="isDark ? 'dark' : 'light'"
      :repo="repo"
      :repo-id="repoId"
      :category="category"
      :category-id="categoryId"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="1"
      input-position="top"
      :theme="isDark ? 'dark' : 'light'"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.giscus-container {
  margin-top: 32px;
  padding-top: 16px;
}
</style>

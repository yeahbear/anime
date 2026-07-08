<script setup lang="ts">
import { BookOpen, Flame, Grid2X2, UserRound } from 'lucide-vue-next';

const tabs = [
  { to: '/home', label: '推荐', icon: BookOpen },
  { to: '/rank', label: '排行', icon: Flame },
  { to: '/category', label: '分类', icon: Grid2X2 },
  { to: '/mine', label: '我的', icon: UserRound },
];
</script>

<template>
  <nav class="tabbar" aria-label="主导航">
    <RouterLink v-for="tab in tabs" :key="tab.to" :to="tab.to">
      <component :is="tab.icon" :size="21" aria-hidden="true" />
      <span>{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

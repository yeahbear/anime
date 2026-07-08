<script setup lang="ts">
import { BookMarked, Clock3, Heart } from 'lucide-vue-next';
</script>

<template>
  <section class="page profile-page">
    <header class="profile-card">
      <div class="avatar">漫</div>
      <div>
        <h1>我的漫画</h1>
        <p>本页作为底部 tabbar 的“我的”入口展示，不包含登录功能。</p>
      </div>
    </header>

    <div class="profile-actions">
      <button>
        <Heart :size="22" />
        <span>追漫</span>
      </button>
      <button>
        <Clock3 :size="22" />
        <span>历史</span>
      </button>
      <button>
        <BookMarked :size="22" />
        <span>书架</span>
      </button>
    </div>
  </section>
</template>

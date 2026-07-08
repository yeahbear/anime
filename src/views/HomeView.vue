<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Search } from 'lucide-vue-next';
import ComicCard from '@/components/ComicCard.vue';
import LoadingState from '@/components/LoadingState.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import { fetchBanners, fetchHomeRecommend } from '@/api/comic';
import type { BannerItem, ComicItem } from '@/types/comic';
import { horizontalCover, normalizeImage } from '@/utils/format';

const loading = ref(true);
const banners = ref<BannerItem[]>([]);
const comics = ref<ComicItem[]>([]);
const activeBanner = ref(0);
let bannerTimer: number | undefined;

const featureComics = computed(() => comics.value.slice(0, 3));
const gridComics = computed(() => comics.value.slice(3, 15));

function startBannerAutoPlay() {
  window.clearInterval(bannerTimer);
  if (banners.value.length <= 1) return;

  bannerTimer = window.setInterval(() => {
    activeBanner.value = (activeBanner.value + 1) % banners.value.length;
  }, 3000);
}

function selectBanner(index: number) {
  activeBanner.value = index;
  startBannerAutoPlay();
}

onMounted(async () => {
  try {
    const [bannerData, recommendData] = await Promise.all([fetchBanners(), fetchHomeRecommend()]);
    banners.value = bannerData;
    comics.value = recommendData.list ?? [];
    startBannerAutoPlay();
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  window.clearInterval(bannerTimer);
});
</script>

<template>
  <section class="page home-page">
    <header class="top-bar">
      <div>
        <span class="eyebrow">Vue3 漫画项目</span>
        <h1>漫游馆</h1>
      </div>
      <button class="icon-btn" aria-label="搜索">
        <Search :size="20" />
      </button>
    </header>

    <LoadingState v-if="loading" />

    <template v-else>
      <section v-if="banners.length" class="hero-banner">
        <img :src="normalizeImage(banners[activeBanner].img)" :alt="banners[activeBanner].title" />
        <div class="banner-dots" aria-label="轮播图切换">
          <button
            v-for="(_, index) in banners"
            :key="index"
            :class="{ active: index === activeBanner }"
            :aria-label="`第 ${index + 1} 张`"
            @click="selectBanner(index)"
          />
        </div>
      </section>

      <SectionHeader title="本周推荐" subtitle="接口：Banner + HomeRecommend" />
      <div class="feature-list">
        <RouterLink
          v-for="comic in featureComics"
          :key="comic.comic_id"
          class="feature-item"
          :to="`/detail/${comic.comic_id}`"
        >
          <img :src="horizontalCover(comic)" :alt="comic.title" loading="lazy" />
          <div>
            <strong>{{ comic.title }}</strong>
            <span>{{ comic.introduction || comic.decision_info || '高人气漫画推荐' }}</span>
          </div>
        </RouterLink>
      </div>

      <SectionHeader title="猜你喜欢" subtitle="精选 12 部热门作品" />
      <div class="comic-grid">
        <ComicCard v-for="comic in gridComics" :key="comic.comic_id" :comic="comic" />
      </div>
    </template>
  </section>
</template>

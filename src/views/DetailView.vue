<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Star } from 'lucide-vue-next';
import ComicCard from '@/components/ComicCard.vue';
import LoadingState from '@/components/LoadingState.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import { fetchComicDetail, fetchMoreRecommend, fetchReviews } from '@/api/comic';
import type { ComicDetail, ComicItem, ReviewItem } from '@/types/comic';
import { authorText, normalizeImage, safeText, shortNumber, statusText, styleText } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const detail = ref<ComicDetail>();
const related = ref<ComicItem[]>([]);
const reviews = ref<ReviewItem[]>([]);

const comicId = computed(() => Number(route.params.id || 26769));
const cover = computed(() => normalizeImage(detail.value?.vertical_cover ?? detail.value?.horizontal_cover));
const freeChapter = computed(() => {
  const chapters = detail.value?.ep_list ?? [];
  return [...chapters].reverse().find((chapter) => !chapter.is_locked) ?? chapters[chapters.length - 1];
});

onMounted(async () => {
  try {
    const [detailData, relatedData, reviewData] = await Promise.all([
      fetchComicDetail(comicId.value),
      fetchMoreRecommend(comicId.value),
      fetchReviews(comicId.value),
    ]);
    detail.value = detailData;
    related.value = relatedData;
    reviews.value = reviewData;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="page detail-page">
    <LoadingState v-if="loading" />

    <template v-else-if="detail">
      <header class="detail-hero" :style="{ backgroundImage: `url(${normalizeImage(detail.horizontal_cover)})` }">
        <button class="back-btn" aria-label="返回" @click="router.back()">
          <ArrowLeft :size="20" />
        </button>
        <div class="detail-info">
          <img :src="cover" :alt="detail.title" />
          <div>
            <span class="eyebrow">{{ styleText(detail.styles) }}</span>
            <h1>{{ detail.title }}</h1>
            <p>{{ authorText(detail) }}</p>
            <div class="meta-line">
              <span>{{ statusText(detail.status) }}</span>
              <span>{{ detail.total }} 话</span>
              <span>{{ shortNumber(detail.data_info?.fav_count) }}收藏</span>
            </div>
          </div>
        </div>
      </header>

      <div class="action-row">
        <button class="ghost-btn">
          <Star :size="18" />
          追漫
        </button>
        <RouterLink v-if="freeChapter" class="primary-btn" :to="`/reader/${freeChapter.id}`">
          免费看{{ freeChapter.short_title }}
        </RouterLink>
      </div>

      <section class="intro-block">
        <h2>作品简介</h2>
        <p>{{ safeText(detail.evaluate || detail.introduction) }}</p>
      </section>

      <SectionHeader title="全部章节" :subtitle="`共 ${detail.ep_list.length} 话`" />
      <div class="chapter-grid">
        <RouterLink
          v-for="chapter in detail.ep_list.slice().reverse().slice(0, 36)"
          :key="chapter.id"
          :class="{ locked: chapter.is_locked }"
          :to="`/reader/${chapter.id}`"
        >
          {{ chapter.short_title }}
        </RouterLink>
      </div>

      <SectionHeader title="漫画点评" />
      <div class="review-list">
        <article v-for="review in reviews" :key="review.id ?? review.nick_name">
          <strong>{{ review.nick_name || '匿名读者' }}</strong>
          <span>{{ review.score || 5 }} 分</span>
          <p>{{ review.content }}</p>
        </article>
      </div>

      <SectionHeader title="相关推荐" />
      <div class="comic-grid">
        <ComicCard v-for="comic in related.slice(0, 6)" :key="comic.comic_id" :comic="comic" />
      </div>
    </template>
  </section>
</template>

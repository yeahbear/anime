<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { ComicItem } from '@/types/comic';
import { authorText, comicCover, comicId, shortNumber, styleText } from '@/utils/format';

const props = defineProps<{
  comic: ComicItem;
  rank?: number;
}>();

const id = computed(() => comicId(props.comic));
const cover = computed(() => comicCover(props.comic));
</script>

<template>
  <RouterLink class="comic-card" :to="`/detail/${id}`">
    <div class="cover-wrap">
      <img :src="cover" :alt="comic.title" loading="lazy" />
      <span v-if="rank" class="rank-mark">{{ rank }}</span>
    </div>
    <strong>{{ comic.title }}</strong>
    <p>{{ authorText(comic) }}</p>
    <small>{{ styleText(comic.styles) }} · {{ shortNumber(comic.comment_total ?? comic.total) }}热度</small>
  </RouterLink>
</template>

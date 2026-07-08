<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import ComicCard from '@/components/ComicCard.vue';
import LoadingState from '@/components/LoadingState.vue';
import SectionHeader from '@/components/SectionHeader.vue';
import { fetchRankInfo, fetchRankTabs } from '@/api/comic';
import type { ComicItem, RankTab } from '@/types/comic';

const tabs = ref<RankTab[]>([]);
const activeId = ref(1);
const comics = ref<ComicItem[]>([]);
const loading = ref(true);

async function loadRanks() {
  loading.value = true;
  try {
    comics.value = await fetchRankInfo(activeId.value);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  tabs.value = await fetchRankTabs();
  await loadRanks();
});

watch(activeId, loadRanks);
</script>

<template>
  <section class="page">
    <header class="plain-header">
      <h1>漫画排行</h1>
      <p>接口：ListRank + GetRankInfo</p>
    </header>

    <div class="segmented">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeId === tab.id }"
        @click="activeId = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <LoadingState v-if="loading" />
    <template v-else>
      <SectionHeader title="榜单作品" subtitle="按当前榜单热度排序" />
      <div class="rank-list">
        <ComicCard v-for="(comic, index) in comics" :key="comic.comic_id" :comic="comic" :rank="index + 1" />
      </div>
    </template>
  </section>
</template>

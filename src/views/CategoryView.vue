<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import ComicCard from '@/components/ComicCard.vue';
import LoadingState from '@/components/LoadingState.vue';
import { fetchClassPage, fetchLabels } from '@/api/comic';
import type { ComicItem, ComicStyle, LabelData } from '@/types/comic';

const all = { id: -1, name: '全部' };
const labels = ref<LabelData>();
const comics = ref<ComicItem[]>([]);
const loading = ref(true);
const selected = reactive({
  styleId: 999,
  areaId: -1,
  isFinish: -1,
  order: 0,
  isFree: -1,
});

function withAll(items: ComicStyle[] = []): ComicStyle[] {
  return [all, ...items];
}

async function loadComics() {
  loading.value = true;
  try {
    comics.value = await fetchClassPage(selected);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  labels.value = await fetchLabels();
  await loadComics();
});

watch(selected, loadComics);
</script>

<template>
  <section class="page">
    <header class="plain-header">
      <h1>漫画分类</h1>
      <p>接口：AllLabel + ClassPage</p>
    </header>

    <section v-if="labels" class="filter-panel">
      <div class="filter-row">
        <span>题材</span>
        <button
          v-for="item in withAll(labels.styles)"
          :key="item.id"
          :class="{ active: selected.styleId === item.id }"
          @click="selected.styleId = item.id"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="filter-row">
        <span>地区</span>
        <button
          v-for="item in withAll(labels.areas)"
          :key="item.id"
          :class="{ active: selected.areaId === item.id }"
          @click="selected.areaId = item.id"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="filter-row">
        <span>状态</span>
        <button
          v-for="item in withAll(labels.status)"
          :key="item.id"
          :class="{ active: selected.isFinish === item.id }"
          @click="selected.isFinish = item.id"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="filter-row">
        <span>排序</span>
        <button
          v-for="item in labels.orders"
          :key="item.id"
          :class="{ active: selected.order === item.id }"
          @click="selected.order = item.id"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="filter-row">
        <span>价格</span>
        <button
          v-for="item in withAll(labels.prices)"
          :key="item.id"
          :class="{ active: selected.isFree === item.id }"
          @click="selected.isFree = item.id"
        >
          {{ item.name }}
        </button>
      </div>
    </section>

    <LoadingState v-if="loading" />
    <div v-else class="comic-grid">
      <ComicCard v-for="comic in comics" :key="comic.season_id" :comic="comic" />
    </div>
  </section>
</template>

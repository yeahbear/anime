<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import LoadingState from '@/components/LoadingState.vue';
import { fetchImageIndex, fetchImageTokens, imageUrlsFromIndex } from '@/api/comic';
import type { ImageTokenItem } from '@/types/comic';
import { normalizeImage } from '@/utils/format';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const images = ref<ImageTokenItem[]>([]);
const epId = computed(() => Number(route.params.epId));

onMounted(async () => {
  try {
    const index = await fetchImageIndex(epId.value);
    const urls = imageUrlsFromIndex(index);
    images.value = await fetchImageTokens(urls);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="reader-page">
    <header class="reader-bar">
      <button aria-label="返回" @click="router.back()">
        <ArrowLeft :size="20" />
      </button>
      <h1>漫画阅读</h1>
      <span>{{ images.length }} 页</span>
    </header>

    <LoadingState v-if="loading" />
    <div v-else class="reader-images">
      <img
        v-for="image in images"
        :key="image.complete_url"
        :src="normalizeImage(image.complete_url)"
        alt="漫画页"
        loading="lazy"
      />
    </div>
  </section>
</template>

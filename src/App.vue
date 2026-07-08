<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AppTabbar from './components/AppTabbar.vue';

const route = useRoute();
const showTabbar = computed(() => route.meta.keepTabbar === true);
</script>

<template>
  <main class="app-shell" :class="{ 'has-tabbar': showTabbar }">
    <RouterView />
    <AppTabbar v-if="showTabbar" />
  </main>
</template>

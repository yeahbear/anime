import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import RankView from './views/RankView.vue';
import CategoryView from './views/CategoryView.vue';
import DetailView from './views/DetailView.vue';
import ReaderView from './views/ReaderView.vue';
import ProfileView from './views/ProfileView.vue';
import './styles/main.css';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomeView, meta: { keepTabbar: true } },
    { path: '/rank', name: 'rank', component: RankView, meta: { keepTabbar: true } },
    { path: '/category', name: 'category', component: CategoryView, meta: { keepTabbar: true } },
    { path: '/mine', name: 'mine', component: ProfileView, meta: { keepTabbar: true } },
    { path: '/detail/:id', name: 'detail', component: DetailView },
    { path: '/reader/:epId', name: 'reader', component: ReaderView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createApp(App).use(router).mount('#app');

# Comic Vue TS Implementation Plan

> **For agentic workers:** Use `executing-plans` for this tightly coupled frontend build. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vue3 + TypeScript mobile comic project matching the provided screenshot requirements.

**Architecture:** A Vite Vue app uses Vue Router for five screens: home, rank, category, detail, and reader. A small API layer calls `https://apis.netstart.cn/bcomic/*` first and falls back to the downloaded JSON files when the remote API is unavailable.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, browser `fetch`, lucide-vue-next icons.

## Global Constraints

- Only implement the screenshot-required comic browsing pages.
- Use the screenshot interfaces under `https://apis.netstart.cn/bcomic/`.
- Use local JSON files in `漫画网络接口json数据/网络接口json数据` as fallback data.
- Add `meta name="referrer" content="no-referrer"` so manga images can display.
- Verify with `npm run build` and a local browser check.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/main.ts`, `src/App.vue`

- [x] Create the Vue3 + TypeScript + Vite app skeleton.
- [x] Add the image referrer meta tag.
- [x] Run `npm install`.

### Task 2: Data Layer

**Files:**
- Create: `src/api/comic.ts`, `src/types/comic.ts`, `src/utils/format.ts`

- [x] Define shared comic, banner, chapter, filter, rank, and reader image types.
- [x] Add request helpers for `Banner`, `HomeRecommend`, `ListRank`, `GetRankInfo`, `AllLabel`, `ClassPage`, `ComicDetail`, `MoreRecommend`, `GetReviewDetailByComicID`, `GetImageIndex`, and `ImageToken`.
- [x] Use local JSON fallback when network requests fail.

### Task 3: UI Pages

**Files:**
- Create: `src/views/HomeView.vue`, `src/views/RankView.vue`, `src/views/CategoryView.vue`, `src/views/DetailView.vue`, `src/views/ReaderView.vue`, `src/views/ProfileView.vue`
- Create: `src/components/AppTabbar.vue`, `src/components/ComicCard.vue`, `src/components/SectionHeader.vue`, `src/components/LoadingState.vue`

- [x] Implement homepage banner and recommendation list.
- [x] Implement rank page with daily, domestic, and free tabs.
- [x] Implement category filters and results.
- [x] Implement detail page with chapter grid, comments, and related comics.
- [x] Implement reader page with image token loading.

### Task 4: Styling And Verification

**Files:**
- Create: `src/styles/main.css`

- [x] Add mobile-first layout, bottom tabbar, card grids, loading, and empty states.
- [x] Run `npm run build`.
- [x] Start dev server and inspect the main pages.

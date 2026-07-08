import type {
  ApiResponse,
  BannerItem,
  ComicDetail,
  ComicItem,
  HomeRecommendData,
  ImageIndex,
  ImageTokenItem,
  LabelData,
  RankTab,
  ReviewItem,
} from '@/types/comic';
import bannerFallback from '../../漫画网络接口json数据/网络接口json数据/首页-轮播图Banner.json';
import homeRecommendFallback from '../../漫画网络接口json数据/网络接口json数据/首页-推荐.json';
import detailFallback from '../../漫画网络接口json数据/网络接口json数据/详情页-ComicDetail.json';
import imageIndexFallback from '../../漫画网络接口json数据/网络接口json数据/GetImageIndex.json';
import imageTokenFallback from '../../漫画网络接口json数据/网络接口json数据/ImageToken.json';
import classLabelFallback from '../../漫画网络接口json数据/网络接口json数据/分类页AllLabel.json';
import classPageFallback from '../../漫画网络接口json数据/网络接口json数据/分类页列表ClassPage.json';
import rankJapanFallback from '../../漫画网络接口json数据/网络接口json数据/排行-日漫-HomeHot.json';
import rankChinaFallback from '../../漫画网络接口json数据/网络接口json数据/排行-国漫-HomeHot.json';
import rankFreeFallback from '../../漫画网络接口json数据/网络接口json数据/排行-免费-HomeHot.json';

const BASE_URL = 'https://apis.netstart.cn/bcomic';

function unwrap<T>(payload: unknown, fallback: T): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return fallback;
}

function fallbackData<T>(payload: unknown): T {
  return unwrap<T>(payload, payload as T);
}

async function request<T>(path: string, params: Record<string, string | number> = {}, fallback: T): Promise<T> {
  const url = new URL(`${BASE_URL}/${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  url.searchParams.set('_t', String(Date.now()));

  try {
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return unwrap<T>(await response.json(), fallback);
  } catch (error) {
    console.info(`[comic api] ${path} 使用本地 JSON 兜底`, error);
    return fallback;
  }
}

export function fetchBanners(): Promise<BannerItem[]> {
  return request('Banner', {}, fallbackData<BannerItem[]>(bannerFallback));
}

export function fetchHomeRecommend(): Promise<HomeRecommendData> {
  return request('HomeRecommend', {}, fallbackData<HomeRecommendData>(homeRecommendFallback));
}

export function fetchRankTabs(): Promise<RankTab[]> {
  return request<{ list?: RankTab[] } | RankTab[]>(
    'ListRank',
    {},
    {
      list: [
        { id: 1, name: '日漫' },
        { id: 2, name: '国漫' },
        { id: 3, name: '免费' },
      ],
    },
  ).then((data) => {
    const tabs = Array.isArray(data) ? data : data.list;
    return tabs?.length
      ? tabs.slice(0, 6)
      : [
      { id: 1, name: '日漫' },
      { id: 2, name: '国漫' },
      { id: 3, name: '免费' },
        ];
  });
}

export function fetchRankInfo(id: number): Promise<ComicItem[]> {
  const fallbackMap: Record<number, ComicItem[]> = {
    1: fallbackData<ComicItem[]>(rankJapanFallback),
    2: fallbackData<ComicItem[]>(rankChinaFallback),
    3: fallbackData<ComicItem[]>(rankFreeFallback),
  };
  return request<{ list?: ComicItem[] } | ComicItem[]>('GetRankInfo', { id }, fallbackMap[id] ?? fallbackMap[1]).then(
    (data) => (Array.isArray(data) ? data : data.list ?? fallbackMap[id] ?? fallbackMap[1]),
  );
}

export function fetchLabels(): Promise<LabelData> {
  const raw = fallbackData<LabelData>(classLabelFallback);
  return request('AllLabel', {}, raw);
}

export function fetchClassPage(params: {
  styleId: number;
  areaId: number;
  isFinish: number;
  order: number;
  pageNum?: number;
  pageSize?: number;
  isFree: number;
}): Promise<ComicItem[]> {
  return request(
    'ClassPage',
    {
      pageNum: params.pageNum ?? 1,
      pageSize: params.pageSize ?? 39,
      styleId: params.styleId,
      areaId: params.areaId,
      isFinish: params.isFinish,
      order: params.order,
      isFree: params.isFree,
    },
    fallbackData<ComicItem[]>(classPageFallback),
  );
}

export function fetchComicDetail(comicId: number): Promise<ComicDetail> {
  return request('ComicDetail', { comicId }, fallbackData<ComicDetail>(detailFallback));
}

export function fetchMoreRecommend(comicId: number): Promise<ComicItem[]> {
  const fallback = fallbackData<HomeRecommendData>(homeRecommendFallback).list.slice(0, 8);
  return request<{ recommend_comics?: ComicItem[] } | ComicItem[]>('MoreRecommend', { comicId }, fallback).then((data) =>
    Array.isArray(data) ? data : data.recommend_comics ?? fallback,
  );
}

export function fetchReviews(comicId: number): Promise<ReviewItem[]> {
  const fallback = [
    {
      id: 1,
      nick_name: '漫画读者',
      content: '画风稳定，剧情推进很有吸引力。',
      score: 5,
    },
    {
      id: 2,
      nick_name: '追更中',
      content: '角色关系清楚，适合一口气看很多话。',
      score: 4,
    },
  ];
  return request<{ short_reviews?: ReviewItem[]; long_reviews?: ReviewItem[] } | ReviewItem[]>(
    'GetReviewDetailByComicID',
    { comicId },
    fallback,
  ).then((data) => (Array.isArray(data) ? data : data.short_reviews ?? data.long_reviews ?? fallback));
}

export function fetchImageIndex(epId: number): Promise<ImageIndex> {
  return request('GetImageIndex', { epId }, fallbackData<ImageIndex>(imageIndexFallback));
}

export function imageUrlsFromIndex(index: ImageIndex): string[] {
  return index.images.slice(0, 8).map((item) => {
    if (item.path.startsWith('http')) return item.path;
    return `https://manga.hdslb.com${item.path}@660w.jpg`;
  });
}

export function fetchImageTokens(urls: string[]): Promise<ImageTokenItem[]> {
  return request('ImageToken', { urls: JSON.stringify(urls) }, fallbackData<ImageTokenItem[]>(imageTokenFallback));
}

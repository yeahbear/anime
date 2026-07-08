import type { ComicItem, ComicStyle } from '@/types/comic';

export function normalizeImage(url?: string): string {
  if (!url) return '';
  return url.replace(/^http:\/\//, 'https://');
}

export function comicId(item: ComicItem): number {
  return item.comic_id ?? item.season_id ?? item.id ?? 0;
}

export function comicCover(item: ComicItem): string {
  return normalizeImage(item.vertical_cover ?? item.img ?? item.square_cover ?? item.horizontal_cover);
}

export function horizontalCover(item: ComicItem): string {
  return normalizeImage(item.horizontal_cover ?? item.img ?? item.vertical_cover ?? item.square_cover);
}

export function authorText(item: ComicItem): string {
  const names = item.author ?? item.authors ?? item.author_name ?? [];
  return names.slice(0, 2).join(' / ') || '未知作者';
}

export function styleText(styles?: Array<ComicStyle | string>): string {
  if (!styles?.length) return '漫画';
  return styles
    .map((style) => (typeof style === 'string' ? style : style.name))
    .filter(Boolean)
    .slice(0, 2)
    .join(' · ');
}

export function shortNumber(value?: number): string {
  if (!value) return '0';
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return String(value);
}

export function statusText(status?: number): string {
  return status === 1 ? '已完结' : '连载中';
}

export function safeText(text?: string): string {
  return text?.replace(/\\n/g, '\n').trim() || '';
}

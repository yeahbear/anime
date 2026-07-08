export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface BannerItem {
  id: number;
  title: string;
  img: string;
  img2?: string;
  bg?: string;
  jump_value?: string;
}

export interface ComicStyle {
  id: number;
  name: string;
}

export interface ComicItem {
  comic_id?: number;
  season_id?: number;
  id?: number;
  title: string;
  sub_title?: string;
  img?: string;
  horizontal_cover?: string;
  square_cover?: string;
  vertical_cover?: string;
  author?: string[];
  authors?: string[];
  author_name?: string[];
  styles?: Array<ComicStyle | string>;
  introduction?: string;
  evaluate?: string;
  comment_total?: number;
  review_score?: number;
  total?: number;
  last_ord?: number;
  last_short_title?: string;
  bottom_info?: string;
  status?: number;
  is_finish?: number;
  allow_wait_free?: boolean;
  decision_info?: string;
  rank?: {
    rank: number;
    name: string;
  };
  last_rank?: number;
  last_ep?: number;
}

export interface HomeRecommendData {
  seed: string;
  list: ComicItem[];
}

export interface ChapterItem {
  id: number;
  ord: number;
  short_title: string;
  title: string;
  cover: string;
  comments: number;
  is_locked: boolean;
  image_count: number;
}

export interface ComicDetail extends ComicItem {
  id: number;
  horizontal_covers?: string[];
  ep_list: ChapterItem[];
  tags?: ComicStyle[];
  data_info?: {
    fav_count?: number;
    popularity?: {
      popularity_value: string;
    };
  };
}

export interface LabelData {
  styles: ComicStyle[];
  areas: ComicStyle[];
  status: ComicStyle[];
  orders: ComicStyle[];
  prices: ComicStyle[];
  special: ComicStyle[];
}

export interface RankTab {
  id: number;
  name: string;
}

export interface ReviewItem {
  id?: number;
  nick_name?: string;
  content?: string;
  score?: number;
  ctime?: string;
  avatar?: string;
}

export interface ImageIndex {
  host?: string;
  images: Array<{
    path: string;
    x: number;
    y: number;
  }>;
}

export interface ImageTokenItem {
  url: string;
  token: string;
  complete_url: string;
}

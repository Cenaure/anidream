import {CommonMalResponse} from './common.shcema';
import {Pagination} from '../../../shared/services/_schema/pagination.schema';
import {Images} from './image.schema';

// This stuff is cool
export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
}

export interface AnimeTitles {
  type: string;
  title: string;
}

export interface IAnime {
  mal_id: number;
  url: string | null;
  images: Images | null;
  trailer: AnimeTrailer | null;
  titles: AnimeTitles[] | null;
  type: string | null;
  episodes: number | null;
  status: string | null;
  airing: boolean | null;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  synopsis: string | null;
  background: string | null;
  year: number | null;
  producers: CommonMalResponse[] | null;
  studios: CommonMalResponse[] | null;
  genres: CommonMalResponse[] | null;
}

// SortBy Enum
export const AnimeListSortByValues = {
  Score: 'score',
  Rank: 'rank',
  Popularity: 'popularity',
  Year: 'year',
  Episodes: 'episodes',
} as const;
export type AnimeListSortBy =
  typeof AnimeListSortByValues[keyof typeof AnimeListSortByValues];


export interface AnimeByIdResponse {
  data: IAnime;
}

export interface AnimeListResponse {
  data: IAnime[];
  pagination: Pagination;
}

export interface RandomAnimeResponse {
  data: IAnime;
}

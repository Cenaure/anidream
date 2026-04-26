import {Person} from './character.schema';
import {Postava} from './producer.schema';
import {CommonMalResponse} from './common.shcema';
import {Pagination} from './pagination.schema';
import {Images} from './image.schema';

// TODO remove below

export class Film {
  constructor(
    public nazov: string,
    public rok: number,
    public slovenskyNazov: string,
    public imdbID: string,
    public reziser: Person[],
    public postava: Postava[],
    public poradieVRebricku: {[name: string]: number},
    public id?: number
  ){}
}


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

export interface Anime {
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

export interface AnimeByIdResponse {
  data: Anime;
}

export interface AnimeListResponse {
  data: Anime[];
  pagination: Pagination;
}

export interface RandomAnimeResponse {
  data: Anime;
}

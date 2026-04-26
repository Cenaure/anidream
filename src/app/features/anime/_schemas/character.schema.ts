// TODO transfer to rust-server
import {Images} from './image.schema';

export class Person {
  constructor(
    public id: number,
    public krstneMeno: string,
    public stredneMeno: string,
    public priezvisko: string
  ){}
}

interface Character {
  mal_id: number;
  images: Images;
  name: string;
  url: string;
}

export interface AnimeCharacter {
  character: Character;
  role: string;
}

export interface AnimeCharactersResponse {
  data: AnimeCharacter[];
}

import {Person} from './character.schema';
import {Postava} from './producer.schema';

// TODO transfer to rust-server

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

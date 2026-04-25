import {Person} from './character.schema';

// TODO transfer to rust-server

export class Postava {
  constructor(
    public postava: string,
    public dolezitost: "hlavná postava" | "vedľajšia postava",
    public herec: Person
  ){}
}

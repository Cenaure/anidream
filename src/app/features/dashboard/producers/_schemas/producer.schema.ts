export interface IProducer {
  id: string;
  name: string;
  mal_id: number;
  url?: string;
}

export function mapProducer(p: any): IProducer {
  return {
    id: p._id?.$oid,
    name: p.name,
    mal_id: p.mal_id,
    url: p.url
  }
}

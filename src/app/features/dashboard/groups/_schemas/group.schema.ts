// Group Schema
export interface IGroup {
  id: string;
  name: string;
  permissions: string[];
}

export function mapGroup(g: any): IGroup {
  return {
    id: g._id?.$oid,
    name: g.name,
    permissions: g.permissions ?? []
  }
}

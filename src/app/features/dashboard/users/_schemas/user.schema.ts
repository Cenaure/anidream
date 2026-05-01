// User Schema
export interface IUser {
  id: string;
  username: string;
  email: string;
  last_login?: Date;
  password?: string;
  groups?: string[];
}

export function mapUser(u: any): IUser {
  return {
    id: u._id?.$oid,
    username: u.username,
    email: u.email,
    last_login: u.last_login?.$date
      ? new Date(Number(u.last_login.$date.$numberLong))
      : u.last_login ? new Date(u.last_login) : undefined,
    password: u.password ?? '',
    groups: u.groups && u.groups.map((g: {$oid: string}) => g.$oid) || []
  }
}

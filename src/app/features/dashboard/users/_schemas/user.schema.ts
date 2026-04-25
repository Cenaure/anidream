export class UserSchema {
  static clone(u: any): UserSchema {
    const id = u._id?.$oid ?? u._id ?? u.id;

    const last_login = u.last_login?.$date
      ? new Date(Number(u.last_login.$date.$numberLong))
      : u.last_login ? new Date(u.last_login) : undefined;

    return new UserSchema(
      u.username,
      u.email,
      id,
      last_login,
      u.password ?? '',
      u.groups?.map((g: any) => Group.clone(g)) ?? []
    );
  }

  constructor(
    public username: string,
    public email: string,
    public id?: string,
    public last_login?: Date,
    public password = '',
    // public active = true,
    public groups: Group[] = []
  ){}

  toString() {
    return `${this.id ?? '?'}: ${this.username}, ${this.email}`;
  }
}

export class Group {

  static clone(g: any): Group {
    const id = g._id?.$oid ?? g._id ?? g.id;

    return new Group(g.name, [...g.permissions], id);
  }

  constructor(
    public name: string,
    public permissions: string[] = [],
    public id?: string
  ){}
}

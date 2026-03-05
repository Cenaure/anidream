export class UserSchema {
  static clone(u: UserSchema): UserSchema {
    return new UserSchema(u.name, u.email, u.id, u.lastLogin, u.password, u.active, u.groups?.map(g => Group.clone(g)));
  }

  constructor(
    public name: string,
    public email: string,
    public id?: number,
    public lastLogin?: Date,
    public password = '',
    public active = true,
    public groups: Group[] = []
  ){}

  toString() {
    return `${this.id ?? '?'}: ${this.name}, ${this.email}`;
  }
}

export class Group {

  static clone(g: Group): Group {
    return new Group(g.name, [...g.permissions], g.id);
  }

  constructor(
    public name: string,
    public permissions: string[] = [],
    public id?: number
  ){}
}

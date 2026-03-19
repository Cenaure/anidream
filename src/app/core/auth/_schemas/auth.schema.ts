export class AuthSchema {
  constructor(
    public username_or_email: string, // Server will validate it
    public password: string
  ){}
}

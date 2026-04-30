import {Group} from '../../../features/dashboard/users/_schemas/user.schema';

export interface UserSession {
  username: string,
  email: string,
  groups: Group[],
  last_login?: Date,
}

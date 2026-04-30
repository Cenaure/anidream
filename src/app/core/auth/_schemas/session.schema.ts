import {IGroup} from '../../../features/dashboard/users/_schemas/user.schema';

export interface IUserSession {
  username: string,
  email: string,
  groups: IGroup[],
  last_login?: Date,
}

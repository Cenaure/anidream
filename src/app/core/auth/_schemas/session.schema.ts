import {IGroup} from '../../../features/dashboard/groups/_schemas/group.schema';

export interface IUserSession {
  username: string,
  email: string,
  groups: IGroup[],
  last_login?: Date,
}

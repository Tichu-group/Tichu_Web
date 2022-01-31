/* eslint-disable */
import UserEntity from './entity/user.entity';

declare global {
  namespace Express {
    interface User extends UserEntity {}
  }
}

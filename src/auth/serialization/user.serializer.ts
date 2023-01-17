import { Expose, Exclude } from 'class-transformer';

export class AuthUserSerializer {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  email: string;

  @Exclude()
  hash: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  birthday: Date;

  @Expose()
  activeStatus: boolean;

  @Expose()
  isEmailConfirmed: boolean;

  @Expose()
  token: string;
}

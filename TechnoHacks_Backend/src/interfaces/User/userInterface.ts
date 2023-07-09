import { Document } from 'mongoose';
import { IDefault, IResponseData, IAccountStatus } from '../index';

export enum UserRoles {
  USER = 'User',
}

export interface IUser extends IDefault, Document {
  name: string;
  username: string;
  phone: number;
  email: string;
  password: string;
  role: UserRoles;
  status: IAccountStatus;
  lastSync?: Date;
}

export interface IGetUsersResponse extends IResponseData {
  results: IUser[];
}

export interface IUserResponse extends IResponseData {
  results: IUser;
}

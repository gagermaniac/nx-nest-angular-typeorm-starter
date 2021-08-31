import { Role } from "./api-enums";

export interface IPagination {
  page?: number;
  limit?: number;
  //used for filtering data
  query?: string;
}

export interface IResponse {
  success: boolean;
  message: string;
  errorMessage: string;
  data: any[];
  error: any;
}
export interface IResetPassword {
  token: string;
  new_password: string;
}

export interface IChangePassword {
  old_password: string;
  new_password: string;
}

export interface IAssignRole {
  user_id: number;
  role: Role;
}

export interface IRegister {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
}
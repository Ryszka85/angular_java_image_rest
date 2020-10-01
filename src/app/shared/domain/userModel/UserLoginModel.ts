export interface IUserLoginModel {
  userId?: string;
  email: string;
  password?: string
}

export class UserLoginModel implements IUserLoginModel{
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class LoggedInUserModel implements IUserLoginModel {
  email: string;
  userId: string;

  constructor(userId: string, email: string) {
    this.email = email;
    this.userId = userId;
  }
}

export interface UserLoginInputDto {
  email: string;
  password: string;
}

export interface UserLoginOutputDto {
  accessToken: string;
  refreshToken: string;
}

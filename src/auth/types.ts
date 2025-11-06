export type JwtPayload = {
  sub: string;
  email: string;
  username: string;
};

export type PublicUser = {
  id: string;
  email: string;
  username: string;
};

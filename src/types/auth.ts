export type UserData = {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface AuthUser {
  jwt: string;
  user: UserData;
}

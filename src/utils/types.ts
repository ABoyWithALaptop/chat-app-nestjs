export type CreateUserDetails = {
  email: string;
  passWord: string;
  firstName: string;
  lastName: string;
};

export type validateUserDetails = {
  email: string;
  password: string;
};

export type findUserParams = Partial<{
  id: number;
  email?: string;
}>;

export type CreateUserDetails = {
  email: string;
  password: string;
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

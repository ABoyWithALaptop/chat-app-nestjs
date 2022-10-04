import * as bcrypt from 'bcrypt';

export async function hassPassword(rawPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt();

  return bcrypt.hash(rawPassword, salt);
}

export async function comparePassword(
  rawPassword: string,
  hassPassword: string,
) {
  return bcrypt.compare(rawPassword, hassPassword);
}

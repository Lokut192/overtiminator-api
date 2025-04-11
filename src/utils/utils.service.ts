import * as bcrypt from 'bcryptjs';

export class UtilsService {
  public static async passwordMatch(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

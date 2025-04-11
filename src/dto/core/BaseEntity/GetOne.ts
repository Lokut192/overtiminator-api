import { Expose, Transform } from 'class-transformer';

export class GetOneBaseEntityDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({ obj }) => {
    return !!obj.createdBy
      ? {
          id: obj.createdBy?.id,
          email: obj.createdBy?.email,
          username: obj.createdBy?.username ?? null,
        }
      : null;
  })
  createdBy: {
    id: number;
    email: string;
    username: string | null;
  } | null;

  @Expose()
  updatedAt: Date | null;

  @Expose()
  @Transform(({ obj }) => {
    return !!obj.updatedBy
      ? {
          id: obj.updatedBy?.id,
          email: obj.updatedBy?.email,
          username: obj.updatedBy?.username ?? null,
        }
      : null;
  })
  updatedBy: {
    id: number;
    email: string;
    username: string | null;
  } | null;

  @Expose()
  deleted: boolean;

  @Expose()
  deletedAt: Date | null;
}

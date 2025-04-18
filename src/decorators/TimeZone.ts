import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TimeZone = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-timezone'];
  },
);

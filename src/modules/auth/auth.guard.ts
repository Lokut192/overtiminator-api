import { Injectable } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     return true;
//   }
// }
@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {}

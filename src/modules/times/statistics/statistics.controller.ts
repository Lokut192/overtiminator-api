import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoggedUser } from 'src/decorators/auth/LoggedUser.decorator';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { LoggedUserType } from 'src/modules/auth/auth.types';

import { StatisticsService } from './statistics.service';

@ApiBearerAuth()
@ApiTags('Times statistics')
@UseGuards(AuthGuard)
@Controller('times/statistics')
export class StatisticsController {
  constructor(private readonly statsService: StatisticsService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Get logged user statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns logged user statistics',
    type: Object,
    isArray: true,
  })
  async findMany() {
    // TODO: Return valid stats
    return [];
  }

  @Post('generate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Generate logged user statistics' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Started generating logged user statistics',
  })
  @ApiExcludeEndpoint(process.env.NODE_ENV === 'production')
  async startGeneratingStats(
    @LoggedUser() loggedUser: LoggedUserType,
    @Query('month', new ParseIntPipe()) month: string,
    @Query('year', new ParseIntPipe()) year: string,
  ) {
    // Start service in background
    // void this.statsService.generateForUser(loggedUser.userId, {
    //   start: DateTime.now().startOf('month').toUTC().toISO(),
    //   end: DateTime.now().endOf('month').toUTC().toISO(),
    // });
    void this.statsService.generateUser(
      loggedUser.userId,
      Number(month),
      Number(year),
    );

    return;
  }
}

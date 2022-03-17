import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { LinkChallengeMatchDTO } from './dtos/link-challenge-match.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {

    constructor(private readonly challengesService: ChallengesService) {}

    private readonly logger = new Logger(ChallengesController.name);

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() challengeDTO: CreateChallengeDTO): Promise<Challenge> {
        this.logger.log(`createChallengeDTO: ${JSON.stringify(challengeDTO)}`);
        return await this.challengesService.create(challengeDTO);
    }

    @Get()
    async search(@Query('id') _id: string): Promise<Array<Challenge>> {
        return _id 
        ? await this.challengesService.searchByPlayer(_id)
        : await this.challengesService.search()
    }

    @Put('/:challenge')
    async update(
        @Body(ChallengeStatusValidationPipe) challengeDTO: UpdateChallengeDTO,
        @Param('challenge') _id: string
    ): Promise<void> {
        await this.challengesService.update(_id, challengeDTO);
    }

    @Post('/:challenge/match/')
    async linkChallengeMatch(
        @Body(ValidationPipe) challengeMatchDTO: LinkChallengeMatchDTO,
        @Param('challenge') _id: string
    ): Promise<void> {
        return await this.challengesService.linkChallengeMatch(_id, challengeMatchDTO)
    }

    @Delete('/:id')
    async delete(@Param('id') _id: string): Promise<void> {
        this.challengesService.delete(_id)
    }


}

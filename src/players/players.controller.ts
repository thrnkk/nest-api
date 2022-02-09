import { Body, Controller, Delete, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersParametersValidation } from './pipes/players-parameters-validation.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {

    constructor(
        private readonly playersService: PlayersService
    ) {}

    @Post()
    @UsePipes(ValidationPipe)
    async upsert(@Body() playerDTO: CreatePlayerDTO) {
        await this.playersService.upsert(playerDTO)
    }

    @Get()
    async search(@Query('email', PlayersParametersValidation) email: string): Promise<Player[] | Player> {
        if (email) return this.playersService.search(email)
        else return this.playersService.search()
    }

    @Delete()
    async delete(@Query('email', PlayersParametersValidation) email: string): Promise<void> {
        this.playersService.delete(email);
    }

}

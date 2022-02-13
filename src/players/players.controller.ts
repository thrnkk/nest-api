import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { UpdatePlayerDTO } from './dtos/update-player.dto';
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
    async insert(@Body() playerDTO: CreatePlayerDTO): Promise<Player> {
        return await this.playersService.create(playerDTO)
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async update(
        @Body() playerDTO: UpdatePlayerDTO, 
        @Param('_id', PlayersParametersValidation) _id: string
    ): Promise<void> {
        await this.playersService.update(_id, playerDTO)
    }

    @Get()
    async searchAll(): Promise<Player[]> {
        return this.playersService.search()
    }

    @Get('/:_id')
    async searchById(@Param('_id', PlayersParametersValidation) _id: string): Promise<Player> {
        return this.playersService.searchById(_id)
    }

    @Delete('/:_id')
    async delete(@Param('_id', PlayersParametersValidation) _id: string): Promise<void> {
        this.playersService.delete(_id);
    }

}

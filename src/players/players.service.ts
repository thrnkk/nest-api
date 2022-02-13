import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {

    constructor(@InjectModel('Players') private readonly playerModel: Model<Player>) {}

    async create(playerDTO: CreatePlayerDTO): Promise<Player> {
        const { email } = playerDTO;
        const playerFound = await this.playerModel.findOne({email}).exec();
        
        if (playerFound) throw new BadRequestException(`Player with e-mail ${email} already registered`)

        const player = new this.playerModel(playerDTO);
        return await player.save()
        
    }

    async update(_id: string, playerDTO: UpdatePlayerDTO): Promise<void> {
        const playerFound = await this.playerModel.findOne({_id}).exec();
        
        if (!playerFound) throw new BadRequestException(`Player with id ${_id} not found`)

        await this.playerModel.findOneAndUpdate({_id}, {$set: playerDTO}).exec()
        
    }

    async search(): Promise<Player[]> {
        return await this.playerModel.find().exec();      
    }

    async searchById(_id: string): Promise<Player> {
        const playerFound = await this.playerModel.findOne({_id}).exec();
        
        if (!playerFound) throw new BadRequestException(`Player with id ${_id} not found`)

        return playerFound;
    }

    async delete(_id: string): Promise<any> {
        const playerFound = await this.playerModel.findOne({_id}).exec();
        
        if (!playerFound) throw new BadRequestException(`Player with id ${_id} not found`)
        return await this.playerModel.deleteOne({_id}).exec();
    }

}

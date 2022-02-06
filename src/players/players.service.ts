import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {

    constructor(@InjectModel('Players') private readonly playerModel: Model<Player>) {}

    async upsert(playerDTO: CreatePlayerDTO): Promise<void> {
        const { email } = playerDTO;
        const playerFound = await this.playerModel.findOne({email}).exec();
        
        if (playerFound) this.update(playerDTO);
        else             this.create(playerDTO);
        
    }

    async search(email?: string): Promise<Player[] | Player> {
        if (email) {
            const playerFound = await this.playerModel.findOne({email}).exec();
            if (!playerFound) throw new NotFoundException(`Jogador com o e-mail ${email} não encontrado.`); 

            return playerFound;
        } else {
            return await this.playerModel.find().exec();
        }
        
    }

    async delete(email: string): Promise<any> {
        return await this.playerModel.remove({email}).exec();
    }

    private async create(playerDTO: CreatePlayerDTO): Promise<Player> {
        const player = new this.playerModel(playerDTO);
        return await player.save()
    }

    private async update(playerDTO: CreatePlayerDTO): Promise<Player> {
        return await this.playerModel.findOneAndUpdate({email: playerDTO.email}, {$set: playerDTO}).exec()
    }

}

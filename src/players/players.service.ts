import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {

    private players: Player[] = [];
    private readonly logger = new Logger(PlayersService.name);

    async createUpdatePlayer(playerDTO: CreatePlayerDTO): Promise<void> {

        this.create(playerDTO);
    }

    private create(playerDTO: CreatePlayerDTO): void {
        const { name, phoneNumber, email } = playerDTO;

        const player: Player = {
            _id: uuidv4(),
            name,
            phoneNumber,
            email,
            ranking: 'A',
            positionRanking: 3,
            urlPhoto: 'www.google.com.br/foto123.jpg'
        };

        this.logger.log(`playerDTO: ${JSON.stringify(player)}`);
        this.players.push(player);
    }

}

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {

    private players: Player[] = [];
    private readonly logger = new Logger(PlayersService.name);

    async upsert(playerDTO: CreatePlayerDTO): Promise<void> {
        const { email } = playerDTO;
        const playerFound = this.players.find(player => player.email === email);
        
        if (playerFound) this.update(playerFound, playerDTO); // update
        else             this.create(playerDTO); // insert
        
    }

    async search(email?: string): Promise<Player[] | Player> {
        if (email) {
            const playerFound = this.players.find(player => player.email === email);
            if (!playerFound) throw new NotFoundException(`Jogador com o e-mail ${email} não encontrado.`); 

            return playerFound;
        } else {
            return await this.players;
        }
        
    }

    async delete(email: string): Promise<Player> {
        const playerFound = this.players.find(player => player.email === email);
        this.players = this.players.filter(player => player.email !== playerFound.email);

        return
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

    private update(playerFound: Player, playerDTO: CreatePlayerDTO): void {
        const { name } = playerDTO;
        playerFound.name = name;
    }

}

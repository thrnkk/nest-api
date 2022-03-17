import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { LinkChallengeMatchDTO } from './dtos/link-challenge-match.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { Challenge, Match } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {

    private readonly logger = new Logger(ChallengesService.name)

    constructor(
        @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
        @InjectModel('Match') private readonly matchModel: Model<Match>,
        private readonly playersService: PlayersService,
        private readonly categoriesService: CategoriesService
    ) {}

    async create(challengeDTO: CreateChallengeDTO): Promise<Challenge> {
        const players = await this.playersService.search()

        challengeDTO.players.map(playerDTO => {
            const playerFilter = players.filter( player => player._id == playerDTO._id )

            if (playerFilter.length == 0) {
                throw new BadRequestException(`The ID ${playerDTO.id} isn't a valid player ID.`)
            }
        })

        const requesterIsPlayerFromMatch = await challengeDTO.players.filter(player => player._id == challengeDTO.requester)

        this.logger.log(`requesterIsPlayerFromMatch: ${requesterIsPlayerFromMatch}`)

        if (requesterIsPlayerFromMatch.length == 0) {
            throw new BadRequestException(`The requester needs to be a player from the match.`)
        }

        const playerCategory = await this.categoriesService.searchByPlayerId(challengeDTO.requester)

        if (!playerCategory) {
            throw new BadRequestException(`The requester needs to be registered on a category.`)
        }

        const challengeCreated = new this.challengeModel(challengeDTO)
        challengeCreated.category = playerCategory.category
        challengeCreated.requested_at = new Date()

        challengeCreated.status = ChallengeStatus.PENDING
        this.logger.log(`challengeCreated: ${JSON.stringify(challengeCreated)}`)
        return await challengeCreated.save()
    }

    async search(): Promise<Array<Challenge>> {
        return await this.challengeModel.find()
        .populate('requester')
        .populate('players')
        .populate('match')
        .exec()
    }

    async searchByPlayer(_id: any): Promise<Array<Challenge>> {

        const players = await this.playersService.search()

        const playerFilter = players.filter( player => player._id == _id )

        if (playerFilter.length == 0) {
            throw new BadRequestException(`The ID ${_id} isn't from any player.`)
        }

        return await this.challengeModel.find()
        .where('players')
        .in(_id)
        .populate('requester')
        .populate('players')
        .populate('match')
        .exec()

    }

    async update(_id: string, challengeDTO: UpdateChallengeDTO): Promise<void> {

        const challengeFound = await this.challengeModel.findById(_id).exec()

        if (!challengeFound) {
            throw new NotFoundException(`Challenge ${_id} not found.`)
        }

        if (challengeDTO.status) {
            challengeFound.answered_at = new Date()
        }

        challengeFound.status = challengeDTO.status
        challengeFound.timestamp = challengeDTO.timestamp

        await this.challengeModel.findOneAndUpdate({_id}, {$set: challengeFound}).exec()

    }

    async linkChallengeMatch(_id: string, challengeMatchDTO: LinkChallengeMatchDTO): Promise<void> {

        const challengeFound = await this.challengeModel.findById(_id).exec()

        if (!challengeFound) {
            throw new NotFoundException(`Challenge ${_id} not found.`)
        }

        const playerFilter = challengeFound.players.filter( player => player._id == challengeMatchDTO.def )

        if (playerFilter.length == 0) {
            throw new BadRequestException(`The winner isn't part of the challenge`)
        }

        const createdMatch = new this.matchModel(challengeMatchDTO)

        createdMatch.category = challengeFound.category
        createdMatch.players = challengeFound.players

        const result = await createdMatch.save();

        challengeFound.status = ChallengeStatus.ACCOMPLISHED
        challengeFound.match = result._id

        try {
            await this.challengeModel.findOneAndUpdate({_id}, {$set: challengeFound}).exec()
        } catch (error) {
            await this.matchModel.deleteOne({_id: result._id}).exec()
            throw new InternalServerErrorException()
        }
    }

    async delete(_id: string): Promise<void> {

        const challengeFound = await this.challengeModel.findById(_id).exec()

        if (!challengeFound) {
            throw new NotFoundException(`Challenge ${_id} not found.`)
        }

        challengeFound.status = ChallengeStatus.CANCELLED

        await this.challengeModel.findOneAndUpdate({_id}, {$set: challengeFound}).exec()

    }

}

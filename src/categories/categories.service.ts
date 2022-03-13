import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel('Category') private readonly categoryModel: Model<Category>,
        private readonly playersService: PlayersService
    ) {}

    async createCategory(createCategoryDTO: CreateCategoryDTO): Promise<Category> {

        const { category } = createCategoryDTO;

        const categoryFound = await this.categoryModel.findOne({category}).exec();
        
        if (categoryFound) throw new BadRequestException(`Category ${category} already registered`);

        const categoryCreated = new this.categoryModel(createCategoryDTO);

        return await categoryCreated.save();

    }

    async searchAll(): Promise<Array<Category>> {

        return await this.categoryModel.find().populate('players').exec();

    }

    async searchById(category: string): Promise<Category> {
        const categoryFound = await this.categoryModel.findOne({category}).exec();

        if (!categoryFound) throw new BadRequestException(`Category ${category} not found`);

        return categoryFound;

    }

    async update(category: string, categoryDTO: UpdateCategoryDTO): Promise<void> {

        const categoryFound = await this.categoryModel.findOne({category}).exec();

        if (!categoryFound) throw new BadRequestException(`Category ${category} not found`);

        await this.categoryModel.findOneAndUpdate({category}, {$set: categoryDTO}).exec();

    }

    async linkPlayer(params: string[]): Promise<void> {
        const category = params['category'];
        const player   = params['player'];

        const categoryFound = await this.categoryModel.findOne({category}).exec();
        const playerAlreadyRegistered = await this.categoryModel.find({category}).where('players').in(player).exec();

        await this.playersService.searchById(player); 

        // validations
        if (!categoryFound) throw new BadRequestException(`Category ${category} not found`);
        if (playerAlreadyRegistered.length > 0) throw new BadRequestException(`Player ${player} already registered on category ${category}`)

        categoryFound.players.push(player)
        await this.categoryModel.findOneAndUpdate({category}, {$set: categoryFound}).exec()

    }

}

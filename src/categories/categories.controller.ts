import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {

    }

    @Post()
    @UsePipes(ValidationPipe)
    async createCategory(@Body() createCategoryDTO: CreateCategoryDTO): Promise<Category> {
        return await this.categoriesService.createCategory(createCategoryDTO);
    }

    @Get()
    async searchCategories(): Promise<Array<Category>> {
        return await this.categoriesService.searchAll();
    }

    @Get('/:category')
    async searchById(@Param('category') category: string): Promise<Category> {
        return await this.categoriesService.searchById(category);
    }

    @Put('/:category')
    @UsePipes(ValidationPipe)
    async update(@Body() categoryDTO: UpdateCategoryDTO, @Param('category') category: string): Promise<void> {
        await this.categoriesService.update(category, categoryDTO);
    }

    @Post('/:category/players/:player')
    async linkPlayer(@Param() params: string[]): Promise<void> {
        return await this.categoriesService.linkPlayer(params);
    }

}

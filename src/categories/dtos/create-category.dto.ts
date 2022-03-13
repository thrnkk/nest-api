import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDTO {

    @IsString()
    @IsNotEmpty()
    readonly category: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>;

}
import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

export class UpdateCategoryDTO {

    @IsString()
    @IsOptional()
    description: string;

    @IsArray()
    @ArrayMinSize(1)
    events: Array<Event>

    

}
import { IsOptional } from "class-validator";
import { ChallengeStatus } from "../interfaces/challenge-status.enum";

export class UpdateChallengeDTO {

    @IsOptional()
    timestamp: Date;

    @IsOptional()
    status: ChallengeStatus;

}
import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ChallengeStatus } from "../interfaces/challenge-status.enum";

export class ChallengeStatusValidationPipe implements PipeTransform {

    readonly allowedStatus = [
        ChallengeStatus.ACCEPTED,
        ChallengeStatus.DENIED,
        ChallengeStatus.CANCELLED,
    ];

    transform(value: any) {
        const status = value.status.toUpperCase();

        if (!this.isAllowedStatus(status)) {
            throw new BadRequestException(`${status} isn't a valid status.`);
        }

        return value;
    }

    private isAllowedStatus(status: any) {
        const index = this.allowedStatus.indexOf(status);

        return index !== -1;
    }

}
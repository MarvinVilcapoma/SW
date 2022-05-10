import { Assignment } from "../assignment/assignment.interface";
import { Nutritionist } from "../nutritionist/nutritionist";

import { Participant } from "../participant/participant.interface";

export class Referred {
    referredId!: number;
    assignmentId!: number;
    assignment!: Assignment;
    nutritionistId!: number;
    nutritionist!: Nutritionist;
    description!: string;

    userAppID!: number;
    participant!: Participant;
    participantId!: number;
    isSincronizado!: boolean;
    _id!: string;
    _rev!: string;
}
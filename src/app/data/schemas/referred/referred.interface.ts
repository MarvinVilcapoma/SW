import { Assignment } from "../assignment/assignment.interface";
import { Nutritionist } from "../nutritionist/nutritionist";

export class Referred{
    referredId!: number;
    assignmentId!: number;
    assignment!: Assignment;
    nutritionistId!: number;
    nutritionist!: Nutritionist;
    description!: string;
}
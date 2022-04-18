import { Assignment } from "../assignment/assignment.interface";
import { ContactType } from "../contactType/contactType.interface";

export class Contact{
    contactId!: number;
    assignmentId!: number;
    assignment!: Assignment;
    contactTypeId!: number;
    description!: string;
    contactType!: ContactType;
    startDate!: Date;
    endDate!: Date;
    createdOn!: Date;
    enabled!: boolean;
}
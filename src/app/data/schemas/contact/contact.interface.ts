import { Assignment } from "../assignment/assignment.interface";
import { ContactType } from "../contactType/contactType.interface";
import { Participant } from "../participant/participant.interface";

export class Contact{
    contactId!: number;
    assignmentId!: number;
    contactTypeId!: number;
    description!: string;

    assignment!: Assignment;
    contactType!: ContactType;
    participant!: Participant;

    startDate!: Date;
    endDate!: Date;
    
    createdOn!: Date;
    
    userAppID!: number;
    nameFullParticipante!: string;
    nameFullContactType!: string;
    isSincronizado!: boolean;
    _id!: string;
    _rev!: string;
}
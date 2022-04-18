import { Participant } from "../participant/participant.interface";

export class Assignment {
    assignmentId!: number;
    participantId!: number;
    participant!: Participant;
    counselorId!: number;
    createdOn!: Date;
    enabled!: boolean;
}
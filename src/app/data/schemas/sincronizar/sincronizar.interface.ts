import { Contact } from "../contact/contact.interface";
import { Referred } from "../referred/referred.interface";

export class SincronizarRequest {
    userId!: number;
    listContacts: Contact[] | any = [];
    listReferreds: Referred[] | any = [];

    _id!: string;
    _rev!: string;
}

export class SincronizarResponse {
    isEstado!: boolean;
    mensaje!: string;
}
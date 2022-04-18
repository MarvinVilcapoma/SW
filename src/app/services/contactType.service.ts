import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseBase } from "../data/schemas/base/ResponseBase.interface";
import { ContactType } from "../data/schemas/contactType/contactType.interface";

@Injectable({
    providedIn: 'root'
  })
export class ContactTypeService {

  constructor(private httpClient: HttpClient) { 

  }
  getContactTypes(): Observable<ResponseBase<ContactType>>{
    return this.httpClient.get<ResponseBase<ContactType>>(`${environment.urlBase}api/ContactType/Get`)};
  
}
  
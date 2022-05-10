import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseBase } from "../data/schemas/base/ResponseBase.interface";
import { Contact } from "../data/schemas/contact/contact.interface";
import { SincronizarRequest, SincronizarResponse } from "../data/schemas/sincronizar/sincronizar.interface";

@Injectable({
    providedIn: 'root'
  })
export class ContactService {
  
  constructor(private httpClient: HttpClient) {  }

  Insert(request : Contact): Observable<ResponseBase<Contact>>{
    return this.httpClient.post<ResponseBase<Contact>>(`${environment.urlBase}api/Contact/SincronizarLote`, request)
  };

  Sincronizar(request : SincronizarRequest): Observable<ResponseBase<SincronizarResponse>>{
    return this.httpClient.post<ResponseBase<SincronizarResponse>>(`${environment.urlBase}api/Contact/SincronizarLote`, request)
  };

 }
  
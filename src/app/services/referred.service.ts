import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponseBase } from "../data/schemas/base/ResponseBase.interface";
import { Referred } from "../data/schemas/referred/referred.interface";

@Injectable({
    providedIn: 'root'
  })
export class ReferredService {
  
    constructor(private httpClient: HttpClient) { 
  
    }

    Insert(request : Referred): Observable<ResponseBase<Referred>>{
      return this.httpClient.post<ResponseBase<Referred>>(`${environment.urlBase}api/Referred/InsertOrUpdate`, request)};
}
  

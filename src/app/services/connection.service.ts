import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";
import { ResponseBase } from "../data/schemas/base/ResponseBase.interface";
import { ValidateConex } from "src/app/data/schemas/validateConex/validateConex.interface";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private httpClient: HttpClient) { 

  }

  ValidateConexion(): Observable<ResponseBase<ValidateConex>> { 
    return this.httpClient.get<ResponseBase<ValidateConex>>(`${environment.urlBase}api/auth/GetValidateConex`);
  }
}

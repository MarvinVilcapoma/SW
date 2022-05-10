import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private httpClient: HttpClient) { 

  }

  //test(){
  //  return this.httpClient.post(`${environment.urlBase}api/auth/login`, {});
  //}
}

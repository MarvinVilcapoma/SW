import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assignment } from '../data/schemas/assignment/assignment.interface';
import { ResponseBase } from '../data/schemas/base/ResponseBase.interface';
import { Nutritionist } from '../data/schemas/nutritionist/nutritionist';
import { AuthService } from '../modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { 

  }

  getParticipantsForCounselor(id: number): Observable<ResponseBase<Assignment>>{
    return this.httpClient.get<ResponseBase<Assignment>>(`${environment.urlBase}api/User/GetParticipantsForCounselor/${id}`, {headers: {
        'Access-Control-Allow-Origin': '*',
        "Accept": "*/*",
        'Authorization' : `Bearer ${this.authService.getToken}`
       } });
  }

  getNutritionist(): Observable<ResponseBase<Nutritionist>>{
    return this.httpClient.get<ResponseBase<Nutritionist>>(`${environment.urlBase}api/User/GetNutritionists`, {headers: {
      'Access-Control-Allow-Origin': '*',
      "Accept": "*/*",
      'Authorization' : `Bearer ${this.authService.getToken}`
     } });
  }
}

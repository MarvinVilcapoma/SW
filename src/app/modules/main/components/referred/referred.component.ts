import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Assignment } from 'src/app/data/schemas/assignment/assignment.interface';
import { Nutritionist } from 'src/app/data/schemas/nutritionist/nutritionist';
import { Referred } from 'src/app/data/schemas/referred/referred.interface';
import { ReferredService } from 'src/app/services/referred.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Participant } from 'src/app/data/schemas/participant/participant.interface';

@Component({
  selector: 'app-referred',
  templateUrl: './referred.component.html',
  styleUrls: ['./referred.component.scss'],
  providers:[
    MessageService
  ]
})
export class ReferredComponent implements OnInit {

  participantList: Assignment[] | any = [];
  nutritionistList: Nutritionist[] | any = [];

  referredRequest!: Referred;

  referredList: Referred[] | any = [];


  nutritionist!: Nutritionist[];
  participants!: Participant[];

  userId!: number;

  home!: MenuItem; 
  constructor(private userService: UserService, 
    private referredService: ReferredService,
    private dbService: DatabaseService, 
    private authService: AuthService) { }
  items: any;

  ngOnInit(): void {
    this.items = [
      {label: 'Contactos'},
      {label: 'Referir a Nutricionista'},
    ];
    this.home = {icon: 'pi pi-home'};


    var decoded: any = jwt_decode(this.authService.getToken());
    // this.userId = decoded.id;
    // console.log(this.userId);

    this.userService.getParticipantsForCounselor(5).subscribe(res=>{
      this.participantList = res.listado;
      console.log(this.participantList)
    });

    this.userService.getNutritionist().subscribe(res=>{
      this.nutritionistList = res.listado;
      console.log(this.nutritionistList);
    });



  }

  AddReferred(){
    this.referredService.Insert(this.referredRequest).subscribe(res=>{
      this.referredList = res.listado;
    })
  }

  loadNutritionist(){
    this.nutritionist = [];
    this.dbService.getNutritionist()
        .then((res: any) => {
          let preNutritionist: any[] = [];
          res.rows.forEach(element => {
            preNutritionist.push(element.doc);
          });
          this.nutritionist = preNutritionist;
        });
  }

  loadParticipants(){
    this.participants = [];

    this.dbService.getParticipants()
        .then((res: any) => {
          let preContacts: any[] = [];
          res.rows.forEach(element => {
            preContacts.push(element.doc);
          });
          this.participants = preContacts;
        });
  } 

}

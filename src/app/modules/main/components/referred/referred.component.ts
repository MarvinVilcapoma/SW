import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Assignment } from 'src/app/data/schemas/assignment/assignment.interface';
import { Nutritionist } from 'src/app/data/schemas/nutritionist/nutritionist';
import { Referred } from 'src/app/data/schemas/referred/referred.interface';
import { Router } from '@angular/router';
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
  referredRequest: Referred = new Referred();

  participantList: Assignment[] | any = [];
  nutritionistList: Nutritionist[] | any = [];
  
  nutritionist!: Nutritionist[];
  participants!: Participant[];

  userId!: number;
  iSubMenuHtml: any;
  home!: MenuItem; 
  
  isFieldValidDescripcion:  Boolean = false;
  isFieldValidParticipants: Boolean = false;
  isFieldValidNutritionist: Boolean = false;
  //
  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }

  
  ngOnInit(): void {
    this.iSubMenuHtml = [ { label: 'Contactos'}, {label: 'Referir a Nutricionista'} ];
    this.home = {icon: 'pi pi-home'};

    var decoded: any = jwt_decode(this.authService.getToken());
    this.userId        = decoded.id;

    this.loadParticipants();
    this.loadNutritionist();
    localStorage.removeItem('_dinamicUpdate'); 
  }
 
  submit(){
    if(this.isValForm())
    {
      //console.log("submit()--->Guardar Referred");
      var decoded: any = jwt_decode(this.authService.getToken());
      this.userId = decoded.id;
      this.messageService.add({key: 'tc', severity:'success', summary: 'Éxito', detail: 'Se registró correctamente.'});
      
      //console.log(this.referredRequest);      
      let referredNew = new Referred();
      referredNew.nutritionistId = this.referredRequest.nutritionist.userID;
      referredNew.participantId  = this.referredRequest.participant.userID; 
      referredNew.assignmentId   = this.referredRequest.participant.assignmentId; 
      referredNew.description    = this.referredRequest.description; 
      
      referredNew.userAppID = this.userId;
      referredNew.isSincronizado = false;
      
      this.dbService.addReferral(referredNew);
      
      this.referredRequest = new Referred();
    }
    else{
      console.log("submit()--->Validate");
      this.messageService.add({key: 'tc', severity:'warn', summary: 'Validación', detail: 'Se requiere los campos obligatorios.'});
    }
  }

  loadNutritionist(){
    this.nutritionist = [];
    this.dbService
        .getNutritionist()
        .then((res: any) => {
          let preNutritionist: any[] = [];
          res.rows.forEach(element => {
            preNutritionist.push(element.doc);
          });
          this.nutritionist = preNutritionist;
        });
  }

  loadParticipants(){
      var decoded: any = jwt_decode(this.authService.getToken());
      this.userId = decoded.id;

      this.participants = [];
      this.dbService
          .getParticipants()
          .then((res: any) => {
            //console.log(" loadParticipants()==> dbService.getParticipants().Then");          
            let preContacts: any[] = [];
            res.rows.forEach(element => {
              if(element.doc.userAppID == this.userId)
              {
                //console.log(element.doc);
                preContacts.push(element.doc);
              }            
            });
            this.participants = preContacts;
            //console.log(" loadParticipants()==> participants");
            //console.log(this.participants);
          });
    }
    
  isValString(x: string | null) {
    if (x === null || x == null || x == ""|| x == undefined) {
      return false;
    }
    return true;
  }
  isValForm(){
    let isValidate = true;
    if(!this.isValString(this.referredRequest.description))
    {
       isValidate = false;
       this.isFieldValidDescripcion = true;
    } else { this.isFieldValidDescripcion = false; }
    
    if(this.referredRequest.participant == null){
     isValidate = false;
     this.isFieldValidParticipants = true;
    } else { this.isFieldValidParticipants = false; }
    
    if(this.referredRequest.nutritionist == null)
    {
       isValidate = false;
       this.isFieldValidNutritionist = true;
    } else { this.isFieldValidNutritionist = false; }
    
    return isValidate;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Credentials } from 'src/app/data/schemas/user/credentials.interface';
import { AuthService } from '../../services/auth.service';
import jwt_decode from "jwt-decode";
import { UserService } from 'src/app/services/user.service';
import { ContactTypeService } from 'src/app/services/contactType.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Participant } from 'src/app/data/schemas/participant/participant.interface';
import { ContactType } from 'src/app/data/schemas/contactType/contactType.interface';
import { Nutritionist } from 'src/app/data/schemas/nutritionist/nutritionist';
import { ConnectionService } from 'ngx-connection-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [
    MessageService
  ]
})
export class SignInComponent implements OnInit {

  userId!: number;

  participants: Participant = new Participant;
  contactType: ContactType  = new ContactType;
  nutritionist: Nutritionist = new Nutritionist;
  participantsForCounselor!: Participant;

  hasNetworkConnection!: boolean;
  hasInternetAccess!: boolean;
  statusConnection!: string;

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private messageService: MessageService,
      
      private dbService: DatabaseService,
      private userService: UserService,
      private contactTypeService: ContactTypeService,
      private connectionService: ConnectionService
    ) 
    {
      this.connectionService.updateOptions({
        heartbeatExecutor: options => new Observable<any>(subscriber => {
          if (Math.random() > .5) {
            subscriber.next();
            subscriber.complete();
          } else {
            throw new Error('Connection error');
          }
        })
      });

      this.connectionService.monitor().subscribe(currentState => {
        this.hasNetworkConnection = currentState.hasNetworkConnection;
        this.hasInternetAccess    = currentState.hasInternetAccess;

        if (this.hasNetworkConnection && this.hasInternetAccess) {
          this.statusConnection = 'ONLINE';
        } else {
          this.statusConnection = 'OFFLINE';
        }
        console.log("hasNetworkConnection => " + this.hasNetworkConnection);
        console.log("hasInternetAccess => " + this.hasInternetAccess);
        console.log("statusConnection => " + this.statusConnection);
      });
    }

  loginForm: FormGroup = this.fb.group({
    username: [ , [ Validators.required] ],
    password: [ , [ Validators.required] ],
  })

  ngOnInit(): void {

  }

  isFieldValid( campo: string ) {
    return this.loginForm.controls[campo].errors 
        && this.loginForm.controls[campo].touched;
  }

  login(){
    if ( this.loginForm.invalid )  {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials: Credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }
    this.authService.signIn(credentials)
      .subscribe(
        (res) => {
          if (res.code == 401) {
            this.messageService.add({key: 'tl', severity:'error', summary: 'Credenciales incorrectas', detail: 'Usuario o password inválido'});
          }
          else if (res.code == 0){
            //console.log("Datos Login");
            //console.log(res); 
            this.getAllServices();
            this.loginForm.reset();
            this.router.navigate(['counselor','contacts']);
          } 
        },
        (err) => {
          this.messageService.add({key: 'tl', severity:'error', summary: 'Error', detail: 'Contáctese con el administrador'});
        }
      ); 
  }

  getAllServices() 
  {
    this.dbService.createBd();

    var decoded: any = jwt_decode(this.authService.getToken());
    this.userId = decoded.id;
    console.log("User ID : " + this.userId);
    this.userService
        .getParticipantsForCounselor(this.userId)
        .subscribe(res => {      
          if(res.code == 0) 
          {
            if(res.listado != null){
              console.log("Listado Participante");
              for(let i = 0; i < res.listado.length; i++)
              {
                this.participants = new Participant;
                this.participants.assignmentId = res.listado[i].assignmentId;
                this.participants.fullName = String(this.isValString(res.listado[i].participant.firstName) +" "+ this.isValString(res.listado[i].participant.secondName) +" "+ this.isValString(res.listado[i].participant.firstLastName) +" "+ this.isValString(res.listado[i].participant.secondLastName)).trim();
                this.participants.wicId  = res.listado[i].participant.wicId;
                this.participants.userID = res.listado[i].participant.userID;
                this.participants.userAppID = decoded.id;
                this.participants._id = String(res.listado[i].participant.userID);
                console.log(this.participants);
                this.dbService.addParticipantsForCounselor(this.participants);
              }
            }
          }
        });

    this.contactTypeService
        .getContactTypes()
        .subscribe(res => {      
          if(res.code == 0)
          {
            if(res.listado != null){
              //console.log("Listado ContactType");                  
              for(let i = 0; i< res.listado.length; i++) {  
                this.contactType = new ContactType;
                this.contactType.userAppID = decoded.id;     
                this.contactType.contactTypeId = res.listado[i].contactTypeId; 
                this.contactType.description = res.listado[i].description.trim();
                this.contactType._id = String(res.listado[i].contactTypeId); 
                //console.log(this.contactType);
                this.dbService.addContactTypes(this.contactType);
              }
            }
          }
        });

    this.userService
        .getNutritionist()
        .subscribe(res => {
          if(res.code == 0)
          {
            if(res.listado != null){
              for(let i = 0; i< res.listado.length; i++) {
                this.nutritionist = new Nutritionist;
                this.nutritionist.userID = res.listado[i].userID;
                this.nutritionist.fullName = String(this.isValString(res.listado[i].firstName) +" "+ this.isValString(res.listado[i].secondName) +" "+ this.isValString(res.listado[i].firstLastName) +" "+ this.isValString(res.listado[i].secondLastName)).trim();
                
                this.nutritionist.userAppID = decoded.id; 
                this.nutritionist._id = String(res.listado[i].userID);
                //console.log(this.nutritionist);
                this.dbService.addNutritionist(this.nutritionist);                
              }              
            }
          }          
        });
  }

  isValString(x: string | null) {
    if (x === null || x == null || x == "") {
      return "";
    }
    return x;
  }
}

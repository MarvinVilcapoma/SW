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

  participantsList: Participant[] | any = [];
  contactTypeList: ContactType [] | any = [];
  participantsForCounselor!: Participant;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private userService: UserService,
    private contactTypeService: ContactTypeService,
    private dbService: DatabaseService,

    ) { }

  loginForm: FormGroup = this.fb.group({
    username: [ , [ Validators.required] ],
    password: [ , [ Validators.required] ],
  })

  

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
          }else if (res.code == 0){
            console.log(res);
            //
            
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

  ngOnInit(): void {

    
    


  }


  getAllServices(){

    var decoded: any = jwt_decode(this.authService.getToken());
    this.userId = decoded.id;


    this.userService.getParticipantsForCounselor(this.userId).subscribe(res=>{
      console.log(res.listado);
      if(res.code==0){
        this.participantsList = res.listado;

        // this.dbService.addParticipantsForCounselor(this.participantsList);

        for(let i = 0; i < this.participantsList.length; i++){
          this.dbService.addParticipantsForCounselor(this.participantsList[i]);
        }
      }
    });

    this.contactTypeService.getContactTypes().subscribe(res=>{
      if(res.code == 0){
        this.contactTypeList = res.listado;
        // this.dbService.addContactTypes(this.contactTypeList);
        
        for(let i = 0; i<this.contactTypeList.length; i++){
          
          this.dbService.addContactTypes(this.contactTypeList[i]);
        }
      }
      
    });

  }

}

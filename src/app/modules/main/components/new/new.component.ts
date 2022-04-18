import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Assignment } from 'src/app/data/schemas/assignment/assignment.interface';
import { Counselor } from 'src/app/data/schemas/counselor/counselor.interface';
import { User } from 'src/app/data/schemas/user/user.interface';
import { User2 } from 'src/app/data/schemas/user/user2.interface';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ContactTypeService } from 'src/app/services/contactType.service';
import { ContactType } from 'src/app/data/schemas/contactType/contactType.interface';
import { Contact } from 'src/app/data/schemas/contact/contact.interface';
import { Participant } from 'src/app/data/schemas/participant/participant.interface';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [
    MessageService
  ]
})
export class NewComponent implements OnInit {

  userjson !: User2[];

  counselorList!: Counselor[];

  participantList: Assignment[] | any = [];
  contactTypeList: ContactType[] | any = [];

  // selectedParticipant: number = 0;
  // selectedContactType: number = 0;

  



  user: User = new User();

  contact: Contact = new Contact();



  arrayUser: User[] = [];

  counselorName!: string;
  userId!: number;

  home!: MenuItem; 

  contactTypes!: Contact[];
  participants!: Participant[];

  selectedParticipant!: string;
  selectedContactType!: string;

  constructor(
    private dbService: DatabaseService,
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthService,
    private contactTypeService: ContactTypeService,
  ) { }
  items: any;

  async ngOnInit() {


    this.participantList[1];

    this.items = [
      {label: 'Contactos'},
      {label: 'Nuevo'},
    ];
    this.home = {icon: 'pi pi-home'};

    this.userjson = await this.dbService.getUsersJson();


    var decoded: any = jwt_decode(this.authService.getToken());
    this.counselorName = decoded.fullname;
    this.userId = decoded.id;

    // console.log(this.userjson);

    this.userService.getParticipantsForCounselor(this.userId).subscribe(res=>{
      this.participantList = res.listado;
      console.log(this.participantList)
    });

    this.contactTypeService.getContactTypes().subscribe(res=>{
      this.contactTypeList = res.listado;
    });

    this.loadContactTypes();
    this.loadParticipants();    
  }


  loadContactTypes(){
    this.contactTypes = [];

    this.dbService.getContactType()
        .then((res: any) => {
          let preContacts: any[] = [];
          res.rows.forEach(element => {
            preContacts.push(element.doc);
          });
          this.contactTypes = preContacts;
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

  // onchangeParticipant(IdParticipant: number) {
  //   console.log(IdParticipant);
  //   this.contact.assignment.participant.firstName = `${this.participantList.find(x=>x.participantId == IdParticipant).firstName}`;
  //   console.log(this.contact.assignment.participant.firstName);
  // }
  // onchangeContact(contactTypeId: number) {
  //   console.log(contactTypeId);
  //   this.contact.contactType.description = `${this.contactTypeList.find(x=>x.contactTypeId == contactTypeId).description}`;
  //   console.log(this.contact.contactType.description)
  // }

  submit(){
    // this.dbService.addUSer(this.user);
    // this.user = new User();
    // this.messageService.add({key: 'tc', severity:'success', summary: 'Éxito', detail: 'Usuario agregado correctamente'});

    this.dbService.addContact(this.contact);
    this.contact = new Contact();
    this.messageService.add({key: 'tc', severity:'success', summary: 'Éxito', detail: 'Contacto agregado correctamente'});

  }


  submit10k(){
    // let requestArray: User2 = new User2();
    
    for(let i= 0; i < this.userjson.length ; i++){
      // requestArray.name = this.userjson[i].name;
      // requestArray.lastname = this.userjson[i].lastname;
      // requestArray.age = this.userjson[i].age;
      // requestArray.email = this.userjson[i].email;
      // this.dbService.addUserList(i);
      // console.log(i);
      this.dbService.addUserList(this.userjson[i]);
      // requestArray = new User2();

    }

    this.messageService.add({key: 'tc', severity:'success', summary: 'Éxito', detail: '10 mil Usuarios agregados correctamente'});


  }

}

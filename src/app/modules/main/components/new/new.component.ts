import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Counselor } from 'src/app/data/schemas/counselor/counselor.interface';
import { User } from 'src/app/data/schemas/user/user.interface';
import { DatabaseService } from 'src/app/services/database.service';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Contact } from 'src/app/data/schemas/contact/contact.interface';
import { Participant } from 'src/app/data/schemas/participant/participant.interface';
import { ContactType } from 'src/app/data/schemas/contactType/contactType.interface';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [
    MessageService
  ]
})
export class NewComponent implements OnInit {
  counselorList!: Counselor[];
  titleHtml: String = "Nuevo contacto";
  user: User = new User();
  contact: Contact = new Contact();
  arrayUser: User[] = [];
  
  counselorName!: string;
  userId!: number;
  home!: MenuItem; 

  isFieldValidParticipants: Boolean = false;
  isFieldValidFechaContacto: Boolean = false;
  isFieldValidTipoContacto: Boolean = false;
  isFieldValidHoraInicio: Boolean = false;
  isFieldValidHoraInicioMenor: Boolean = false;
  isFieldValidHoraFin: Boolean = false;
  isFieldValidDescripcion:  Boolean = false;

  //Select Html
  contactTypes!: ContactType[];
  participants!: Participant[];

  selectedParticipant!: string;
  selectedContactType!: string;

  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private messageService: MessageService,
    private authService: AuthService,
  ) { }
  
  iSubMenuHtml: any;

  async ngOnInit() {
    this.home = { icon: 'pi pi-home'  };
    this.iSubMenuHtml = [ { label: 'Contactos' }, { label: 'Nuevo' }, ];    
    //this.userjson = await this.dbService.getUsersJson();

    var decoded: any = jwt_decode(this.authService.getToken());
    this.counselorName = decoded.fullname;
    this.userId        = decoded.id;

    this.loadContactTypes();
    this.loadParticipants();  
    
    this.loadEdit();
  }
  loadContactTypes(){
    var decoded: any = jwt_decode(this.authService.getToken());
    this.userId = decoded.id;

    this.contactTypes = [];
    this.dbService
        .getContactType()
        .then((res: any) => {
          //console.log(" loadContactTypes()==> dbService.getContactType().Then");

          let preContacts: any[] = [];
          res.rows.forEach(element => {
            preContacts.push(element.doc);
          });
          this.contactTypes = preContacts;
          //console.log(" loadContactTypes()==> contactTypes");
          //console.log(this.contactTypes);
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
  submit(){
    if(this.isValForm()) 
    {
      console.log(this.contact.startDate);
      var decoded: any = jwt_decode(this.authService.getToken());
      this.userId = decoded.id;  
      let contactNew = new Contact();
      contactNew.contactId            = (this.contact.contactId !=null? this.contact.contactId : 0);
      contactNew.assignmentId         = this.contact.participant.assignmentId;
      contactNew.nameFullParticipante = this.contact.participant.fullName;
      contactNew.contactTypeId        = this.contact.contactType.contactTypeId;
      contactNew.nameFullContactType  = this.contact.contactType.description;    
      contactNew.description = this.contact.description;
      contactNew.createdOn   = new Date();
      contactNew.contactDate   = this.contact.contactDate;
      contactNew.startDate   = this.contact.startDate;
      contactNew.endDate     = this.contact.endDate; 
      contactNew.userAppID = this.userId;
      contactNew.isSincronizado = false;
      console.log(contactNew.startDate);

      if (localStorage.getItem('_dinamicUpdate')) {
        contactNew._id = localStorage.getItem('_dinamicUpdate') as string;  
        
        this.dbService.updContact(contactNew);
        this.contact = new Contact();
        this.messageService.add({key: 'tc', severity:'success', summary: 'Éxito', detail: 'Se actualizo correctamente el Contacto.'});
        localStorage.removeItem('_dinamicUpdate');
        this.router.navigate(['./contacts/list']);
      } 
      else { 
        console.log("Btn :: submit()--contact");  
        this.dbService.addContact(contactNew);
        this.contact = new Contact();
        this.messageService.add({key: 'tc', severity:'success', summary: 'Éxito', detail: 'Se agregó correctamente el Contacto.'});
        
      }
    }
    else{
      console.log("submit()--->Validate");
      this.messageService.add({key: 'tc', severity:'warn', summary: 'Validación', detail: 'Se requiere los campos obligatorios.'});
    }
  }
  onFocusCalendar(){
    let isHora = Date;
    return formatDate(isHora.now(), "shortTime",'en-US');
  }
  isValString(x: string | null) {
    if (x === null || x == null || x == ""|| x == undefined) {
      return false;
    }
    return true;
  }
  isValForm(){
    let isValidate = true;
    
    if(this.contact.participant == null){
     isValidate = false;
     this.isFieldValidParticipants = true;
    } else { this.isFieldValidParticipants = false; }
    
    if(this.contact.contactType == null)
    {
       isValidate = false;
       this.isFieldValidTipoContacto = true;
    } else { this.isFieldValidTipoContacto = false; }
    
    if(this.contact.contactDate == null)
    {
       isValidate = false;
       this.isFieldValidFechaContacto = true;
    } else { this.isFieldValidFechaContacto = false; }

    if(this.contact.startDate == null)
    {
       isValidate = false;
       this.isFieldValidHoraInicio = true;
    } else { this.isFieldValidHoraInicio = false; }

    if(this.contact.endDate == null)
    {
       isValidate = false;
       this.isFieldValidHoraFin = true;
    } else { this.isFieldValidHoraFin = false; }

    if(this.contact.startDate >= this.contact.endDate){
      isValidate = false;
      this.isFieldValidHoraInicioMenor = true;
    } else{this.isFieldValidHoraInicioMenor = false; }

    if(!this.isValString(this.contact.description))
    {
       isValidate = false;
       this.isFieldValidDescripcion = true;
    } else { this.isFieldValidDescripcion = false; }

    return isValidate;
  }

  
  loadEdit(){
    let isId = localStorage.getItem('_dinamicUpdate') as string; 
    if (localStorage.getItem('_dinamicUpdate')) {
      this.titleHtml = "Editar contacto";
      this.dbService
      .getRegistroTransaccion(isId)
      .then((res: any) => {
        this.contact.contactId   = res.contactId;
        this.contact.contactType = new ContactType();
        this.contact.contactType.contactTypeId = res.contactTypeId;
        this.contact.contactType.description = res.nameFullContactType;
        this.contact.participant = new Participant();
        this.contact.participant.assignmentId  = res.assignmentId;
        this.contact.participant.fullName  = res.nameFullParticipante;
        this.contact.description = res.description;
        this.contact.createdOn   = res.createdOn;
        this.contact.contactDate = res.contactDate;
        this.contact.startDate   = new Date(res.startDate);
        this.contact.endDate     = new Date(res.endDate);
      });
    } 
  } 
}

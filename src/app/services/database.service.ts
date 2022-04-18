import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PouchDb from 'pouchdb-browser';
import { User } from 'src/app/data/schemas/user/user.interface';
import { Contact } from '../data/schemas/contact/contact.interface';
import { Nutritionist } from '../data/schemas/nutritionist/nutritionist';
import { Participant } from '../data/schemas/participant/participant.interface';
import { User2 } from '../data/schemas/user/user2.interface';
import { ContactService } from './contact.service';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db: any;

  // Bases de datos Maestras (Cada que se inicia sesión)
  private dbParticipants: any;
  private dbContactTypes: any;
  private dbNutritionist: any;

  constructor(private http: HttpClient,private contactService: ContactService) {
    this.dbParticipants = new PouchDb('participants');
    this.dbContactTypes = new PouchDb('contactTypes');
    this.dbNutritionist = new PouchDb('nutritionist');
    this.db = new PouchDb('myLocalDB');
   }

   addUSer(newUser: User){
    this.db.post(newUser);
   }

  addUserList(user: User2){
    this.db.post(user);
  }


  addContact(newContact: Contact){
    this.db.post(newContact);
  }

   getUsers = () => new Promise( (resolve, reject) => {
     this.db.allDocs({
       include_docs: true,
       attachments: true
     }).then((result) => {
       resolve(result)
     }).catch((err) => {
      reject(null)
     });
   });


   getContacts = () => new Promise( (resolve, reject) => {
    this.db.allDocs({
      include_docs: true,
      attachments: true
    }).then((result) => {
      resolve(result)
    }).catch((err) => {
     reject(null)
    });
  });

  getContactType = () => new Promise( (resolve, reject) => {
    this.dbContactTypes.allDocs({
      include_docs: true,
      attachments: true
    }).then((result) => {
      resolve(result)
    }).catch((err) => {
     reject(null)
    });
  });

  getParticipants = () => new Promise( (resolve, reject) => {
    this.dbParticipants.allDocs({
      include_docs: true,
      attachments: true
    }).then((result) => {
      resolve(result)
    }).catch((err) => {
     reject(null)
    });
  });


  getNutritionist = () => new Promise( (resolve, reject) => {
    this.dbNutritionist.allDocs({
      include_docs: true,
      attachments: true
    }).then((result) => {
      resolve(result)
    }).catch((err) => {
     reject(null)
    });
  });




   
   addParticipantsForCounselor(participants: Participant){
    this.dbParticipants = new PouchDb('participants');

    this.dbParticipants.post(participants);
   }
   

   
  addContactTypes(contacts: Contact){
    this.dbContactTypes = new PouchDb('contactTypes');

    this.dbContactTypes.post(contacts);
  }

  addNutritionist(nutritionist: Nutritionist){
    this.dbNutritionist = new PouchDb('nutritionist');

    this.dbNutritionist.post(nutritionist);
  }


  destroy(){
    this.dbContactTypes.destroy();
    this.dbParticipants.destroy();
    this.dbNutritionist.destroy();
  }


   getUsersJson() {
    return this.http.get<any>('assets/data.json')
    .toPromise()
    .then(res => <any[]>res.usuarios)
    .then(data => { return data; });
  }
}

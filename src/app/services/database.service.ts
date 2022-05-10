import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PouchDb from 'pouchdb-browser';
import { stringify } from 'querystring';
import { User } from 'src/app/data/schemas/user/user.interface';
import { Contact } from '../data/schemas/contact/contact.interface';
import { ContactType } from '../data/schemas/contactType/contactType.interface';
import { Nutritionist } from '../data/schemas/nutritionist/nutritionist';
import { Participant } from '../data/schemas/participant/participant.interface';
import { User2 } from '../data/schemas/user/user2.interface';
import { ContactService } from './contact.service';
import { Referred } from '../data/schemas/referred/referred.interface';
import { SincronizarRequest } from "src/app/data/schemas/sincronizar/sincronizar.interface";
import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private dbTransaction: any;
  private dbReferral: any;
  // Bases de datos Maestras (Cada que se inicia sesión)
  private dbParticipants: any;
  private dbContactTypes: any;
  private dbNutritionist: any;

  constructor(private http: HttpClient,private contactService: ContactService) {
    this.dbParticipants = new PouchDb('TempParticipants');
    this.dbContactTypes = new PouchDb('TempContactTypes');
    this.dbNutritionist = new PouchDb('TempNutritionist');
    this.dbTransaction  = new PouchDb('TempTransactios');
    this.dbReferral     = new PouchDb('TempReferral');
   }

  addUSer(newUser: User){
    this.dbTransaction.post(newUser);
  }
  addUserList(user: User2){
    this.dbTransaction.post(user);
  }
  
  getUsers = () => new Promise( (resolve, reject) => {
    console.log("DatabaseService ==> getUsers()");
    if (this.dbTransaction != null){
      this.dbTransaction
          .allDocs({ include_docs: true, attachments: true })
          .then((result) => { resolve(result) })
          .catch((err)   => { reject(null) });
    }
  });

  getContacts = () => new Promise( (resolve, reject) => {
    console.log("DatabaseService ==> getContacts()");
    if (this.dbTransaction != null){
      this.dbTransaction
          .allDocs({ include_docs: true, attachments: true })
          .then((result) => { resolve(result) })
          .catch((err)   => { reject(null) });
    }
  });

  getSincronizarCount = (userId: number) => new Promise( (resolve, reject) => {
    //console.log("DatabaseService ==> getSincronizarCount()");
    
    let x = this.dbTransaction
          .allDocs({ include_docs: true, attachments: true, descending: true })
          .catch((err)   => { reject(null) })
          .then((result) => { 
              let isRowsTotal = 0;
              result.rows.forEach(element => 
                {
                  if(element.doc.userAppID == userId &&
                     element.doc.isSincronizado == false)
                  {
                    isRowsTotal++;
                  }            
                });            
            return isRowsTotal; 
          });
    let y = this.dbReferral
          .allDocs({ include_docs: true, attachments: true, descending: true })
          .catch((err)   => { reject(null) })
          .then((result) => { 
            let isRowsTotal = 0;
            result.rows.forEach(element => 
              {
                if(element.doc.userAppID == userId &&
                   element.doc.isSincronizado == false)
                {
                  isRowsTotal++;
                }            
              });            
          return isRowsTotal; 
        });
    
    Promise.all([x, y]).then((response) => {
      let iRetorno = {
        'iContactCount' : response[0],
        'iReferralCount': response[1]
      }
      //console.log("DatabaseService ==> getSincronizarCount() ==> ");
      //console.log(iRetorno);
      resolve(iRetorno);
    });        
  });
  getSincronizarList = (userId: number) => new Promise( (resolve, reject) => {
    //console.log("DatabaseService ==> getSincronizarList()");    
    let x = this.dbTransaction
          .allDocs({ include_docs: true, attachments: true, descending: true })
          .catch((err)   => { reject(null) })
          .then((result) => { 
            let listContact: Contact[] | any = [];
            result.rows.forEach(element => 
              {
                if(element.doc.userAppID == userId &&
                   element.doc.isSincronizado == false)
                {
                  let contactNew = new Contact();
                  contactNew.contactId            = (element.doc.contactId !=null? element.doc.contactId : 0);
                  contactNew.assignmentId         = element.doc.assignmentId;
                  contactNew.nameFullParticipante = element.doc.nameFullParticipante;
                  contactNew.contactTypeId        = element.doc.contactTypeId;
                  contactNew.nameFullContactType  = element.doc.nameFullContactType;    
                  contactNew.description          = element.doc.description;
                  contactNew.createdOn            = element.doc.createdOn;
                  contactNew.startDate            = element.doc.startDate;
                  contactNew.endDate              = element.doc.endDate;                    
                  contactNew.userAppID            = element.doc.userAppID;
                  contactNew.isSincronizado       = element.doc.isSincronizado;
                  contactNew._id                  = element.doc._id;
                  contactNew._rev                 = element.doc._rev;
                  listContact.push(contactNew);
                }            
              });            
            return listContact; 
          });
    let y = this.dbReferral
          .allDocs({ include_docs: true, attachments: true, descending: true })
          .catch((err)   => { reject(null) })
          .then((result) => { 
            let listReferred: Referred[] | any = [];
            result.rows.forEach(element => 
              {
                if(element.doc.userAppID == userId &&
                   element.doc.isSincronizado == false)
                {
                  let referredNew = new Referred();
                  referredNew.nutritionistId = element.doc.nutritionistId;
                  referredNew.participantId  = element.doc.participantId; 
                  referredNew.assignmentId   = element.doc.assignmentId;
                  referredNew.description    = element.doc.description; 
                  
                  referredNew.userAppID      = element.doc.userAppID;
                  referredNew.isSincronizado = element.doc.isSincronizado;
                  referredNew._id            = element.doc._id;
                  listReferred.push(referredNew);
                }            
              });            
          return listReferred; 
        });
    
    Promise.all([x, y]).then((response) => {
      let sincronizarRequest = new SincronizarRequest();
      sincronizarRequest.userId = userId;
      sincronizarRequest.listContacts = response[0];
      sincronizarRequest.listReferreds = response[1];
      resolve(sincronizarRequest);
    });        
  });

  getContactType = () => new Promise( (resolve, reject) => {
    console.log("DatabaseService ==> getContactType()");
    if (this.dbContactTypes != null){
      this.dbContactTypes
          .allDocs({ include_docs: true, attachments: true })
          .then((result) => { resolve(result) })
          .catch((err)   => { reject(null) });
    }    
  });

  getParticipants = () => new Promise( (resolve, reject) => {
    console.log("DatabaseService ==> getParticipants()");
    if (this.dbParticipants != null){
      this.dbParticipants
          .allDocs({ include_docs: true, attachments: true })
          .then((result) => { resolve(result) })
          .catch((err)   => { reject(null) });
    }
  });

  getNutritionist = () => new Promise( (resolve, reject) => {
    console.log("DatabaseService ==> getNutritionist()");
    if (this.dbNutritionist != null){
      this.dbNutritionist
          .allDocs({ include_docs: true, attachments: true })
          .then((result) => { resolve(result) })
          .catch((err)   => { reject(null) });
    }
  });
  
  getReferral = () => new Promise( (resolve, reject) => {
    console.log("DatabaseService ==> getReferral()");
    if (this.dbReferral != null){
      this.dbReferral
          .allDocs({ include_docs: true, attachments: true })
          .then((result) => { resolve(result) })
          .catch((err)   => { reject(null) });
    }
  });
  
  addParticipantsForCounselor(participants: Participant){
    this.dbParticipants.post(participants);
  }   
  
  addContactTypes(contactType: ContactType){ 
    this.dbContactTypes.post(contactType);
  }
  
  addNutritionist(nutritionist: Nutritionist){
    this.dbNutritionist.post(nutritionist);
  }
  
  addReferral(newReferred: Referred){
    this.dbReferral.post(newReferred);
  }
  
  addContact(newContact: Contact){
    this.dbTransaction.post(newContact);
  }
  
  createBd() {
    this.dbParticipants = new PouchDb('TempParticipants');
    this.dbContactTypes = new PouchDb('TempContactTypes');
    this.dbNutritionist = new PouchDb('TempNutritionist');
    this.dbTransaction  = new PouchDb('TempTransactios');
    this.dbReferral     = new PouchDb('TempReferral');
  }
  
  destroy(){
    //this.dbContactTypes.destroy();
    //this.dbParticipants.destroy();
    //this.dbNutritionist.destroy();
  }
  
  updContact(newContact: Contact){
    let _dbTransaction  = new PouchDb('TempTransactios');    
    _dbTransaction.get(newContact._id)
      .then(function(doc) {
        //console.log("updContact()--> ----------------------------------");
        newContact._rev = doc._rev
        return _dbTransaction.put(newContact, { force: true });
      })     
      .catch(function (err) {
        console.log(err);
      });
  }
  
  updEstadoSincronizacionTransaccion(_id:string, _contactoId:Number){
    let _dbTransaction  = new PouchDb('TempTransactios');    
    
    _dbTransaction.get(_id)
      .then(function(doc) {
        //console.log("updEstadoSincronizacionTransaccion()--> _id      = " + _id);
        //console.log("updEstadoSincronizacionTransaccion()--> doc._id  = " + doc._id);
        //console.log("updEstadoSincronizacionTransaccion()--> doc._rev = " + doc._rev);
         
        return _dbTransaction.put({ 
          _id: doc._id, _rev: doc._rev, 
          isSincronizado: true,          
          contactId: _contactoId,
          assignmentId: doc["assignmentId"],
          nameFullParticipante: doc["nameFullParticipante"],
          contactTypeId: doc["contactTypeId"],
          nameFullContactType: doc["nameFullContactType"],
          description: doc["description"],
          createdOn: doc["createdOn"],
          startDate: doc["startDate"],
          endDate: doc["endDate"],
          userAppID: doc["userAppID"]
        }, { force: true });
      })     
      .catch(function (err) {
        console.log(err);
      });
  }
  
  delRegistroTransaccion(_id:string){
    let _dbTransaction  = new PouchDb('TempTransactios');    
    _dbTransaction.get(_id)
      .then(function(doc) {
        var isResultado = _dbTransaction.remove(doc._id, doc._rev);
        return isResultado;
      })     
      .catch(function (err) {
        console.log(err);
      });
  }
  
  delRegistroReferral(_id:string){
    let _dbReferral  = new PouchDb('TempReferral');    
    _dbReferral.get(_id)
      .then(function(doc) {
        var isResultado = _dbReferral.remove(doc._id, doc._rev);
        return isResultado;
      })   
      .catch(function (err) {
        console.log(err);
      });
  }

  getRegistroTransaccion = (_id:string) => new Promise((resolve, reject) => 
  {
    console.log("DatabaseService ==> getRegistroTransaccion()");
    let _dbTransaction  = new PouchDb('TempTransactios'); 
    if(_dbTransaction != null)
    {
      _dbTransaction
        .get(_id)
        .then(function(doc) { 
          let contactNew = new Contact();
          contactNew.contactId            = doc["contactId"];
          contactNew.assignmentId         = doc["assignmentId"];
          contactNew.nameFullParticipante = doc["nameFullParticipante"];
          contactNew.contactTypeId        = doc["contactTypeId"];
          contactNew.nameFullContactType  = doc["nameFullContactType"];    
          contactNew.description          = doc["description"];
          contactNew.createdOn            = doc["createdOn"];
          contactNew.startDate            = doc["startDate"];
          contactNew.endDate              = doc["endDate"];                    
          contactNew.userAppID            = doc["userAppID"];
          contactNew.isSincronizado       = doc["isSincronizado"];
          contactNew._id                  = doc._id;

          console.log("DatabaseService ==> getRegistroTransaccion():: resolve");
          return resolve(contactNew);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  });

  getUsersJson() {
    return this.http.get<any>('assets/data.json')
    .toPromise()
    .then(res => <any[]>res.usuarios)
    .then(data => { return data; });
  }
}

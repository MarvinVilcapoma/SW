import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { resourceUsage } from 'process';
import { Contact } from 'src/app/data/schemas/contact/contact.interface';
import { User } from 'src/app/data/schemas/user/user.interface';
import { ConnectionService } from 'src/app/services/connection.service';
import { ContactService } from 'src/app/services/contact.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers:[
    MessageService
  ]
})
export class IndexComponent implements OnInit {

  contacts: any;

  constructor( 
    private router: Router,
    private dbService: DatabaseService,
    private contactService: ContactService,
    private messageService: MessageService
    ){ 
  }

  menuItems! : MenuItem[];


  items!: MenuItem[];
  
  ngOnInit() {
    

    this.menuItems = [
      {
        label: 'Listado',
        icon:'pi pi-fw pi-list',
        routerLink: '/contacts/list',
        command: () => {
          // this.activeItem = this.items[1]; 
        }
      },
      {
        label: 'Nuevo',
        icon:'pi pi-fw pi-plus',
        routerLink: '/contacts/new',
        command: () => {
          // this.activeItem = this.items[0]; 
        }
      },
      {
        label: 'Referir a Nutricionista',
        icon: 'pi pi-fw pi-user',
        routerLink: '/contacts/referred',
        command: ()=>{
          // this.activeItem = this.items[0]; 
        }
      }
      
    ]

      // this.activeItem = this.items[0];
  }
  
  syncContacts(){
    this.contacts = [];
    this.dbService.getContacts().then((res: any) => {
      let preContacts: any[] = [];
      res.rows.forEach(element => {
        preContacts.push(element.doc);
      });
      this.contacts = preContacts;

      // console.log(this.users);
       console.log(this.contacts);

       let newContact = new Contact();

       for(let i=0; i < this.contacts.length; i++){
         newContact.assignmentId = this.contacts[i].assignment.assignmentId;
         newContact.contactTypeId = this.contacts[i].contactType.contactTypeId;
         newContact.description = this.contacts[i].description;
         newContact.createdOn = this.contacts[i].createdOn;
         newContact.startDate = this.contacts[i].startDate;
         newContact.endDate = this.contacts[i].endDate;
         this.contactService.Insert(newContact).subscribe((resultado=>{
           console.log(resultado);
         }));

         newContact = new Contact();
       }


    });
    // this.contactService.Insert(newContat).subscribe((res=>{
    //   console.log(res);
    //   if(res.code == 0){
    //     this.messageService.add({key: 'tc', severity:'success', summary: 'Éxito', detail: 'Sincronizado correctamente'});
    //   }else{
    //     this.messageService.add({key: 'tc', severity:'warn', summary: 'Éxito', detail: 'La sincronización ha fallado'});
    //   }
    // }));
 }


  

  // sync(){
  //   setTimeout(() => {
  //     this.messageService.add({key: 'tc', severity:'success', summary: 'Éxito', detail: 'Sincronizado correctamente'});
  //   }, 1000);
  // }

}

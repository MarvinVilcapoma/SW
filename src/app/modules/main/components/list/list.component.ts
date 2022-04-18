import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [
    MessageService
  ]
})
export class ListComponent implements OnInit {

  users!: any[];
  contacts!: any[];
  constructor(
    private dbService: DatabaseService,
    private messageService: MessageService,
  ) { }

  items: any;
  home!: MenuItem; 

  ngOnInit(): void {
    this.items = [
      {label: 'Contactos'},
      {label: 'Listado'},
    ];

    this.home = {icon: 'pi pi-home'};
    // this.loadUserTable();
    this.loadContactsTable();

  } 

  loadUserTable(){
    this.users = [];

    this.dbService.getUsers()
        .then((res: any) => {
          let preUsers: any[] = [];
          res.rows.forEach(element => {
            preUsers.push(element.doc);
          });
          this.users = preUsers;

          // console.log(this.users);
        });
  } 


  loadContactsTable(){
    this.contacts = [];

    this.dbService.getContacts()
        .then((res: any) => {
          let preContacts: any[] = [];
          res.rows.forEach(element => {
            preContacts.push(element.doc);
          });
          this.contacts = preContacts;

          // console.log(this.users);
        });



  } 

}

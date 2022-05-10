import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api'; 
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Contact } from 'src/app/data/schemas/contact/contact.interface';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [
    MessageService, ConfirmationService
  ]
})
export class ListComponent implements OnInit {

  users!: any[];
  contacts!: Contact[];
  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private messageService: MessageService, 
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  iSubMenuHtml: any;
  home!: MenuItem; 
  userId!: number;
  display: boolean = false;
  modalDescription!: String;

  ngOnInit(): void {
    this.iSubMenuHtml = [ {label: 'Contactos'}, {label: 'Listado'} ];
    this.home = {icon: 'pi pi-home'};
    this.loadContactsTable();
    localStorage.removeItem('_dinamicUpdate');
  } 

  clickDelete(tempValor:Contact) {
    this.confirmationService.confirm({
        message: '¿Desea eliminar el registro seleccionado?',
        header: 'WIC',
        icon: 'pi pi-info-circle',
        acceptLabel: "SI",
        accept: () => {
          //console.log("clickDelete:: OK ---------");
          //console.log(tempValor);
          let isEliminado = this.dbService.delRegistroTransaccion(tempValor._id);
          //console.log("clickDelete:: OK Respt---------");
          //console.log(isEliminado);
          setTimeout(()=>{
            this.loadContactsTable(); 
          },1000);                  
        },
        rejectLabel: "NO",
        reject: () => {
          //console.log("clickDelete:: NOT ---------");
        },
        defaultFocus: "reject"
    });
  }
  clickView(tempDescription:String){ 
    this.modalDescription = tempDescription;
    this.display = true;
  }
  clickEditar(tempValor:Contact){
      localStorage.setItem('_dinamicUpdate', tempValor._id);
      this.router.navigate(['./contacts/new']);
  }
  loadContactsTable(){
    console.log("View-List::Load-loadContactsTable()");

    var decoded: any = jwt_decode(this.authService.getToken());
    this.userId = decoded.id;
    this.contacts = [];
    this.dbService.getContacts()
        .then((res: any) => 
        {
          let preContacts: any[] = [];
          res.rows.forEach(element => 
            {
              if(this.userId == element.doc.userAppID)
              {
                preContacts.push(element.doc);
              }              
            });
          this.contacts = preContacts;
          //console.log(this.contacts);
        });      
  } 
}

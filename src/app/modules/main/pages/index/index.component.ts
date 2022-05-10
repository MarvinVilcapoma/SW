import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { resourceUsage } from 'process';
import { SincronizarRequest, SincronizarResponse } from "src/app/data/schemas/sincronizar/sincronizar.interface";
import { ContactService } from 'src/app/services/contact.service';
import { DatabaseService } from 'src/app/services/database.service';
import {ConfirmationService} from 'primeng/api';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ConnectionService } from 'ngx-connection-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers:[
    MessageService, ConfirmationService
  ]
})
export class IndexComponent implements OnInit {
  contacts: any;
  hasNetworkConnection!: boolean;
  hasInternetAccess!: boolean;
  statusConnection!: string;

  constructor( 
    private router: Router,
    private dbService: DatabaseService,
    private contactService: ContactService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
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

      if (this.hasNetworkConnection) {
        this.statusConnection = 'ONLINE';
      } else {
        this.statusConnection = 'OFFLINE';
      }
      console.log("hasNetworkConnection => " + this.hasNetworkConnection);
      console.log("hasInternetAccess => " + this.hasInternetAccess);
      console.log("statusConnection => " + this.statusConnection);
    });
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
    
    this.syncContacts(false);
  }
  
  syncContacts(Opt:boolean) {
    if (this.hasNetworkConnection)
    {
      var decoded: any = jwt_decode(this.authService.getToken());
      let isSincronizar: Boolean = false;
      let oMensaje:string = "<b>¿Desea sincronizar la información registrada?</b>";
      this.dbService.getSincronizarCount(Number(decoded.id))
          .then((res: any) => 
          {
            //console.log("getSincronizarCount() =>");
            //console.log(res);
            if(res.iContactCount > 0){ 
              oMensaje += "</br> - Cantidad de contacto a sincronizar : <b>" + res.iContactCount + "</b>";
              isSincronizar = true;
            }
            if(res.iReferralCount > 0){ 
              oMensaje += "</br> - Cantidad de referencias a sincronizar : <b>" + res.iReferralCount + "</b>";
              isSincronizar = true;
            }
        
            if(isSincronizar)
            {
              this.confirmationService.confirm({
                message: oMensaje,
                header: 'WIC',
                icon: 'pi pi-info-circle',
                acceptLabel: "SI",
                accept: () => {
                  console.log("syncContacts:: OK ---------");
                  
                  this.dbService.getSincronizarList(Number(decoded.id))
                  .then((res: any) =>
                  {
                    console.log(res);                  
                    let sincronizarRequest = new SincronizarRequest();
                    sincronizarRequest.userId = Number(decoded.id);
                    sincronizarRequest.listContacts = res.listContacts;
                    sincronizarRequest.listReferreds = res.listReferreds;

                    this.contactService.Sincronizar(sincronizarRequest).subscribe((respt =>{
                      console.log("Respuesta i: this.contactService.Sincronizar --->");
                      console.log(respt);
                      console.log("Respuesta f: this.contactService.Sincronizar --->");

                      if(respt.code == 0){
                        this.messageService.add({ key: 'tc', severity:'success', summary: 'WIC', detail: 'Sincronizado correctamente'});
                        if(respt.listado != null) {
                          respt.listado.forEach(element => 
                            {
                              this.dbService.updEstadoSincronizacionTransaccion(element["_id"], element["contactId"]);   
                            }); 
                        }

                        if(sincronizarRequest.listReferreds != null) {
                          sincronizarRequest.listReferreds.forEach(element => 
                            {
                              this.dbService.delRegistroReferral(element._id);   
                            }); 
                        }
                        
                        setTimeout(()=> {                          
                          localStorage.removeItem('_dinamicUpdate');
                          window.location.reload();
                        }, 1000); 
                      }
                      else{
                        this.messageService.add({key: 'tc', severity:'warn', summary: 'WIC', detail: 'La sincronización ha fallado'});
                      }
                    }));
                  });  
                },
                rejectLabel: "NO",
                reject: () => { },
                defaultFocus: "reject"
              });
            }
            else 
            {
              if(Opt) {
                this.messageService.add({key: 'tc', severity:'warn', summary: 'WIC', 
                detail: 'No hay registros para sincronizar.'});
              }            
            }
          }); 
    }
    else {
      this.messageService.add({key: 'tc', severity:'warn', summary: 'WIC', 
                               detail: 'Verifique su conexión a internet para poder sincronizar.'});
    }
 }
}

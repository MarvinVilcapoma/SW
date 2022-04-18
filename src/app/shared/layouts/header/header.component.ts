import { Component, OnInit } from '@angular/core'; 
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../modules/auth/services/auth.service';
import { Router } from '@angular/router';
import PouchDb from 'pouchdb-browser';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  
})
export class HeaderComponent implements OnInit{

  items: MenuItem[] = [];
  fullname!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private databaseService: DatabaseService,
  ){ 
    
  }

  ngOnInit(): void {

    this.fullname = this.authService.getUser()['fullname']; 

    this.items = [
      {
        label: `${this.fullname}`,
        icon: 'pi pi-user'
      },
      {
        label: 'Contactos',
        icon: 'pi pi-fw pi-clock',
        routerLink: '/contacts',
        command: () => {
            this.router.navigateByUrl(this.router.url);
        },
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-fw pi-list',
            routerLink: '/contacts/list',
          },
          {
            label: 'Nuevo',
            icon: 'pi pi-fw pi-plus',
            routerLink: '/contacts/new',
          },
          {
            label: 'Referir a Nutricionista',
            icon:'pi pi-fw pi-user',
            routerLink: '/contacts/referred',
          }
        ]
      },
      
      
  ];
  }

  logout(){
    this.databaseService.destroy();
    this.authService.logOut();
  }

}

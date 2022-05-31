import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConnectionService } from 'src/app/services/connection.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss'],
})
export class ConnectionStatusComponent implements OnInit {

  status!: boolean; 

  constructor(
    private cs: ConnectionService, 
    public router: Router
    ) { }

  ngOnInit(): void { 
    this.cs.test()
       .subscribe(
         res => { this.status = true; },
         err => {  this.status = false; }
       ) 
  }

}

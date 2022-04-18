import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionStatusComponent } from './components/connection-status/connection-status.component';
import { HeaderComponent } from './layouts/header/header.component';
import { PrimengModule } from './modules/primeng.module';



@NgModule({
  declarations: [
    HeaderComponent,
    ConnectionStatusComponent
  ],
  imports: [
    PrimengModule,
    CommonModule
  ],
  exports: [
    ConnectionStatusComponent
  ]
})
export class SharedModule { }

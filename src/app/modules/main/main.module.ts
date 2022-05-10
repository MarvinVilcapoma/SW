import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { PrimengModule } from 'src/app/shared/modules/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListComponent } from './components/list/list.component';
import { NewComponent } from './components/new/new.component';
import { ReferredComponent } from './components/referred/referred.component';
 
@NgModule({
  declarations: [
    IndexComponent,
    ListComponent,
    NewComponent,
    ReferredComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PrimengModule,
    SharedModule,
    
  ]
})
export class MainModule { }

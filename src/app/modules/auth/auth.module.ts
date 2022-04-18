import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { PrimengModule } from 'src/app/shared/modules/primeng.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    PrimengModule,
    SharedModule
  ]
})
export class AuthModule { }

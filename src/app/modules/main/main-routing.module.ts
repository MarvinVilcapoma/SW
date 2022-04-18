import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateTokenGuard } from 'src/app/secure/guards/validate-token.guard';
import { IndexComponent } from './pages/index/index.component';
import { NewComponent } from './components/new/new.component';
import { ListComponent } from './components/list/list.component';
import { ReferredComponent } from './components/referred/referred.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    canLoad: [ValidateTokenGuard], 
    canActivate: [ValidateTokenGuard],
    children: [
      {
        path: 'new',
        component: NewComponent,
        canLoad: [ValidateTokenGuard], 
        canActivate: [ValidateTokenGuard],
      },
      {
        path: 'list',
        component: ListComponent,
        canLoad: [ValidateTokenGuard], 
        canActivate: [ValidateTokenGuard],
      },
      {
        path: 'referred',
        component: ReferredComponent,
        canLoad: [ValidateTokenGuard], 
        canActivate: [ValidateTokenGuard],
      },
      {
        path: '**',
        redirectTo: 'list' 
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'contacts' 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

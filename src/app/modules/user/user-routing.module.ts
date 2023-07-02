import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: "admin", pathMatch: 'full' },
  { path: 'common', loadChildren: () => import('./all-common/all-common.module').then(m => m.AllCommonModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'admin1', loadChildren: () => import('./admin1/admin1.module').then(m => m.Admin1Module) },
  { path: 'admin2', loadChildren: () => import('./admin2/admin2.module').then(m => m.Admin2Module) },
  { path: 'internal_user', loadChildren: () => import('./internal-user/internal-user.module').then(m => m.InternalUserModule) },
  { path: 'external_client', loadChildren: () => import('./external-client/external-client.module').then(m => m.ExternalClientModule) },
  { path: 'external_user', loadChildren: () => import('./external-user/external-user.module').then(m => m.ExternalUserModule) },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

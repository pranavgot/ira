import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DefaultComponent } from '../app/shared/components/layout/default/default.component';
import { MsalGuard } from '@azure/msal-angular';
import { BrowserUtils } from '@azure/msal-browser';
import { AuthLoginComponent } from './shared/components/auth-login/auth-login.component';
import { PowerBIEmbedComponent } from 'powerbi-client-angular/components/powerbi-embed/powerbi-embed.component';
import { PowerbiReportComponent } from './shared/components/powerbi-report/powerbi-report.component';

const routes: Routes = [
  { path: '', redirectTo: "auth", pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '', component: DefaultComponent, 
    canActivate: [MsalGuard],
    children: [
      { path: 'user', loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) },
    ]
  },
  {
    path: 'powerbireport', component: PowerbiReportComponent,
    canActivate: [MsalGuard],
  }
  // { path: 'ad-login', component: AuthLoginComponent}
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes,
  //   {
  //   // Don't perform initial navigation in iframes or popups
  //  initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
  // }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import {MatSelectModule} from '@angular/material/select';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthGuard } from './core/guards/auth.guard';
import { ToastComponent } from './modules/user/all-common/toast/toast.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './core/services/loader.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';
import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalRedirectComponent,
} from '@azure/msal-angular';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ErrorIntercept } from './interceptor/error.interceptor';
import { LoaderInterceptor } from './interceptor/loader.interceptor';
import { LogInterceptor } from './interceptor/log.interceptor';
import { AuthLoginComponent } from './shared/components/auth-login/auth-login.component';
import { MatIconModule } from '@angular/material/icon';
import { DilogPopupComponent } from './shared/components/dilog-popup/dilog-popup.component';
import { PowerbiReportComponent } from './shared/components/powerbi-report/powerbi-report.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
const uri=`${environment.redirect_URL}/user`
@NgModule({
  declarations: [AppComponent, LoaderComponent, DilogPopupComponent, PowerbiReportComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    MatMenuModule,
    MatIconModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: '84ef5c2d-0f08-4914-8e5e-7b1047a5dc68',
        authority: 'https://login.microsoftonline.com/32bc7af4-cc70-4aaa-b2bb-01cedf479aae',
        redirectUri: uri,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      }
    }), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: ['user.read']
        }
    }, {
      interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
      protectedResourceMap: new Map([ 
          ['https://graph.microsoft-ppe.com/v1.0/me', ['user.read']],
          [`${environment.devUrl}/ria/userManagement/login`, [
            'api://84ef5c2d-0f08-4914-8e5e-7b1047a5dc68/auth',
          ]]
      ])
    }),
    HttpClientModule,
    PowerBIEmbedModule,
    NgApexchartsModule,
    // LoaderComponent,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),

    // NgbModule
  ],
  exports: [],
  providers: [
    ToastComponent,
    AuthGuard,
    DatePipe,
    LoaderService,
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    // { provide: HTTP_INTERCEPTORS, useClass: LogInterceptor, multi: true },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoaderInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ErrorIntercept,
    //   multi: true,
    // },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: MsalInterceptor,
    //   multi: true,
    // },
    // {
    //   provide: MSAL_INSTANCE,
    //   useFactory: MSALInstanceFactory,
    // },
    // {
    //   provide: MSAL_GUARD_CONFIG,
    //   useFactory: MSALGuardConfigFactory,
    // },
    // {
    //   provide: MSAL_INTERCEPTOR_CONFIG,
    //   useFactory: MSALInterceptorConfigFactory,
    // },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent,MsalRedirectComponent],
  // MsalRedirectComponent
  // AuthLoginComponent
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule {}


// export function loggerCallback(logLevel: LogLevel, message: string) {
//   console.log(message);
// }

// export function MSALInstanceFactory(): IPublicClientApplication {
//   // const apiURL = environment.SITE_URL;
//   return new PublicClientApplication({
//     auth: {
//       // clientId: '6226576d-37e9-49eb-b201-ec1eeb0029b6', // Prod enviroment. Uncomment to use.
//       clientId: '84ef5c2d-0f08-4914-8e5e-7b1047a5dc68', // PPE testing environment
//       // authority: 'https://login.microsoftonline.com/common', // Prod environment. Uncomment to use.
//       authority:
//         'https://login.microsoftonline.com/32bc7af4-cc70-4aaa-b2bb-01cedf479aae', // PPE testing environment.
//       redirectUri: environment.adUrl + `/user`,
//       // postLogoutRedirectUri: environment.adUrl+`/user`,
//       // postLogoutRedirectUri: `${apiURL}`,
//       // "TenantId": "32bc7af4-cc70-4aaa-b2bb-01cedf479aae", // Tenant Id configured in Azure
//     },
//     cache: {
//       cacheLocation: BrowserCacheLocation.LocalStorage,
//     },
//     system: {
//       loggerOptions: {
//         loggerCallback,
//         logLevel: LogLevel.Info,
//         piiLoggingEnabled: false,
//       },
//     },
//   });
// }

// export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
//   // console.log('122');

//   const protectedResourceMap = new Map<string, Array<string>>();
//   // protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']); // Prod environment. Uncomment to use.
//   protectedResourceMap.set('https://graph.microsoft-ppe.com/v1.0/me', [
//     'user.read',
//   ]);
//   // console.log('hi',protectedResourceMap);

//   protectedResourceMap.set(`${environment.devUrl}/ria/userManagement/login`, [
//     'api://84ef5c2d-0f08-4914-8e5e-7b1047a5dc68/auth',
//   ]);
//   return {
//     interactionType: InteractionType.Redirect,
//     protectedResourceMap,
//   };
// }

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },
    loginFailedRoute: '/login',
  };
}

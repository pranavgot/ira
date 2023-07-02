import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalService,
  MsalBroadcastService,
} from '@azure/msal-angular';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { filter, takeUntil } from 'rxjs/operators';
import {
  AuthenticationResult,
  InteractionStatus,
  PopupRequest,
  RedirectRequest,
  EventMessage,
  EventType,
} from '@azure/msal-browser';
import { forkJoin, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  process: any;
  usersData: any;
  solutionDescriptionList: any = [];
  pLoad: any;
  loading = false;
  descriptionLoading = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private UserService: UsersService,
    private router: Router,
    private master: MastersService,
    private _sanitizer: DomSanitizer,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    
    this.isIframe = window !== window.parent && !window.opener; 
    
    localStorage?.clear();
    
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.SSO_SILENT_SUCCESS
        )
      )
      .subscribe(
        (result: EventMessage) => {
          console.log(result);
          const payload = result.payload as AuthenticationResult;
          console.log(payload);
          if (payload.account != undefined) {
            this.pLoad = payload;
            localStorage.setItem('userr', JSON.stringify(payload));
            localStorage.setItem('account', JSON.stringify(payload.account));
            console.log('hi', payload.accessToken);
            this.login(payload.accessToken);
            this.authService.instance.setActiveAccount(payload.account);
          }
          console.log(this.authService.instance.getActiveAccount()?.username);
        },
        (err: any) => {
          console.log(err);
        }
      );
    
    this.getProcessAndUserDetails();
  }

  login(pl: any) {
    // console.log(this.getName());
    console.log(pl);
    if(pl){

      this.UserService.userManagementLogin(pl).subscribe(
        (res: any) => {
          if (res) {
            console.log(res);
            localStorage.setItem('userInfo', JSON.stringify(res));
            this.UserService.userInfo = res;
             switch (res.roleName) {
              case 'Level 1-Admin':
                this.router.navigateByUrl('/user/admin1');
                break;
              case 'Level 2-Admin':
                this.router.navigateByUrl('/user/admin2');
                break;
              case 'External User':
                this.router.navigateByUrl('/user/external_user');
                break;
              case 'Internal User' :  
               this.router.navigateByUrl('/user/internal_user');

              // default:
              //     this.router.navigateByUrl('/user/external_user')
             }
            // this.router.navigateByUrl('/user');
          }
  
          // return res;
        },
        (err: any) => {
          
            if(err.error?.statusMessage?.trim()?.toLowerCase() == "user is not registered" 
               && this.pLoad?.account?.username?.split('@')?.[1]?.trim()?.toLowerCase() == 'ibridgets.com')
             this.router.navigateByUrl('/user/internal_user/access');
        }
      );
    }

    // return this.http.get('https://graph.microsoft-ppe.com/v1.0/me')
  }
  getName(): any {
    
    return this.authService.instance.getActiveAccount()?.username;
    // if (this.authService.instance.getActiveAccount() == null) {
    //   return 'unknown';
    // }

    // return this.authService.instance.getActiveAccount()?.name;
  }
  setLoginDisplay = async () => {
    // setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    // if (this.loginDisplay) this.login();
  };
  checkAndSetActiveAccount() {
   
    const activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      const accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  async loginRedirect() {
    // this.authService.loginRedirect();

    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
   
  }

  goExplore() {}
 
  getProcessAndUserDetails() {
    this.process= [];
    this.usersData= [];
    this.loading = true;
    let tempUserData: any = []; 
    let tempProccessData: any = [];    
    let solutionDescriptionList = [];
    forkJoin([this.master.getAllProcessBasedPublishedAndFeatureList(2),this.usersService.getAllorgDetails()])?.subscribe((res: any) => {
    if(res.length) {
      res[0].responseData?.forEach?.((solution:any,index:number) => {
        solution.image = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+solution.imageUrl);
        tempProccessData?.push(solution);
        this.solutionDescriptionList?.push(solution);
        this.process?.push(solution);
        
      });
      res[1].responseData?.forEach((user: any,index: number) =>{
       user.image = user.imageDataresponse 
         ? this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+user.imageDataresponse)
         :  "../../../../assets/images/iBridgeLogo/iBridgeLogo.png";
         tempUserData?.push(user);
       if(!((index + 1) % 4)) {
        this.usersData?.push(tempUserData);
        tempUserData = [];
       }
       else{
        if((index+1 == res[1].responseData?.length) && (index + 1) % 4) {
          this.usersData?.push(tempUserData);
        }
       }
      });
      this.loading = false;
      console.log(this.process);

    }  
   }, (err: any)=> this.loading = false);
  }
  getSolutionDescription(process: any){
    this.solutionDescriptionList = [];  
    this.descriptionLoading = true;
    setTimeout(() => {
      this.solutionDescriptionList= this.process?.filter((pDetails: any) => pDetails.processName !== process.processName);
      this.solutionDescriptionList?.unshift(process);
      this.descriptionLoading = false;
    },1000)
  }
 
  
}

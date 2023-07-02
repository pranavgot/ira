import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';
import { UsersService } from 'src/app/core/services/users/users.service';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  profile!: ProfileType;
  loginDisplay = false;
  navOpen: boolean = false;
  leftHover: boolean = false;

  constructor(
    // private authService: MsalService,
    private http: HttpClient,
    private UserService: UsersService,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private shared: SharedService
  ) { }

  ngOnInit(): void {
    this.shared.getColap().subscribe((res:any)=>{
      // console.log(res);
      this.navOpen = res
      // console.log('nav',this.navOpen);      
    })
    this.shared.getLeftHov().subscribe((res:any)=>{
      // console.log(res);
      this.leftHover = res
      // console.log('nav',this.navOpen);      
    })
    // console.log(this.getName());
    // console.log(this.getEmail());
    // let data=this.login();
    // console.log(data);
    // this.getProfile();
    // this.msalBroadcastService.msalSubject$
    //   .pipe(
    //     filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
    //   )
    //   .subscribe((result: EventMessage) => {
    //     console.log(result);
    //   });

    // this.msalBroadcastService.inProgress$
    //   .pipe(
    //     filter((status: InteractionStatus) => status === InteractionStatus.None)
    //   )
    //   .subscribe(() => {
    //     this.setLoginDisplay();
    //   })
  }

  getProfile() {
    console.log('getProfile');

    // this.http.get(GRAPH_ENDPOINT)
    //   .subscribe(profile => {
    //     this.profile = profile;
    //   });
  }

  // setLoginDisplay() {
  //   this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  // }

  // login() {
  // this.UserService.userManagementLogin().subscribe((res:any)=>{
  //   console.log(res);
  //   return res
  // })
  // return this.http.get('https://graph.microsoft-ppe.com/v1.0/me')
  // }
  getName(): any {
    // console.log(this.authService.instance.getActiveAccount());
    // console.log(this.authService.instance.getConfiguration());
    // console.log(this.authService.instance.getAllAccounts());
    if (this.authService.instance.getActiveAccount() == null) {
      return 'unknown';
    }

    return this.authService.instance.getActiveAccount()?.name;
  }
  getEmail(): any {
    if (this.authService.instance.getActiveAccount() == null) {
      return 'unknown';
    }

    return this.authService.instance.getActiveAccount()?.username;
  }
}

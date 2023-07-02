import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../app/shared/models/user';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private userObject!: BehaviorSubject<User>;
    public user!: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  public get userValue(): User {
    return this.userObject.value;
}


doLogin() {
  // return this.http.get(this.solution_url+'industryMaster/getIndustry')

  // return this.http
  //     .get<any>(`${environment.AUTH_URL}api/UserServices/GetUserIdentity`)
  //     .pipe(
  //         map((user) => {
  //             console.log(user);
  //             //user.accessToken = user.token;
  //             // store user details and jwt token in local storage to keep user logged in between page refreshes
  //             if (user.message.toLowerCase() === 'success') {
  //                 localStorage.setItem('user', JSON.stringify(user.data));
  //                 this.userObject.next(user.data);
  //                 return user;
  //             } else {
  //                 throw 'Invalid Credentials';
  //             }
  //         })
  //     );
}


logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userObject.next({"name":"","email":""});        
    this.router.navigateByUrl('/auth/client/login');

}
}


// login(username: string, password: string) {
//     console.log(username,'==',password);
//     return this.http.get<any>(`${environment.AUTH_API_URL}api/Users/GetAccessToken?userName=`+username+`&password=`+password)
//         .pipe(map(user => {
//             // store user details and jwt token in local storage to keep user logged in between page refreshes
//             if(user.message.toLowerCase() === "success"){
//                 localStorage.setItem('user', JSON.stringify(user.data));
//                 this.userObject.next(user.data);
//                 return user;
//             } else{
//                 throw "Invalid Credentials";
//             }
//         }));
// }

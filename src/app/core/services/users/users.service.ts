import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public Masters_URL = environment.Masters_URL;
  public User_URL = environment.devUrl;
  token = sessionStorage.getItem('access_token');
  userObject: any;
  userInfo: any;
  accessToken=JSON.parse(localStorage?.getItem('user')||'{}')

  constructor(private http: HttpClient) {}
  public headerProfile = {
    headers: ({
      Authorization: 'Bearer ' + this.accessToken?.jwtToken,
      // accessToken:this.accessToken.accessToken
    }),
  };

  getSubscription() {
    return this.http.get(this.Masters_URL + 'Master/getSubscription');
  }
  getAllUserDetails() {
    return this.http.get(
      this.User_URL + '/ria/userManagement/getAllUserDetails'
    );
  }
  getAllorgDetails() {
    return this.http.get(this.User_URL + '/organization/getall');
  }
  getallusers(id: any) {
    return this.http.get(
      this.User_URL + '/ria/userManagement/getallusers/' + id
    );
    // http://devriaapi.ibridgets.com/RIA_CMN_USER/ria/userManagement/getallusers/44152e39-6e97-41a0-aeaf-00761f2b4ab0
  }
  getallsubscription(id: any) {
    return this.http.get(this.User_URL + '/ria/subscription/getbyid/' + id);
    // http://devriaapi.ibridgets.com/RIA_CMN_USER/ria/subscription/getbyid/F48F6D4A-E4D2-4C6E-83B8-20DE2C77B014
  }
  addNupdateOrgNusers(data: any) {
    const form = new FormData();
    form.append('sectorId', data.sectorId);
    // form.append("sectorId", data.sectorId)
    // form.append("sectorId", data.sectorId)
    form.append('imageData', data.imageData);
    form.append('spocDesignation', data.spocDesignation);
    form.append('spocEmailId', data.spocEmailId);
    form.append('json', data.json);
    form.append('flag', data.flag);
    form.append('address', data.address);
    form.append('industryId', data.industryId);
    form.append('spocName', data.spocName);
    form.append('spocPhoneNo', data.spocPhoneNo);
    form.append('organizationName', data.organizationName);
    if (data.organizationId) {
      //   console.log(data.organizationId);
      form.append('organizationId', data.organizationId);
    }
    return this.http.post(
      this.User_URL + '/ria/userManagement/addNupdateOrgNusers/',
      form
    );
    // return true
  }
  subscriptionsUpdate(data: any) {
    return this.http.post(this.User_URL + '/ria/subscription/update', data);
  }

  getAllNotificationByUserId(id: any) {
    return this.http.get(
      this.User_URL + '/notification/getbyid/' + id
      // http://devriaapi.ibridgets.com/RIA_CMN_USER/notification/getbyid/089EAD9C-789A-489A-B01E-16D4F41E0439
    );
  }
  sendNotification() {
    return this.http.get(this.Masters_URL + '/ria/Master/sendNotification');
  }
  getByUserIdSubscritpionDetails(id: any) {
    return this.http.get(
      this.Masters_URL + 'Master/getByUserIdSubscritpionDetails?userId=' + id
    );
  }
  // http://localhost:9191/ria/project/getProcessListByUserId/1E6ADE20-C96B-4090-9022-03DAADF33C92
  getprocessbyid(id: any,fl:any) {
    return this.http.get(this.User_URL + '/ria/project/getProcessListByUserId/' + id+'/'+fl);
  }
  getAllAnalyticsAndTemplates(id: any) {
    return this.http.get(
      this.Masters_URL + 'Master/getAllAnalyticsAndTemplates?processId=' + id
    );
  }
  getAllOrganization() {
    return this.http.get(this.User_URL + '/organization/getall');
  }
  getprojectDetails(id: any) {
    return this.http.get(
      this.User_URL + '/ria/subscription/getprojectDetails/' + id
    );
  }
  userManagementLogin(payload:any) {
    // console.log(this.headerProfile,this.accessToken);
     this.headerProfile = {
      headers: ({
        Authorization:  payload,
        // accessToken:this.accessToken.accessToken
      }),
    };
    return this.http
      .post(this.User_URL + '/ria/userManagement/login','',this.headerProfile)
      .pipe(
        map((user:any) => {
          console.log(user);
          //user.accessToken = user.token;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('users', JSON.stringify(user.responseData));
          return user.responseData
          // if (user.message.toLowerCase() === 'success') {
          //   this.userObject.next(user.data);
          //   return user;
          // } else {
          //   throw 'Invalid Credentials';
          // }
        })
      );
  }
  add_announcement(data: any) {
    return this.http.post(this.User_URL + '/announcement/save', data);
  }

  getAllAnnouncement() {
    return this.http.get(this.User_URL + '/announcement/getall');
  }

  getAnnouncementByid(id: any) {
    return this.http.get(this.User_URL + 'announcement/getbyid/' + id);
  }

  verifyEmail(data: any) {
    return this.http.post(this.User_URL + '/ria/userManagement/verifyEmailInuserDB', data);
  }
  getAllInternalUsers() {
    return this.http.get(this.User_URL + '/ria/userManagement/getAllInternalUserDetails')
  }
  addInternalUser(req: any) {
    return this.http.post(this.User_URL + '/ria/userManagement/addInternalUser',req);

  }
  getSubscriptionDetailsByUserId(id: any): Observable<any>{
    return this.http.get(this.User_URL + `/ria/subscription/getSubscriptionsDetailsBy/${id}`);
  }

}

// http://devriaapi.ibridgets.com/RIA_CMN_USER/ria/subscription/update

// 'http://devriaapi.ibridgets.com/RIA_CMN_USER/ria/userManagement/addNupdateOrgNusers' \
// -H 'accept: */*' \
// -H 'Content-Type: multipart/form-data' \
// -F 'sectorId=' \
// -F 'organiationContactNo=' \
// -F 'organizationEmailId=' \
// -F 'imageData=' \
// -F 'spocDesignation=' \
// -F 'spocEmailId=' \
// -F 'json=' \
// -F 'flag=' \
// -F 'organizationId=' \
// -F 'address=' \
// -F 'industryId=' \
// -F 'spocName=' \
// -F 'spocPhoneNo=' \
// -F 'organizationName='

// http://3.6.47.176:8080/RIA_CMN_USER/ria/userManagement/admin1/getAllUserDetails

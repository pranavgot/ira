import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {
  public devUrl = environment.devUrl
  public MstUrl = environment.Masters_URL
  // public local_URL = environment.local_URL
  token = sessionStorage.getItem('access_token');

  constructor(private http:HttpClient) { }
  public headerProfile ={
    headers : new HttpHeaders({
      Authorization: "Bearer " + this.token
    })
  }

  getAllLeads(){
    return this.http.get(this.devUrl+'/lead/getRegByStatus')
  }

  getAllUserDetails(){
    return this.http.get(this.devUrl+'/ria/userManagement/getAllUserDetails')
  }
  getallroleDetails(){
    return this.http.get(this.devUrl+'/serviceMst/getallroleDetails')
  }

  getAllUser_organizationDetails(id:any){
    return this.http.get(this.devUrl+'/ria/userManagement/getOrgDetailsByUserId/'+id)
  }

  getByUserIdSubscritpionDetails(id:any){
    return this.http.get(this.MstUrl+'Master/getByUserIdSubscritpionDetails?userId='+id)
  }

  addedituser_orgDetails(data:any){
    return this.http.post(this.devUrl+'/ria/userManagement/updateUserNorganization',data)
  }

  addUpdateOrgUsers(data:any){
    return this.http.post(this.devUrl+'/ria/userManagement/addNupdateOrgNusers',data)
    // http://devriaapi.ibridgets.com/RIA_CMN_USER/ria/userManagement/addNupdateOrgNusers
  }
  PostContactUs(data:any){
    return this.http.post(this.devUrl+'/contactUs',data)
  }
  // http://devriaapi.ibridgets.com/RIA_CMN_USER/contactUs

  getorg_details(id:any){
    return this.http.get(this.devUrl+'/organization/getbyid/'+id)
  }

  addOrupdateOrgDetail(data:any){
    return this.http.post(this.devUrl+'/organization/addOrupdateOrgDetails',data)
  }

}
  
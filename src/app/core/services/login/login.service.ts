import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public dev_url = environment.devUrl
  token = sessionStorage.getItem('access_token');

  constructor(private http:HttpClient) { }
  public headerProfile ={
    headers : new HttpHeaders({
      Authorization: "Bearer " + this.token
    })
  }
  PostRegister(data:any){
    return this.http.post(this.dev_url+'signup/userSignup',data)
  }
  getdetailsbyid(id: any){
    return this.http.get(this.dev_url+'/signup/getbyid/'+id)
  }
}

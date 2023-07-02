// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigResponse } from '../../../modules/user/admin1/new-solution/new-solution.component';

@Injectable({
  providedIn: 'root',
})

/**
 * Service to make HTTP calls
 */
export class HttpService {
  pbi_url = environment.Power_URL;

  constructor(private httpClient: HttpClient) {}

  /**
   * @returns embed configuration
   */
  getEmbedConfig(endpoint: string): Observable<ConfigResponse> {
    return this.httpClient.get<ConfigResponse>(endpoint);
  }
  // getEmbedInfo(){
  //   return this.httpClient.get('http://3.6.47.176:8080/riapowerbi/getembedinfo');
  // }
  getEmbedToken(data:any){
    return this.httpClient.post('https://api.powerbi.com/v1.0/myorg/groups/8382bae0-e72c-466d-8c30-b3a17ae331d4/reports/GenerateToken',data)
  }

  saveReport(data: any){
    return this.httpClient.post('https://devriaapi.ibridgets.com/POWER_BI/saveReport', data);
  }
  getAllProjectOverview(id: any){
    return this.httpClient.get('https://devriaapi.ibridgets.com/POWER_BI/getAllProjectOverview?userId='+id)
  }
  getprojectDetails(id: any) {
    return this.httpClient.get('https://devriaapi.ibridgets.com/POWER_BI/getprojectDetails?orgId='+id)
  }
  viewReport(data: any){
    return this.httpClient.post(this.pbi_url+'/viewReport', data);
  }
  updateReport(data: any){
    return this.httpClient.post(this.pbi_url+'/updateAdminReports', data);
  }
  // https://devriaapi.ibridgets.com/POWER_BI/viewReport
  // https://devriaapi.ibridgets.com/POWER_BI/updateAdminReports
}

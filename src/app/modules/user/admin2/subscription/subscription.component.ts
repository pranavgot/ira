import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { PopupService } from 'src/app/core/services/popup.service';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class SubscriptionComponent implements OnInit {
  usersData: any;
  SubSearch: MatTableDataSource<any> | any;
  displayedColumns: any;
  tab1: boolean = false;
  tab2: boolean = false;
  displayedColumns1 = ['userName', 'roleName', 'emailId', 'contactNo', 'status', 'action'];
  internalUsersData: any;
  orgData: any;
  orgdetailsForm!: FormGroup;
  dataSource = new MatTableDataSource([]);
  organizationLogo: any;

  
  @ViewChild('exPaginator', {static: false}) set exPaginator(value: MatPaginator) {
    if (this.SubSearch){
      this.SubSearch.paginator = value;
      console.log(value);
    }
  }
  @ViewChild('inPaginator', {static: false}) set inPaginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
    }
  }

  @ViewChild('sort') sort!: MatSort;
  @ViewChild("sort1") sort1!: MatSort;


  constructor(
    private userService: UsersService,
    private router: Router,
    private toast: ToastComponent,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private Users_service: UsersService,
    private popup: PopupService,
  ) { }

  ngOnInit(): void {
    this.getAllorgDetails()
    this.displayedColumns = ['organizationName', 'spocName', 'spocEmailId', 'spocphoneNo', 'action']

    this.orgdetailsForm = this.formBuilder?.group({
      spocDesignation: [{ value: '', disabled: true }],
      spocphoneNo: [{ value: '', disabled: true }],
      spocEmailId: [{ value: '', disabled: true }],
      organizationEmailId: [{ value: '', disabled: true }],
      organizationName: [{ value: '', disabled: true }],
      spocName: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
    });
    this.getInternalUserDetails();
  }
  getAllorgDetails() {
    this.userService.getAllorgDetails().subscribe((res: any) => {
      console.log("orgdetail", res);
      this.usersData = [];
      res.responseData.forEach((element: any) => {
        this.usersData.push({
          organizationId: element.organizationId,
          industryId: element.industryId,
          sectorId: element.sectorId,
          spocDesignation: element.spocDesignation,
          organizationName: element.organizationName,
          spocName: element.spocName,
          spocEmailId: element.spocEmailId,
          spocphoneNo: element.spocphoneNo,
        })
      });
      // this.usersData = res.responseData;
      // this.SubSearch = res.responseData;
      this.SubSearch = new MatTableDataSource<any>(res.responseData);
      this.SubSearch.paginator = this.exPaginator;
      this.changetab(1)
      this.SubSearch.sort = this.sort;
      console.log("nnn", res, this.SubSearch.data.length);
    })
  }
  edit(data: any) {
    // console.log(data);

    this.Users_service.getallusers(data.organizationId).subscribe((res: any) => {
      console.log(res.responseData[0].userMstDto);

      if (res.responseData[0].userMstDto.length > 0) {
        this.router.navigate(["/user/admin2/view-subscription", { organizationId: data.organizationId, serviceRequestId: null }])
      }
      else {
        this.popup.open(false, "No users exist for the client, please add");
      }
    })
    // this.router.navigate(["/user/admin2/view-subscription", { id: data.organizationId }])


  }
  applyFilter(event: any) {
    this.SubSearch = new MatTableDataSource<any>(this.usersData.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase())));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    this.SubSearch.paginator = this.exPaginator;
    this.SubSearch.sort = this.sort;
    // console.log(this.SubSearch);

  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  changetab(id: any) {
    if (id == 1) {
      this.tab1 = true;
      this.tab2 = false;
    }
    else {
      console.log("tab2");
      this.tab1 = false;
      this.tab2 = true;
    }
  }

  // setDataSourceAttributes() {
  //   if (this.dataSource) {
  //     this.dataSource.paginator = this.exPaginator;
  //     this.dataSource.sort = this.sort1;
  //   }

  // }

  getInternalUserDetails() {
    this.userService?.getAllInternalUsers()?.subscribe((res: any) => {
      this.orgData = res.responseData?.organizationMstDto;
      this.internalUsersData = res.responseData?.userMstDtolist;
      this.orgdetailsForm.patchValue({
        organizationName: this.orgData.organizationName,
        spocphoneNo: this.orgData.spocphoneNo,
        spocEmailId: this.orgData.spocEmailId,
        organizationEmailId: this.orgData.organizationEmailId,
        address: this.orgData.address,
        spocName: this.orgData.spocName,
        spocDesignation: this.orgData.spocDesignation,
      });
      this.organizationLogo = this.orgData?.imageDataresponse ? this.sanitizer?.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.orgData.imageDataresponse) : null;
      this.dataSource = new MatTableDataSource(this.internalUsersData);
      this.dataSource.paginator = this.inPaginator;
      // this.dataSource.sort = this.sort1;
      // this.setDataSourceAttributes();
    }
      //  ,(err: any) => this.toast?.error({title: 'Error',message: err?.error?.statusMessage})
    );
  }

  applyFilter1(event: any) {
    this.dataSource = new MatTableDataSource(this.internalUsersData?.filter((iu: any) => this.getFilteredList(iu, event.target?.value.trim()?.toLowerCase())));
    // this.setDataSourceAttributes();
    this.dataSource.paginator = this.inPaginator;
    // this.dataSource.sort = this.sort1;
  }
  viewuserSubscriptions(user: any) {
    this.router.navigate(["/user/admin2/view-subscription", { organizationId: user?.organizationId, userId: user?.userId, roleName: 'internal' }])
  }
  getFilteredList(iuObject: any, searchValue: any) {
    return Object?.values(iuObject)
      ?.map((val: any) => val = val?.toString()?.trim()?.toLowerCase())
      ?.reduce((acc, curVal) => {
        return acc || curVal?.indexOf(searchValue) > -1;
      }, false);
  }

}

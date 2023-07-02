import { I } from '@angular/cdk/keycodes';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { factories, models, service } from 'powerbi-client';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { HttpService } from 'src/app/core/services/services/http.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
// import { ToastComponent } from '../../all-common/toast/toast.component';
import { MatTableDataSource } from '@angular/material/table';
import { PopupService } from 'src/app/core/services/popup.service';
import { DOCUMENT } from '@angular/common';
import { interval } from 'rxjs';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';

@Component({
  selector: 'app-my-project',
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class MyProjectComponent implements OnInit {

  AddEventProceeding?: boolean;
  AddEventProceeding1?: boolean;
  AddEventProceeding2?: boolean;
  addEventIndex: any;
  draftshow: boolean = false;
  solshow: boolean = true;
  standshow: boolean = true;
  projectdetails: any;
  schedulerdetails: any;
  embedViewContainer: any;
  embedEditContainer: any;
  reportViewConfig: any;
  reportEditConfig: any;
  viewEmbedConfig: any;
  reportId: any;
  viewReport: any;
  powerbi!: service.Service;
  reportdata: any;
  uploaddata: any;
  projectSearch: MatTableDataSource<any> | any;
  @Input() service?: service.Service;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: any;
  response: any;
  projectStatus: any;
  standalone: any;
  failed: any;
  inter: any;

  constructor(
    private popup: PopupService,
    private router: Router,
    private loader: LoaderService,
    private solService: SolutionService,
    private route: ActivatedRoute,
    private Master: MastersService,
    private httpService: HttpService,
    @Inject(DOCUMENT) private document: Document
    // private toast:ToastComponent
  ) { }

  ngOnInit(): void {
    this.getAllProjectOverview();
    this.displayedColumns = ['projectName', 'processName', 'projectType', 'creationDate', 'lastExcuteDate', 'lastScheduleDate', 'statusName', 'action']
    // this.projectDraft();
    setTimeout(() => {
      this.execution();
    }, 1000);
    if (this.service) {
      this.powerbi = this.service;
    } else {
      this.powerbi = new service.Service(
        factories.hpmFactory,
        factories.wpmpFactory,
        factories.routerFactory
      );
    }
  }

  execution() {
    let execute = this.projectdetails.filter((user: any) => this.containsValue(user, 'Initiated Execution'.trim().toLowerCase()))
    if (execute ? execute.length > 0 : false) {
      this.inter = interval(20000).subscribe(x => {
        this.getAllProjectOverview();
        execute = this.projectdetails.filter((user: any) => this.containsValue(user, 'Initiated Execution'.trim().toLowerCase()))
        if (execute.length == 0) {
          clearInterval(this.inter)
        }
      })
    }
  }

  edit(e: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
  }
  CloseModal() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
    this.AddEventProceeding2 = false;
  }

  getAllProjectOverview() {
    // this.loader.show();
    let userData = JSON.parse(localStorage.getItem("userInfo") || '{}')
    this.httpService.getAllProjectOverview(userData.userId).subscribe((res: any) => {
      this.response = res.responseData;
      this.projectdetails = res.responseData.projectList;
      this.projectSearch = new MatTableDataSource<any>(res.responseData.projectList);
      this.projectSearch.paginator = this.paginator;
      this.projectSearch.sort = this.sort;
      this.projectStatus = res.responseData.projectStatus
      this.standalone = res.responseData.standloneAndIncrementalAndScheduler
      // console.log('this.standalone',this.standalone);

      // this.loader.hide();
      this.schedulerdetails = res.responseData.schedulerDTO;
      this.reportdata = res.responseData.reportResponse;
    }
      , (err: any) => {
        // this.toast.error({ title: 'Error', message: "No Data Found" })
        // this.loader.hide();
      })
  }
  projectCompleted(item: any) {
    // console.log(this.projectdetails, item);
    let data = {
      embedtype: 'RV',
      reportid: item.reportResponse[0]?.reportId,
      datasetid: item.reportResponse[0]?.datasetId,
    }
    this.solService.viewReport(data).subscribe((res: any) => {
      console.log(res.responseData);
      this.AddEventProceeding = true;
      this.embedViewContainer = document.getElementById('embedView');
      this.reportViewConfig = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: res.responseData?.embedToken,
        embedUrl: res.responseData?.embedUrl,
        id: res.responseData?.reportId,
        // accessToken: this.projectdetails[0]?.reportResponse[0]?.embedToken,
        // embedUrl: this.projectdetails[0]?.reportResponse[0]?.embedUrl,
        // // workSpaceId: this.projectdetails.reportResponse.workSpaceId,
        // id: this.projectdetails[0]?.reportResponse[0]?.reportId,

        filters: [],
        settings: {
          filterPaneEnabled: true,
          navContentPaneEnabled: true
        }
      }
      console.log(this.embedViewContainer);
      this.viewReport = this.powerbi.embed(this.embedViewContainer, this.reportViewConfig);

      // this.viewReport.off('loaded');
      // this.viewReport.on('loaded', () => {
      //   console.log('report loaded....')
      // })
    })
  }

  projectScheduled() {
    this.AddEventProceeding1 = true;
  }
  hideViewReport() {
    this.AddEventProceeding = false;
  }

  failedproject(i: any) {
    this.failed = i
    console.log(i);
    this.AddEventProceeding2 = true;
  }

  createProject() {
    // routerLink="/user/admin1/new-project"
    localStorage.removeItem('project')
    this.router.navigate(['/user/admin1/new-project']);
  }

  projectDraft(data: any) {
    localStorage.setItem('project', JSON.stringify(data))
    this.router.navigate(["/user/admin1/new-project", { data: JSON.stringify(data) }])
  }

  getErrorMsgByProjectID(projectId: any) {
    this.solService.getErrorMsgByProjectID(projectId).subscribe((res: any) => {
      if (res)
        this.popup.open(false, res.responseData);
      // this.toast.error({ title: 'Error', message: res.responseData })
    }, (err: any) => {
      this.popup.open(false, err.error.responseData);
      // this.toast.error({ title: 'Error', message: err.error.responseData })
    })
  }
  async PrintReport() {
    try {
      await this.viewReport.print();
    }
    catch (errors) {
      console.log(errors);
    }
  }

  //   applyFilter(event: any) {
  //     this.projectSearch = this.projectdetails.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
  //     // this.usersSearch = new MatTableDataSource<any>(res.responseData);
  //     this.projectSearch.paginator = this.paginator;
  //     this.projectSearch.sort = this.sort;
  //   }
  //   containsValue(userObj: any, searchValue: any) {
  //     return Object.values(userObj).reduce((prev, cur: any) => {
  //       if (cur != null) {
  //         cur = cur.toString().trim().toLowerCase();
  //         // console.log(cur);
  //       }
  //       return prev || cur?.indexOf(searchValue) > -1;
  //     }, false)
  //   }
  // }

  openWindow() {
    localStorage.setItem('powerbiconfig', JSON.stringify(this.reportViewConfig))
    // const link = this.document.createElement('powerbi-report');
    // link.
    // link.target = '_blank';
    // link.href = 'http://www.your-url.com';
    // link.click();
    // link.remove();
  }

  applyFilter(event: any) {
    this.projectSearch = new MatTableDataSource<any>(this.projectdetails.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase())));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    this.projectSearch.paginator = this.paginator;
    this.projectSearch.sort = this.sort;
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  // ngDestroy() {
  //   clearInterval(this.inter)
  // }

}



import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  PowerBIEmbedModule,
  PowerBIPaginatedReportEmbedComponent,
  PowerBIReportEmbedComponent,
} from 'powerbi-client-angular';
import {
  Embed,
  factories,
  IReportEmbedConfiguration,
  models,
  Page,
  Report,
  service,
  VisualDescriptor,
} from 'powerbi-client';
import * as pbi from 'powerbi-client';
import { HttpService } from 'src/app/core/services/services/http.service';
import { IHttpPostMessageResponse } from 'http-post-message';
import {
  errorClass,
  errorElement,
  hidden,
  position,
  reportUrl,
  successClass,
  successElement,
} from './../../../../../constants';
// import { PowerBIReportEmbedComponent } from 'powerbi-client-angular';
import 'powerbi-report-authoring';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { PowerBIEmbedComponent } from 'powerbi-client-angular/components/powerbi-embed/powerbi-embed.component';
import { Create } from 'create';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';

import { ToastComponent } from '../../all-common/toast/toast.component';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { IComponentEmbedConfiguration } from 'service';
import { interval } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
// import(embed) from Embed;
// import { HttpService } from './services/http.service';

// import { PowerBIEmbedModule } from 'powerbi-client-angular';

@Component({
  selector: 'app-new-solution',
  templateUrl: './new-solution.component.html',
  styleUrls: ['./new-solution.component.scss'],
})
export class NewSolutionComponent implements OnInit {
  inter: any;
  PBIdata: any;
  published: boolean = false;
  public get element(): ElementRef<HTMLDivElement> {
    return this._element;
  }
  public set element(value: ElementRef<HTMLDivElement>) {
    this._element = value;
  }
  reportClass = 'report-container ';

  reportConfig: any;
  powerbi!: service.Service;
  isEditPowerBI: boolean = false;
  process: any;
  dataSets: any;
  embedContainer: any;
  embedViewContainer: any;
  embedEditContainer: any;
  report: any;
  report1!: import('report').Report;
  viewReport: any;
  editReport: any;
  reportViewConfig: any;
  reportEditConfig: any;
  viewEmbedConfig: any;
  reportId: any;

  // report!: Embed;
  @Input() service?: service.Service;
  datasetid: any;
  dataset: any;
  ReportList: any;
  assigned: any;

  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  saveas!: FormGroup;
  submited: boolean = false;
  tokenpopup: boolean = false;
  create: boolean = false;

  time: any
  exptime: any
  diff: any
  secondsToDday: any
  minutesToDday: any
  hoursToDday: any

  // console.log(diff);
  // console.log(secondsToDday, minutesToDday, hoursToDday);


  constructor(
    private router: Router,
    public httpService: HttpService,
    private fb: FormBuilder,
    private popup: PopupService,
    private _element: ElementRef<HTMLDivElement>,
    private loader: LoaderService,
    private solService: SolutionService,
    private Masters: MastersService,
    private route: ActivatedRoute,
    private toast: ToastComponent
  ) { }

  async ngOnInit(): Promise<void> {
    this.saveas = this.fb.group({
      name: ['']
    })
    this.PBIdata = JSON.parse(localStorage.getItem('PBIdata') || '{}');
    console.log(this.PBIdata);
    this.process = JSON.parse(localStorage.getItem('process') || '{}');
    // this.dataset = JSON.parse(
    //   this.route.snapshot.paramMap.get('dataset') || ''
    // );
    if (this.process.statusName == 'Published') {
      console.log(this.process.statusName);
      this.published = true

    }
    this.datasetid = this.PBIdata.dataSetResponse[0].dataSetId;
    let publishednew = this.PBIdata.created;
    this.assigned = publishednew
    // ?'Submit':'Publish'
    if (this.service) {
      this.powerbi = this.service;
    } else {
      this.powerbi = new service.Service(
        factories.hpmFactory,
        factories.wpmpFactory,
        factories.routerFactory
      );
    }

    this.ReportList = this.PBIdata.dataSetResponse[0].reportList;
    this.viewEmbedConfig = this.ReportList[0];

    this.time = new Date()
    this.exptime = new Date(this.viewEmbedConfig.tokenExpiry)
    console.log(this.time, this.exptime);
    this.diff = this.exptime.getTime() - this.time.getTime()
    let diffSec = Math.floor((this.diff) / (this.milliSecondsInASecond));
    let secCount = diffSec;
    // this.inter = interval(1000).subscribe(x => {
    //   // this.secondsToDday = Math.floor((this.diff) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    //   // this.minutesToDday = Math.floor((this.diff) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    //   // this.hoursToDday = Math.floor((this.diff) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    //   // console.log(this.minutesToDday, this.minutesToDday == 5);

    //   secCount--;
    //   // console.log("diffsec", secCount);

    //   if (secCount ==  300) {
    //     // console.log("secCount", secCount);
    //     //minutesToDday == 5 && this.secondsToDday == 0)
    //     this.tokenpopup = true;
    //   }
    // });

    if (this.ReportList?.length > 0 && this.ReportList[0].reportId != null) {
      this.create = false;
      this.reportId = this.ReportList[0].reportId;
      this.editReportData();
    } else {
      this.create = true;


      this.reportConfig = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: this.viewEmbedConfig.embedToken,
        datasetId: this.datasetid, //"778b15d4-5528-417b-b490-25086f9bc88c",
        // Use other embed report config based on the requirement. We have used the first one for demo purpose
        embedUrl: this.viewEmbedConfig.embedUrl,
        permissions: models.Permissions.All,
        //id
        // Enable this setting to remove gray shoulders from embedded report
        settings: {
          background: models.BackgroundType.Transparent,
          // filterPaneEnabled: false,
          panes: {
            bookmarks: {
              visible: true,
            },
            Insights: {
              visible: true,
            },
          },
        },
      };
      this.embedContainer = document.getElementById('embed');

      this.report = this.powerbi.createReport(
        this.embedContainer,
        this.reportConfig
      );

      this.report1 = this.powerbi.createReport(
        this.embedContainer,
        this.reportConfig
      ) as Report;

      this.report.off('saved');

      // report.on will add an event handler which prints to Log window.
      this.report.on('saved', (event: any) => {
        if (event.detail.saveAs) {
          console.log(
            event.detail,
            '\nIn order to interact with the new report, create a new token and load the new report'
          );
          this.newsaved({
            dataSetId: this.datasetid,
            reportName: event.detail,
            reportid: event.detail.reportObjectId,
          });
        } else {
          console.log(event.detail);
        }
      });

      // await reportRendered;

      // Insert here the code you want to run after the report is rendered
      // Switch to edit mode.
      // this.report.switchMode("edit");

      // The new settings that you want to apply to the report.
      // const newSettings = {
      //   panes: {
      //     bookmarks: {
      //       visible: true
      //     }
      //   }
      // };

      // // Update the settings by passing in the new settings you have configured.
      // try {
      //   await this.report.updateSettings(newSettings);
      // }
      // catch (error) {
      //   console.log(error);
      // }
      // });
    }
    // this.getAllDataSetNameAPI();
  }

  editReportData() {
    this.isEditPowerBI = true;

    // this.report.switchMode("edit");

    console.log(this.viewEmbedConfig);
    // console.log(this.viewEmbedConfig.tokenExpiry);



    // this.embedEditContainer = document.getElementById('embedEdit');
    this.reportEditConfig = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken: this.viewEmbedConfig.embedToken,
      embedUrl: this.viewEmbedConfig.embedUrl,
      //workSpaceId: this.viewEmbedConfig.workSpaceId,
      id: this.reportId,
      viewMode: models.ViewMode.Edit,
      permissions: models.Permissions.ReadWrite,

      // filters: [],
      settings: {
        background: models.BackgroundType.Transparent,
        filterPaneEnabled: true,
        navContentPaneEnabled: true,
        panes: {
          bookmarks: {
            visible: true,
          },
          Insights: {
            visible: true,
          },
        },
      },
    };
    this.embedContainer = document.getElementById('embedEdit');
    // console.log(document.getElementById('embed'), document.getElementById('embed'));

    // let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    // this.report={}
    // console.log(this.create?this.reportConfig:this.reportEditConfig);
    this.report = this.powerbi.embed(
      this.embedContainer,
      this.reportEditConfig
    );
    // this.report.viewMode('edit')
    // this.report.switchMode("edit");

    console.log(this.report, this.reportConfig);

    this.report.off('saved');

    // report.on will add an event handler which prints to Log window.
    this.report.on('saved', (event: any) => {
      // console.log(event.detail);

      if (event.detail.saveAs == false) {
        this.published = false;
        console.log(
          event.detail,
          '\nIn order to interact with the new report, create a new token and load the new report'
        );
        this.updatesaved(event.detail.reportObjectId);
      } else {
        console.log(event.detail);
      }
    });

    // this.editReport.off('loaded');
    // this.editReport.on('loaded', () => {
    //   console.log('report loaded....')
    // })
  }

  ReportSave() {
    this.report.off('saved')
    if (this.create) {
      if (this.saveas.value.name != null) {
        let param = {
          name: this.saveas.value.name
        }
        this.report.saveAs(param);
        this.tokenpopup = false;
        this.saveas.reset()
      }
      else {
        this.popup.open(false, 'Enter report name to save report')
      }
    }
    else {
      this.report.save()
      this.tokenpopup = false;
      this.saveas.reset()
    }
  }

  CloseModal() {
    this.tokenpopup = false;
    this.saveas.reset()
  }

  newsaved(data: any) {
    const payload = {
      embedtype: 'RV',
      reportid: data.reportid,
      groupid: this.PBIdata.workSpaceId,
      datasetid: data.dataSetId,
      processId: this.process.processId,
      reportName: data.reportName.reportName,
    };
    this.httpService.saveReport(payload).subscribe((resp: any) => {
      // console.log('save powerBi res:', resp)
      if (resp) {
        this.PBIdata.dataSetResponse[0].reportList[0].reportId = payload.reportid
        localStorage.setItem('PBIdata', JSON.stringify(this.PBIdata))
        this.create = false;
        this.viewEmbedConfig = resp.responseData;
        this.reportId = payload.reportid;
        this.editReportData();
      }
    });
  }

  getAllDataSetNameAPI() {
    this.solService.getAllDatasetName(this.process.processId).subscribe(
      (res: any) => {
        this.dataSets = res.responseData;

        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }


  updatesaved(id: any) {
    let data = {
      reportId: id,
    }
    console.log('hello', data);
    this.solService.updateAdminReports(data).subscribe((res: any) => {
      console.log(res);
    })

  }

  AddEventProceeding: boolean | undefined;
  reportData() {
    this.AddEventProceeding = true;

    this.embedViewContainer = document.getElementById('embedView');
    this.reportViewConfig = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken: this.viewEmbedConfig.embedToken,
      embedUrl: this.viewEmbedConfig.embedUrl,
      workSpaceId: this.viewEmbedConfig.workSpaceId,
      id: this.reportId,
      filters: [],
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true,
      },
    };
    this.viewReport = this.powerbi.embed(
      this.embedViewContainer,
      this.reportViewConfig
    );

    this.viewReport.off('loaded');
    this.viewReport.on('loaded', () => {
      console.log('report loaded....');
    });
  }

  hideViewReport() {
    this.AddEventProceeding = false;
  }

  publishSolution() {
    this.solService.publishSolution(this.process.processId).subscribe(
      (res: any) => {
        this.toast.success({ title: 'Success', message: res.responseData });
        this.router.navigate(['/user/admin1/solution-board-dashboard']);
      },
      (err: any) => {
        this.toast.error({ title: 'Error', message: err.error.responseData });
      }
    );
  }
  Submit() {

    this.Masters.updateStatus(this.process.processId, 2).subscribe(
      (res: any) => {
        this.toast.success({ title: 'Success', message: res.responseData });
        this.router.navigate(['/user/admin1/solution-board-dashboard']);
      },
      (err: any) => {
        this.toast.error({ title: 'Error', message: err.error.responseData });
      }
    );
  }
  printReport() {
    try { this.editReport.print(); } catch (errors) { console.log(errors); }
  }
  ngDestroy() {
    clearInterval(this.inter)
  }
}

interface IReportLoadConfiguration {
  accessToken: string;
  bookmark?: models.IApplyBookmarkRequest;
  contrastMode?: models.ContrastMode;
  datasetBinding?: models.IDatasetBinding;
  embedUrl?: string;
  filters?: models.ReportLevelFilters[];
  id: string;
  pageName?: string;
  permissions?: models.Permissions;
  // settings?: models.IEmbedSettings;
  // slicers?: models.ISlicer[];
  // theme?: models.IReportTheme;
  tokenType?: models.TokenType;
  type: string;
  viewMode?: models.ViewMode;
}

export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}
// submit() {
//   // let tables: any[] = [];
//   // this.dataSets.forEach((ele: any) => {
//   //   if (ele.selected) {
//   //     tables.push(ele.datasetName);
//   //   }
//   // });
//   // let data = {
//   //   tables: tables,
//   //   userId: 'B7007E8C-6142-4EA2-AD7B-C1B252F807B8',
//   //   processId: this.process.processId,
//   // };

//   // console.log(data);
//   // this.solService.postPushDataSets(data).subscribe((res: any) => {
//   //   console.log(res);
//   let embdata = {
//     embedtype: 'RC',
//     groupid: 'eda9a781-67b2-4e04-9b07-e909b7ca0cae',
//     datasetid: this.datasetid,
//   };
//   console.log(embdata);

//   this.solService.getembedinfo(embdata).subscribe((resrep: any) => {
//     console.log(resrep.responseData);

//     this.reportConfig = {
//       type: 'report',
//       tokenType: models.TokenType.Embed,
//       accessToken: resrep.responseData.embedToken,
//       datasetId: resrep.responseData.dataSetId, //"778b15d4-5528-417b-b490-25086f9bc88c",
//       // Use other embed report config based on the requirement. We have used the first one for demo purpose
//       embedUrl: resrep.responseData.embedUrl,
//       permissions: models.Permissions.All,
//       viewMode: models.ViewMode.Edit,
//       // createImageBitmap
//       // Enable this setting to remove gray shoulders from embedded report
//       settings: {
//         // background: models.BackgroundType.Transparent,
//       },
//     };
//     this.embedContainer = document.getElementById('embed');

//     this.report = this.powerbi.createReport(
//       this.embedContainer,
//       this.reportConfig
//     );

//     console.log(this.reportConfig);
//   });
//   // this.reportConfig = {
//   //   // ...this.reportConfig,
//   //   id: '8067308c-d6bb-41cc-9cfc-71af4ff8e0c6',
//   //   embedUrl: resrep.responseData.embedUrl,
//   //   accessToken: resrep.responseData.embedToken,
//   //   permissions: models.Permissions.All,
//   //   viewMode: models.ViewMode.Edit,
//   // };
//   // });
// }

// onCheck(data: any) {
//   console.log(data);
//   this.dataSets.forEach((ele: any) => {
//     if (data.datasetId == ele.datasetId) {
//       ele.selected = !ele.selected;
//     }
//   });
//   console.log(this.dataSets);
// }
// this.process = { processId: '3900A4B8-4A36-4619-B8E1-2EED5A4C03E4' };
          // this.process = localStorage.getItem("process")
          // console.log(this.secondsToDday, this.minutesToDday, this.hoursToDday);
          // console.log(this.diff);
          // let embdata = {
            //   embedtype: 'RC',
            //   groupid: this.dataset.workSpaceId,
            //   datasetid: this.datasetid,
            // };
      // console.log(embdata);

      // this.solService.getembedinfo(embdata).subscribe(async (resrep: any) => {
      //   console.log(resrep.responseData);

          // this.Master.updateStatus(data.solutionId,1).subscribe((res:any)=>{
    //   console.log(res);
    //   // solutionId,solutionName
    //   this.router.navigate([
    //     '/user/admin1/add-process',
    //     { processId: data.solutionId, processName: data.solutionName },
    //   ]);
    // })
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { UsersService } from 'src/app/core/services/users/users.service';
// import { ToastComponent } from '../../all-common/toast/toast.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { PopupService } from 'src/app/core/services/popup.service';
import { catchError, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';


@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  AddEventProceeding: boolean | undefined;
  AddEventProceeding1: boolean | undefined;
  addEventIndex: any;
  AllProcess: any;
  flag = true;
  processName: any;
  choice: any;
  projectForm!: FormGroup;
  submited: boolean = false;
  userProcess: any;
  processes: any;
  processdetails: any;
  fileElem!: HTMLElement | null;
  process: any;
  projectData1: any;
  processname1: any;
  projectname1: any;
  panelOpenStateFive = true;
  down = true;
  scheduleForms!: boolean;
  projectid: any;
  processId: any;
  anaytics: any;
  anayticfile: any;
  downloadt: any;
  demo: any;
  tabs = [
    { id: 0, value: 'Download Files', isActive: true },
    { id: 1, value: 'Execute Project', isActive: false },
    { id: 2, value: 'Shedule Project', isActive: false },
  ];
  projectData: any;
  processname: any;
  projectname: any;
  subtab1: boolean = true;
  subtab2: boolean = false;
  subtab3: boolean = false;
  scheduleForm!: FormGroup;
  // uploaddata: Array<any> = []
  // uploaddata:any ={fileList:[]}
  anyData: any;
  // processIds: any;
  // idProcess: any;
  // idproject: any;
  progressBar: Array<any> = []
  progressBarPopup: boolean = false
  userData: any = {}
  projectcreated: boolean = false;
  uploadData: any;

  constructor(
    private popup: PopupService,
    private formbuilder: FormBuilder,
    private shared: SharedService,
    private solService: SolutionService,
    private Users_service: UsersService,
    private Master: MastersService,
    private _sanitizer: DomSanitizer,
    // private toast: ToastComponent,
    private http: HttpClient,
    private loader: LoaderService,
    private router: Router,
    private solution: SolutionService,
  ) { }

  ngOnInit(): void {
    // console.log(this.projectcreated);
    // console.log(this.projectData);


    this.projectForm = this.formbuilder.group({
      // processname: [''],
      projectname: ['', Validators.required],
      standalone: [''],
      // execute: [''],
      chooseProcess: ['']
    });
    this.scheduleForm = this.formbuilder.group({
      startdate1: [''],
      // projectname: ['', Validators.required],
      enddate1: [''],
      time1: [''],
      day: [''],
      date: ['']
    });
    // this.getAllProcess();
    this.scheduleForms = false;
    this.getprocessbyid();

    this.processId = JSON.parse(localStorage.getItem('projectProcess') || 'null')
    this.projectData = JSON.parse(localStorage.getItem('project') || "null")
    this.userData = JSON.parse(localStorage.getItem('userInfo') || "{}")

    console.log(this.projectData);


    if (this.projectData) {
      this.processname = this.projectData.processName
      this.projectname = this.projectData.projectName
      this.projectid = this.projectData.projectId
      // this.processes.forEach((item: any) => {
      //   if (this.projectData.processId == item.processId) {
      //     console.log('hi');
      //     this.projectForm.patchValue({
      //       chooseProcess: item,
      //       projectname: this.projectname,
      //       standalone: this.projectData.projectType
      //     })
      //   }
      // });
      // this.processId = this.projectData.processId
      this.getAllAnalyticsAndTemplates();
      this.getAllUploadFileTemplate();

    }


    this.process = JSON.parse(localStorage.getItem("projectProcess") || '{}')

    this.fileElem = document.getElementById('browse');
    this.shared.getClick()
  }

  getprocessbyid() {
    // this.loader.show();
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);

    if (data.roleName == 'External User') {
      // this.Users_service.getprocessbyid(data.userId, 2).subscribe((res: any) => {
      //   this.processes = res.responseData;
      this.Users_service.getprocessbyid(data.userId, 1).subscribe((res: any) => {
        this.processes = res.responseData;
        console.log(this.processes);

        if (this.projectData) {
          this.processes.forEach((item: any) => {
            if (this.projectData.organizationSolutionId == item.orgsolnId || this.projectData.processId == item.processId) {
              console.log('hi');
              this.projectForm.patchValue({
                chooseProcess: item,
                projectname: this.projectname,
                standalone: this.projectData.projectType
              })
            }
          });
          // this.processId = this.projectData.processId
          this.projectcreated = true
          this.getAllAnalyticsAndTemplates();
          this.getAllUploadFileTemplate();
        }

        // if()
        this.userProcess = [];
        console.log('this.AllProcess', this.AllProcess);

        this.AllProcess?.forEach((element: any) => {
          res.responseData.forEach((ele: any) => {
            if (ele.processId == element.processId) {
              this.userProcess.push(element);
            }
          });

          element.img = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + element.imageUrl)
        });
        this.loader.hide();
        console.log('userid process', this.userProcess, this.processes);
      });
    }
    else {
      this.Users_service.getprocessbyid(data.userId, 2).subscribe((res: any) => {
        this.processes = res.responseData;
        console.log(this.processes, this.projectData);

        if (this.projectData) {
          this.processes.forEach((item: any) => {
            if (this.projectData.organizationSolutionId == item.orgsolnId || this.projectData.processId == item.processId) {
              console.log('hi');
              this.projectForm.patchValue({
                chooseProcess: item,
                projectname: this.projectname,
                standalone: this.projectData.projectType
              })
            }
          });
          // this.processId = this.projectData.processId
          this.projectcreated = true
          this.getAllAnalyticsAndTemplates();
          this.getAllUploadFileTemplate();
        }

        // if()
        this.userProcess = [];
        console.log('this.AllProcess', this.AllProcess);

        this.AllProcess?.forEach((element: any) => {
          res.responseData.forEach((ele: any) => {
            if (ele.processId == element.processId) {
              this.userProcess.push(element);
            }
          });

          element.img = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + element.imageUrl)
        });
        this.loader.hide();
        console.log('userid process', this.userProcess, this.processes);
      });
    }
  }
  getAllProcess() {
    this.loader.show();

    this.Master.getAllProcess().subscribe((res: any) => {

      this.AllProcess = res.responseData;
      console.log(this.AllProcess);
      this.getprocessbyid();


    });
  }
  // addProject(data: any) {
  //   this.processdetails = data;
  //   console.log(data);
  //   this.processName = data.processName;
  // }
  success(e: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
  }
  CloseModal() {
    this.AddEventProceeding = false;
  }

  // createProject() { }

  projectSubmit() {
    this.loader.show();
    this.submited = true;
    if (this.projectForm.invalid) {
      console.log(this.projectForm);

      this.popup.open(false, 'Enter All the Required Fields');
      // this.toast.error({
      //   title: 'Error',
      //   message: 'Enter All the Required Fields',
      // });
      this.loader.hide();
      return;
    }
    let orgsid;
    console.log(this.processes);

    // localStorage.setItem('projectProcess', JSON.stringify(this.processId));
    this.processes.forEach((ele: any) => {

      if (ele.processId == this.processId) {
        // this.userProcess.push(element)
        console.log(ele, this.processdetails);
        this.processId = ele.processId
        orgsid = this.processdetails?.orgsolnId;
        console.log(this.processId);
      }

    });
    let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(userid, userid.userId);
    let data: any = {
      projectName: this.projectForm.value.projectname,
      executionType: this.projectForm.value.standalone ? 'S' : 'I',
      processName: this.projectForm.value.chooseProcess.processName,
      organizationSolutionId: this.projectForm.value.chooseProcess.orgsolnId,
      userId: userid.userId
    };
    this.processId = this.projectForm.value.chooseProcess.processId
    console.log(this.processId);


    this.processes.forEach((obj: any) => {
      if (this.processName == obj.processName)
        data.organizationSolutionId = obj.orgsolnId
    })
    console.log(data);

    this.solution.createProject(data).subscribe(
      (res: any) => {
        console.log(res);
        this.projectcreated = true
        this.projectid = res.responseData.projectId;
        console.log(this.projectid);

        this.popup.open(true, "Project created successfully !");
        // this.toast.success({ title: 'Success', message: "Project created successfully !" });
        localStorage.setItem('project', JSON.stringify(res.responseData));
        localStorage.setItem('projectProcess', JSON.stringify(this.processId));

        this.AddEventProceeding = true;
        this.loader.hide();
        this.getAllAnalyticsAndTemplates();
        this.getAllUploadFileTemplate();
        // this.router.navigate(['/user/admin1/view-download1']);
      },
      (err: any) => {
        this.loader.hide();
        this.popup.open(false, err.error.statusMessage);
        // this.toast.error({ title: 'Error', message: "Project name already exist" });
      }
    );
  }

  downloadTemplates() {
    let data = this.processId;
    this.loader.show()
    this.Master.downloadTemplates(data).subscribe((res: any) => {
      this.downloadt = res.responseData;
      this.downloadt.forEach((element: any) => {
        let type = element.fileName.split('.');
        console.log(type[1]);
        if (type[1] == 'jpg') {
          let src = `data:image/jpg;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'xlsx' || type[1] == 'xls') {
          let src = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'pdf') {
          let src = `data:application/pdf;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'png') {
          let src = `data:image/png;base64,${element.content}`;
          // console.log('png');
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'csv') {
          let src = `data:application/csv;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'txt') {
          let src = `data:application/txt;base64,${element.content}`;
          // console.log('demo');
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'zip') {
          let src = `data:application/zip;base64,${element.content}`;
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
      });

      this.loader.hide();
      this.popup.open(true, 'Downloaded Successfully!');
      // this.toast.success({title: 'Success',message: 'Downloaded Successfully!'});
    },
      (err: any) => {
        this.loader.hide();
        this.popup.open(false, 'Download Failed!');
        // this.toast.error({ title: 'Error', message: 'Download Failed!' });     
      })
  }

  getAllAnalyticsAndTemplates() {
    let data = this.processId || this.projectData.processId;
    // if (this.processId != null) {
    //   data = this.processId
    // }
    // else {
    //   data = this.projectData.processId;
    // }
    // console.log(data, this.processId, this.projectData.processId);

    this.Users_service.getAllAnalyticsAndTemplates(data).subscribe(
      (res: any) => {
        this.anyData = res.responseData;
        console.log(this.anyData);
        this.anaytics = res.responseData.processAnalyticsDTOList;
        this.anayticfile = res.responseData.templateResponse;
      }
    );
  }

  getAllUploadFileTemplate() {
    this.uploadData = []
    // console.log(this.projectData);
    let data = this.projectData?.projectId || this.projectid;
    this.solService.getAllUploadFileTemplate(data).subscribe(
      (res: any) => {
        this.uploadData = res.responseData;
        console.log("this.uploadData", this.uploadData);
        console.log("this.uploadData", this.uploadData?.length >= 0);
        // this.anaytics = res.responseData.processAnalyticsDTOList;
        // this.anayticfile = res.responseData.templateResponse;
      },(err:any)=>{
        
      });
  }

  scheduler() {
    // this.submited = true
    // if (this.contactForm.invalid) {
    // console.log(this.contactForm);
    //   this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
    //   return;
    // }

    this.subtab1
    this.subtab2
    this.subtab3

    let scfreq = (this.subtab1) ? 'Daily' : (this.subtab2) ? 'Weekly' : 'Monthly'
    let scheduledata = {
      projectId: this.projectid,
      scheduleFrequency: scfreq,

      startDate: this.scheduleForm.value.startdate1,
      endDate: this.scheduleForm.value.enddate1,
      executionTime: this.scheduleForm.value.time1,
      executionDay: this.scheduleForm.value.day,
      dateOfmonth: this.scheduleForm.value.date,
    }
    this.solService.addScheduler(scheduledata).subscribe((res: any) => {
      console.log("contactus", res);
      this.popup.open(true, "Project Scheduled Successfully!");
      // this.toast.success({ title: 'Success', message: "Project Scheduled Successfully!" });
      this.router.navigate(["/user/admin1/project"])

    })
      , (err: any) => {
        this.popup.open(false, err.statusMessage);
        // this.toast.error({ title: 'Error', message: err.statusMessage });
      }
  }

  saveiputFiles(event: any) {
    let data = this.projectid;
    console.log("projectid", data);

    let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(userid, userid.userId);

    let postRequestArray: Array<any> = []
    this.progressBar = []
    for (let i = 0; i < event.target.files.length; i++) {
      const formData = new FormData();
      formData.append('projectId', this.projectid);
      formData.append('userId', userid.userId);
      formData.append('processId', this.anyData.processId);
      formData.append('file', event.target.files[i])
      postRequestArray.push(this.solService.uploadExcelToProjectExecution(formData).pipe(
        tap((e: any) => {
          console.log(e);
          if (e.type === HttpEventType.UploadProgress) {
            this.progressBar[i] = { percentage: Math.round((95 / e.total) * e.loaded), file: event.target.files[i].name, isError:false, icon:false }
            console.log(this.progressBar);
          }
        }),
        catchError((err) => {
          return of({ error: err, isError: true })
        }
        )))
    }
    //console.log(postRequestArray);
    this.uploadData = []
    this.progressBarPopup = true
    forkJoin(
      postRequestArray
    ).subscribe((response: any) => {
      console.log(response);
      response.forEach((res: any,i:number) => {
        this.progressBar[i].percentage = 100
        this.progressBar[i].icon = true
        if (res.isError){
          this.progressBar[i].isError = res.isError
          this.progressBar[i].errMsg = res.error.error.statusMessage
        } 
        else this.progressBar[i].isError = false
      })

      let err = response.map((x:any)=>x.isError)
      if(!err.includes(true)) { 
        this.progressBarPopup = false
      }
      this.getAllUploadFileTemplate()
      console.log('this.uploaddata', this.uploadData);

    });

    //this.loader.show()
    // this.solService.uploadExcelToProjectExecution(formData).subscribe((res: any) => {
    //   this.uploaddata = res.responseData;
    //   this.loader.hide()
    //   console.log(this.uploaddata);
    //   this.popup.open(true,'Upload Successfully!');
    // }),
    // (err:any)=>{
    //   this.popup.open(false,'Upload Failed!');
    // }

  }
  changesubtab(id: any) {
    if (id == 1) {
      this.subtab1 = true;
      this.subtab2 = false;
      this.subtab3 = false;
    }
    else if (id == 2) {
      this.subtab1 = false;
      this.subtab2 = true;
      this.subtab3 = false;
    }
    else {
      this.subtab1 = false;
      this.subtab2 = false;
      this.subtab3 = true;
    }
  }
  scheduleProject() {
    this.scheduleForms = true;
  }
  executeProject() {
    this.scheduleForms = false;
    //this.AddEventProceeding1 = true;
  }

  closePopup() {
    this.AddEventProceeding1 = false;
  }
  executeNow() {
    console.log(this.projectid);
    if (!this.scheduleForms) {
      let execObj = {
        projectId: this.projectData?.projectId || this.projectid,
        userId: this.userData.userId,
        processId: this.anyData.processId
      }
      this.solService.executeProject(execObj).subscribe(
        (res: any) => {
          this.popup.open(true, res.responseData);
          this.loader.hide();
          this.router.navigate(['user/admin1/my-project']);
        },
        (err: any) => {
          this.loader.hide();
        }
      );
    }
  }
}

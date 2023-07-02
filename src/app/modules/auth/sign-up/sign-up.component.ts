import { CONTROL } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ControlContainer, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { identity, Observable } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
// import { ToastComponent } from '../../user/all-common/toast/toast.component';

declare var $: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  indusData: any;
  lengthIndus: any;
  sectData: any;
  lengthSector: any;
  lengthProcess: any;
  selectedProcess: any = [];
  submited: boolean = false;
  verified: boolean = false;
  otperror: boolean = false;
  GprocData: any;
  CprocData: any;
  disableButton: boolean = false;

  constructor(
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private Master: MastersService,
    // private toast: ToastComponent,
    private router: Router,
    private popup: PopupService,
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      // accountCount: [],

      contactNo: ['', Validators.required],
      designation: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email,  Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // otp: [],
      name: ['', Validators.required],
      // orgCcntactNo: ['', Validators.required],
      // orgEmailId: ['', Validators.required],
      orgName: ['', Validators.required],
      address: ['', Validators.required],
      solutionDescription: [''],
      industryId: ['', Validators.required],
      sectorId: ['', Validators.required],
      // processId: ['', Validators.required],
      spocName: ['', Validators.required],
      spocEmailId: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      spocphoneNo: ['', Validators.required],
      spocDesignation: ['', Validators.required],
      // spocname: ['', Validators.required],
      // spocedesignation: ['', Validators.required],
      // spocemail: ['', Validators.required],
      otp: ['', Validators.required],
    });
    this.getAllIndustry()
    // this.getAllSector()
    this.getAllProcessByGeneric();
    // $('[data-toggle="tooltip"]').tooltip();

  }
  getAllIndustry() {
    this.Master.getAllIndustry().subscribe((res: any) => {
      console.log(res);
      this.indusData = res.responseData;
      this.lengthIndus = res.responseData.length;
      console.log(this.indusData, this.lengthIndus);

    })
  }
  getAllSector() {
    this.Master.getAllSectors().subscribe((res: any) => {
      console.log(res);
      this.sectData = res.responseData;
      this.lengthSector = res.responseData.length;
    })
  }
  getAllProcessByGeneric() {
    this.Master.getAllProcessByType(1).subscribe((res: any) => {
      console.log(res);
      this.GprocData = res.responseData;
      this.lengthProcess = res.responseData.length;
    })

    this.Master.getAllProcessByType(2).subscribe((res: any) => {
      console.log(res);
      this.CprocData = res.responseData;
      this.lengthProcess = res.responseData.length;
    })
  }
  selectionChange(event: any, data: any) {
    // this.sectData =[]
    console.log(data, event);
    if (event.isUserInput) {
      this.sectData = data.sectorList;
    }
    // this.Master.getIndustryByID(data).subscribe((res: any) => {
    //   console.log(res);
    //   this.procData=res.responseData;
    //   this.lengthProcess=res.responseData.length;
    // })
  }
  getOtp() {
    if(!this.signupForm.controls['emailId'].errors?.email && !this.signupForm.controls['emailId'].errors?.pattern){
      // if(this.signupForm.controls.emailId.value == '') {
        if (this.signupForm.value.emailId || this.signupForm.value.name) {
          let data = {
            emailId: this.signupForm.value.emailId,
            name: this.signupForm.value.name,
            templateID: '1'
          }
          this.Master.VerifyOtp(data).subscribe((res: any) => {
            console.log(res);
            this.otperror = false;
            this.popup.open(true, "Please check your email for the OTP.");
            // this.toast.success({ title: 'Success', message: "Please check your email for the OTP." });
          }, (err: any) => {
            console.log(err.statusMessage);
            // this.toast.error({ title: 'Error', message: "Email already exist !" });
            // this.otperror=true;
            this.popup.open(false, "Email Already Exist");
            // this.toast.error({ title: 'Error', message: "Email Already Exist" });
            // this.otperror=false;
          });
          // 
    
    
          // else {
          //   this.toast.error({ title: 'Error', message: 'Please Enter Name and Email Id ' });
          //   // console.log("hi");
    
          // }
        }
        else{
          this.popup.open(false,"Enter Name and Email Id to generate OTP")
        }
      this.disableButton = true;
        return 
      }else this.disableButton = false;
    
        //   if(this.signupForm.controls.emailId.value == '') {
        // this.clickButton = true;
        //   return 
        // }else this.clickButton = false;
       
  }

  varifyEmail(){
    // console.log(signupForm)
    if(!this.signupForm.controls['emailId'].errors?.email && !this.signupForm.controls['emailId'].errors?.pattern){
    // if(this.signupForm.controls.emailId.value == '') {
    this.disableButton = true;
      return 
    }else this.disableButton = false;
    //this.orgdetailsForm.controls.org_name.value
    //this.disableButton = false;

  }
  // verifyOtp() {
  //   let otpverify = {
  //     emailId: this.signupForm.value.emailId,
  //     otp: this.signupForm.value.otp.toString(),
  //     name: this.signupForm.value.name
  //   }
  //   this.Master.VerifyOtp(otpverify).subscribe((res: any) => {
  //     console.log(res);
  //     // this.verified=true
  //   })
  // }
  registrationSubmit() {
    this.submited = true
    if (this.signupForm.invalid) {
      // console.log(this.signupForm);
      this.popup.open(false, "Enter All the Required Fields");
      // this.toast.error({ title: 'Error', message: "Enter all the required fields" });
      return;
    }
    console.log(this.signupForm);

    let data = {
      // accountCount: ,
      contactNo: this.signupForm.value.contactNo,
      designation: this.signupForm.value.designation,
      emailId: this.signupForm.value.emailId,
      name: this.signupForm.value.name,
      orgCcntactNo: this.signupForm.value.orgCcntactNo,
      orgEmailId: this.signupForm.value.orgEmailId,
      orgName: this.signupForm.value.orgName,
      address: this.signupForm.value.address,
      spocName: this.signupForm.value.spocName,
      spocEmailId: this.signupForm.value.spocEmailId,
      spocphoneNo: this.signupForm.value.spocphoneNo,
      spocDesignation: this.signupForm.value.spocDesignation,
      // reasonToAccess:this.signupForm.value ,
      // rejectionReason:this.signupForm.value ,
      solutionDescription: this.signupForm.value.solutionDescription,
      industryId: this.signupForm.value.industryId.industryId,
      sectorId: this.signupForm.value.sectorId.sectorId,
      processId: this.selectedProcess
    }
    let otpverify = {
      emailId: this.signupForm.value.emailId,
      otp: this.signupForm.value.otp.toString(),
      // name: this.signupForm.value.name
    }
    this.loader.show();
    this.Master.VerifyOtp(otpverify).subscribe((res: any) => {
      console.log(res);
      // this.toast.success({ title: 'Success', message: "Email ID verified and Your response has been submitted." });

      this.Master.SignUp(data).subscribe((res: any) => {

        console.log(res);
        this.popup.open(true, "Thank you for Registering !");
        // this.toast.success({ title: 'Success', message: "Thank you for Registering !" });
        this.otperror = false;
        this.router.navigate(["/auth/landing"])
        // routerLink="/auth/sign-in"
        // this.router.navigate(["/auth/landing"])
        this.loader.hide();
      }, (err: any) => {
        this.popup.open(false, "Organization already exist !");
        this.loader.hide();
        // this.toast.error({ title: 'Error',  message: "Organization already exist !" });
      })
    }, (err: any) => {
      console.log(err.statusMessage);
      // this.toast.error({ title: 'Error', message: "Email already exist !" });
      this.otperror = true;
      this.popup.open(false, "Wrong OTP Entered !");
      this.loader.hide();
      // this.toast.error({ title: 'Error', message: "Wrong OTP Entered !" });
      // this.otperror=false;
    });
  }

  selectProcess(data: any) {
    let flag = 0;
    if (this.selectedProcess.length == 0) {
      this.selectedProcess.push(data.processId)
    }
    else {
      this.selectedProcess.forEach((element: any, i: any) => {
        // console.log(this.selectedProcess[i]);

        if (data.processId == element) {
          flag = 1;
          this.selectedProcess.splice(i, 1)
        }

      });
      if (flag == 0) {
        this.selectedProcess.push(data.processId)
      }
    }
    console.log(this.selectedProcess);
  }
  cancel() {
    this.router.navigate(["/auth/landing"])
  }
}
// {
//   accountCount": 0,
//   "contactNo": "string",
//   "designation": "string",
//   "emailId": "string",
//   "name": "string",
//   "orgCcntactNo": "string",
//   "orgEmailId": "string",
//   "orgName": "string",
//   "reasonToAccess": "string",
//   "rejectionReason": "string",
//   "solutionDescription": "string",
//   "industryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "sectorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "processId": [
//     "3fa85f64-5717-4562-b3fc-2c963f66afa6"
//   ]
// }
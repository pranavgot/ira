import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadsService } from 'src/app/core/services/Leads/leads.service';
import { PopupService } from 'src/app/core/services/popup.service';
// import { ToastComponent } from '../../user/all-common/toast/toast.component';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  submited: boolean = false;
  contactForm!: FormGroup

  constructor(
    private popup:PopupService,
    private formbuilder: FormBuilder,
    private leadsService:LeadsService,
    private router: Router,
    // private toast: ToastComponent,
    ) { }

  ngOnInit(): void {
    this.contactForm = this.formbuilder.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      contactnumber: ['', Validators.required],
      orgName: ['', Validators.required],
      message: ['', Validators.required],
    })
  }
  contactSubmit() {
    this.submited = true
    if (this.contactForm.invalid) {
      // console.log(this.contactForm);
      this.popup.open(false,"Enter All the Required Fields");
      // this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
      return;
    }
    console.log(this.contactForm);
     let data = {
      company_name: this.contactForm.value.orgName,
      contact_no: this.contactForm.value.contactnumber,
      email_id: this.contactForm.value.emailId,
      message: this.contactForm.value.message,
      name: this.contactForm.value.name
      }
      this.leadsService.PostContactUs(data).subscribe((res:any)=>{
        console.log("contactus",res);
        this.popup.open(true,"Thank you for Contacting Us…");
        // this.toast.success({ title: 'Success', message: "Thank you for Contacting Us…" });
        // this.router.navigate(["/auth/landing"])
        setTimeout(() => this.router.navigate(["/auth/landing"]), 3000);
      })
      ,(err:any)=>{
        this.popup.open(false,err.statusMessage);
          // this.toast.error({ title: 'Error', message: err.statusMessage });
        }
    }
  
  }

import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
// import { ToastComponent } from '../../user/all-common/toast/toast.component';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  process: any;
  data: any;
  processSearch: any;
  processidd: any;
  requiredId: any;
  videoId: any;
  demo: any;
  brochures: any;

  constructor(
    // private toast: ToastComponent,
    private master: MastersService,
    private loader: LoaderService,
    private popup:PopupService,
    private _sanitizer: DomSanitizer,
  ) { }
  displayStyle = "none";

  ngOnInit(): void {
    this.getAllProcess()
  }
  getAllProcess(){
    this.loader.show()
    this.master.getAllProcessBasedPublishedAndFeatureList(1).subscribe((res:any)=>{
      this.process=res.responseData;
      this.processSearch=res.responseData;
      console.log(this.process);      
      this.process.forEach((element:any) => {
        element.image=this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+element.imageUrl)
        element.video=this._sanitizer.bypassSecurityTrustResourceUrl('data:video/mp4;base64,'+element.videoUrl)
        element.brochure=this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,'+element.brochureUrl)
        // this.demo = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+'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')
        // video/mp4
        // imageUrl
      });
      console.log(res,this.process);
      this.loader.hide()
    })
  }
  openPopup(data:any) {
    this.data=data
    this.displayStyle = "block";
  }
  openPopup1(data:any) {

    this.data=data

    this.displayStyle = "block";

  }

  closePopup() {

    this.displayStyle = "none";

  }

  AddEventProceeding: boolean | undefined;

  AddEventProceeding1: boolean | undefined;

  video:any
  ShowDemo(item:any) {
    this.processidd = item.processId;
    this.videoId = item.videoId;
    if(item.videoId != null){
      this.master.brochureanddemo( this.videoId, this.processidd).subscribe((res:any)=>{
        this.demo=res.responseData;
      this.AddEventProceeding = true
      this.brochure= this.demo
      this.video=this._sanitizer.bypassSecurityTrustResourceUrl('data:video/mp4;base64,'+this.demo)

      }) 
    }
    else{
      this.AddEventProceeding = false
      this.popup.open(false,"Demo Video is not available for this process");
      // this.toast.error({ title: 'Error', message: "Demo Video is not available for this process" });
    }
    

  }
  brochure:any
  ShowBrochure(item:any) {
    console.log(item);
    this.processidd = item.processId;
    this.requiredId = item.brochureId;
    if(item.brochureId != null){
      this.master.brochureanddemo( this.requiredId, this.processidd).subscribe((res:any)=>{
        this.brochures=res.responseData;
      this.AddEventProceeding1 = true
      // this.brochure= this.brochures
      this.brochure=this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,'+this.brochures)
      }) 
    }
    else{
      this.popup.open(false,"Brochure is not available for this process");
      // this.toast.error({ title: 'Error', message: "Brochure is not available for this process" });
    }
    
  }

  CloseModel()
  {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
  }

  applyFilter(event: any) {
    this.processSearch =this.process.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    // this.leadSearch.paginator = this.paginator;
    // this.leadSearch.sort = this.sort;
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
}

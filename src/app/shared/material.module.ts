import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button';
import {MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule } from '@angular/material/sort';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
// import {NgxPaginationModule} from 'ngx-pagination'; 
import {MatCardModule} from '@angular/material/card';
// import { NumbersDirective } from './directives/numbers.directive';
// import { AlphabetsDirective } from './directives/alphabets.directive';
import { MatTreeModule } from '@angular/material/tree';


@NgModule({
  declarations: [
    // NumbersDirective, AlphabetsDirective
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule,
    MatListModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDialogModule,
    MatTabsModule,
    // NgxPaginationModule,
    MatCardModule,
    MatTreeModule
  ], exports:[
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSelectModule,
    MatListModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatCheckboxModule,
    MatExpansionModule,MatSlideToggleModule,
    MatTooltipModule,MatDialogModule,MatTabsModule,
    // NgxPaginationModule,
    MatCardModule,
    // MatAccordion,
    MatExpansionModule,
    MatTreeModule,
    // MatSidenavContainer,
    // MatSidenavContent,
    // NumbersDirective,AlphabetsDirective
  ]
})
export class MaterialModule { }
 
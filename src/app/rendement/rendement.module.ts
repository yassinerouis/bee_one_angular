import { CustomerService } from './declaration-recolte/customerservice';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeclarationRecolteComponent } from './declaration-recolte/declaration-recolte.component';
import { RouterModule, Routes } from '@angular/router';

import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {InputTextModule} from 'primeng/inputtext';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'declaration-recolte', component: DeclarationRecolteComponent }
]

@NgModule({
  declarations: [DeclarationRecolteComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableModule,
    CalendarModule,
		SliderModule,
		DialogModule,
		MultiSelectModule,
		ContextMenuModule,
		DropdownModule,
		ButtonModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ProgressBarModule,
    HttpClientModule,
    TooltipModule,
    InputTextareaModule,
    InputNumberModule
  ],
  providers: [CustomerService],

})
export class RendementModule { }

import { FeatureService } from '../services/feature.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Inspection, Result, InspectionTable } from '../models/feature.model';
import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';


// const ELEMENT_DATA: Inspection[] = [
//   {inspections: 'ss'},
//   {inspections: 'csdc'}
// ];

@Component({
  selector: 'app-full-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './full-summary.component.html',
  styleUrls: ['./full-summary.component.scss'] // Corrected to styleUrls
})
export class FullSummaryComponent implements OnDestroy {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  inspectionForm: FormGroup;
  displayedColumns: string[] = ['inspectionName', 'actions'];
  dataSource: Inspection[] = [];

  requestId: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private featureService: FeatureService,
    private router: Router
  ) {
    this.inspectionForm = this._formBuilder.group({
      inspections: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getInspectionTable();
  }

  addFullInspectionDetails() {
    Swal.fire({
      title: 'Enter Inspection Name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: "#125CBB",
      cancelButtonColor: "#ED636D",
      showLoaderOnConfirm: true,
      preConfirm: (inspectionName) => {
        if (!inspectionName) {
          Swal.showValidationMessage('Inspection Name is required');
          return false;
        }
        this.inspectionForm.get('inspections')?.setValue(inspectionName);
        return true;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed && this.inspectionForm.valid) {
        const inspection: Inspection = this.inspectionForm.value;
        this.featureService.createFullInspectionApi(inspection)
          .pipe(takeUntil(this._destroy$))
          .subscribe((res: any) => {
            this.redirectToSpecificInspection(res.data.id);
            Swal.fire('Success', 'Inspection added successfully', 'success');
          }, (error: HttpErrorResponse) => {
            if (error.status == 409) {
              Swal.fire(error.error.error.message, 'Try another', 'warning');
            } else {
              Swal.fire('Error', `Error adding inspection: ${error.message || error}`, 'error');
            }
          });
      }
    });
  }

  deleteInspection(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.featureService.deleteInspectionApi(id)
          .pipe(takeUntil(this._destroy$))
          .subscribe((response: any) => {
            if (response.code === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
              this.getInspectionTable();
            }
          });
      }
    });
  }

  getInspectionTable() {
    this.featureService.getInspectionTableApi()
      .pipe(takeUntil(this._destroy$))
      .subscribe((response: any) => {
        if (response.code === 200 && Array.isArray(response.data)) {
          this.dataSource = response.data.map((item: any) => ({
            inspections: item.inspections,
            id: item._id
          }));
        } else {
          console.error('Unexpected response format', response);
        }
      }, (error: HttpErrorResponse) => {
        console.error('Error fetching inspection table', error);
      });
  }


  // deleteInspection() {
  //   this.featureService.deleteInspectionApi(this.requestId)
  //     .pipe(takeUntil(this._destroy$))
  //     .subscribe((response: any) => {
  //       if (response.code === 200) {

  //       }
  //     });
  // }

  redirectToSpecificInspection(redirectId: string) {
    this.router.navigate(
      ['/home'],
      { queryParams: { id: redirectId } }
    );
  }

  // http://localhost:4200/home?id=6734add5d6c78346a35db3b2

  ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}


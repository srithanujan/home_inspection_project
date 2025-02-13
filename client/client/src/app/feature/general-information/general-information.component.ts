import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FeatureService } from '../services/feature.service';
import {ClientInformation, InspectionCompany, InspectionUpdate} from '../../../../src/app/feature/models/feature.model';
import { InspectionUpdatesService } from '../../shared/services/check-updates/services/inspection-updates.service';
import { ImageService } from '../../shared/services/image-upload/image.service';

@Component({
  selector: 'app-general-information',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.scss'
})
export class GeneralInformationComponent implements OnInit {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  inspectionUpdate: any;
  clientInformation: FormGroup = this._formBuilder.group({});
  inspectionCompany: FormGroup = this._formBuilder.group({});
  @Input() combinedDetails: FormGroup = this._formBuilder.group({});

  constructor(private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private inspectionUpdatesService: InspectionUpdatesService,
    private imageService: ImageService,
    private featureService: FeatureService
  ) {
      this.initializeForms();
      this.route.queryParamMap.subscribe(params => {
        this.requestId = params.get('id') as string;
      });

  }

  ngOnInit(): void {
    this.getUpdatesTrigger();
  }

  getUpdatesTrigger() {
    this.inspectionUpdatesService.currentUpdate.subscribe(
      update => {
        this.inspectionUpdate = update;
          if(this.inspectionUpdate.generalInfo && (this.inspectionUpdate._id === this.requestId)) {
            this.getGeneralInformation();
          }
      },
      error => {
        console.error('Error fetching inspection update:', error);
      }
    );
  }

  private initializeForms(): void {
    this.clientInformation = this.createClientInformationFormGroup();
    this.inspectionCompany = this.createInspectionCompanyFormGroup();
    this.combinedDetails = this.createCombinedDetailsFormGroup();
  }

  private createClientInformationFormGroup(): FormGroup {
    return this._formBuilder.group({
      contactName: [''],
      clientAddress: [''],
      phoneNumber: [''],
      email: ['', [Validators.email]]
    });
  }

  private createInspectionCompanyFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectorName: [''],
      inspectionAddress: [''],
      phoneNumber: [''],
      email: ['', [Validators.email]]
    });
  }

  private createCombinedDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      clientInformation: this.clientInformation,
      inspectionCompany: this.inspectionCompany,
      inspectionId: this.requestId
    });
  }


getGeneralInformation(): void {
  this.featureService.getGeneralInformationApi(this.requestId)
    .pipe(takeUntil(this._destroy$))
    .subscribe((response: any) => {
      if (response.code === 200 && response.data && response.data.general) {
        const generalData = response.data.general.data;

        const clientInformationFormGroup = this.mapClientInformationFormGroup(generalData?.clientInformation);
        const inspectionCompanyFormGroup = this.mapInspectionCompanyFormGroup(generalData?.inspectionCompany);

        this.combinedDetails.patchValue({
          clientInformation: clientInformationFormGroup.value,
          inspectionCompany: inspectionCompanyFormGroup.value
        });
      }
    });
}

private mapClientInformationFormGroup(clientInfo: ClientInformation): FormGroup {
  return this._formBuilder.group({
    contactName: this._formBuilder.control({ value: clientInfo?.contactName, disabled: false }),
    clientAddress: this._formBuilder.control({ value: clientInfo?.clientAddress, disabled: false }),
    phoneNumber: this._formBuilder.control({ value: clientInfo?.phoneNumber, disabled: false }),
    email: this._formBuilder.control({ value: clientInfo?.email, disabled: false }),
  });
}

private mapInspectionCompanyFormGroup(inspectionCompanyInfo: InspectionCompany): FormGroup {
  return this._formBuilder.group({
    inspectorName: this._formBuilder.control({ value: inspectionCompanyInfo?.inspectorName, disabled: false }),
    inspectionAddress: this._formBuilder.control({ value: inspectionCompanyInfo?.inspectionAddress, disabled: false }),
    phoneNumber: this._formBuilder.control({ value: inspectionCompanyInfo?.phoneNumber, disabled: false }),
    email: this._formBuilder.control({ value: inspectionCompanyInfo?.email, disabled: false }),
  });
}


}


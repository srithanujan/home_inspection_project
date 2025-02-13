import { Component, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';

import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';

@Component({
  selector: 'app-plumbing',
  standalone: true,
  imports: [MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    ImageUploaderComponent
    ],
  templateUrl: './plumbing.component.html',
  styleUrl: './plumbing.component.scss'
})
export class PlumbingComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() plumbingDetails: FormGroup = this._formBuilder.group({});

  plumbingWaterMeterImage: string = 'plumbingWaterMeterImage';
  plumbingWaterHeaterImage: string = 'plumbingWaterHeaterImage';

  plumbingMainShutoffLocationOptions = ['Basement', 'Other', 'N/A'];
  plumbingWaterEntryPipingOptions = ['Copper', 'Plastic', 'Galvanized iron', 'Other', 'N/A'];
  plumbingLeadOtherThanSolderJoistOptions = ['No', 'Yes', 'N/A'];
  plumbingVisibleWaterDistributionPipingOptions = ['Copper', 'PEX', 'Poly B - Polybutene', 'Galvanized steel', 'Other', 'N/A'];
  plumbingConditionOptions = ['Acceptable', 'Marginal', 'Other', 'N/A'];
  plumbingFunctionalFlowOptions = ['Acceptable', 'Low water pressure', 'Other', 'N/A'];
  plumbingDrainWasteAndVentPipeOptions = ['ABS - Black thin-walled plastic', 'PVC - White Thin-walled Plastic', 'Clay - Ceramic', 'Copper', 'Iron', 'Other', 'N/A'];
  plumbingWaterHeaterTypeOptions = ['Storage water heater', 'Tankless water heater', 'Other', 'N/A'];
  plumbingWaterHeaterEnergySourceOptions = ['Natural gas', 'Electricity', 'Oil', 'Other', 'N/A'];
  plumbingWaterHeaterCapacityOptions = ['40 Gallon', '50 Gallon', '60 Gallons', 'Other', 'N/A'];
  plumbingWaterHeaterOperationOptions = ['Adequate', 'Inadequate', 'Other', 'N/A'];
  plumbingWaterHeaterConditionOptions = ['Acceptable condition', 'Marginal condition', 'Minor rust present', 'No hot water', 'Sign of leak present', 'Sign of previous leak present', 'Shut down by owner', 'Other', 'N/A'];


  constructor(private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private featureService: FeatureService
  ) {
      this.initializeForms();
      this.route.queryParamMap.subscribe(params => {
        this.requestId = params.get('id') as string;
      });

  }

  ngOnInit(): void {

  }

  private initializeForms(): void {
    this.plumbingDetails = this.createPlumbingDetailsFormGroup();
  }

  private createPlumbingDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      regular: this._formBuilder.group({
        plumbingMainShutoffLocation: [''],
        otherPlumbingMainShutoffLocation: [''],
        plumbingWaterEntryPiping: [''],
        otherPlumbingWaterEntryPiping: [''],
        plumbingLeadOtherThanSolderJoist: [''],
        otherPlumbingLeadOtherThanSolderJoist: [''],
        plumbingVisibleWaterDistributionPiping: [''],
        otherPlumbingVisibleWaterDistributionPiping: [''],
        plumbingCondition: [''],
        otherPlumbingCondition: [''],
        plumbingFunctionalFlow: [''],
        otherPlumbingFunctionalFlow: [''],
        plumbingDrainWasteAndVentPipe: [''],
        otherPlumbingDrainWasteAndVentPipe: [''],
        plumbingComments: ['']
    }),

    waterHeater: this._formBuilder.group({
        plumbingWaterHeaterType: [''],
        otherPlumbingWaterHeaterType: [''],
        waterHeaterApproximateAge: [''],
        waterHeaterEnergySource: [''],
        otherWaterHeaterEnergySource: [''],
        waterHeaterCapacity: [''],
        otherWaterHeaterCapacity: [''],
        waterHeaterOperation: [''],
        otherWaterHeaterOperation: [''],
        waterHeaterCondition: [''],
        otherWaterHeaterCondition: [''],
        waterHeaterComments: ['']
    }),

    });
  }

}







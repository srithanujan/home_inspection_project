import { Component, Input } from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';
import { InspectionUpdatesService } from '../../shared/services/check-updates/services/inspection-updates.service';
import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';


@Component({
  selector: 'app-roof',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    ImageUploaderComponent
  ],
  templateUrl: './roof.component.html',
  styleUrl: './roof.component.scss'
})
export class RoofComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  inspectionUpdate: any;
  @Input() roofDetails: FormGroup = this._formBuilder.group({});

  plumbingConditionOfCoveringsImage: string = 'plumbingConditionOfCoveringsImage';
  plumbingConditionOfCoveringsSecondImage: string = 'plumbingConditionOfCoveringsSecondImage';
  plumbingVentsImage: string = 'plumbingVentsImage';

  roofStyleOptions = ['Gable', 'Hip', 'Hip and Valley', 'Dormer', 'Flat', 'Other', 'N/A'];
  roofPitchOptions = ['Medium', 'Low', 'High', 'Other', 'N/A'];
  roofVisibilityOptions = ['Partially visible', 'Fully visible', 'Not visible', 'Other', 'N/A'];
  roofInspectionMethodOptions = ['Ground level', 'Ladder at the eave', 'On the roof', 'Roof not inspected', 'N/A', 'Other'];
  roofVentilationPresentOptions = ['Yes', 'No', 'Not visible', 'N/A'];
  roofVentilationTypeOptions = ['Soffit vent', 'Ridge vent', 'Gable vent', 'Static vent', 'Other', 'N/A'];

  roofMaterialOptions = ['Asphalt shingle', 'Metal', 'Wood and Cedar shake', 'Other', 'N/A'];
  roofConditionOptions = [
    'Acceptable condition',
    'Marginal condition',
    'Loose or missing shingles',
    'Burn spots present',
    'Unable to inspect the roof thoroughly due to height restrictions',
    'The shingles typically last between 12-15 years depending on the roof slope and quality of shingles',
    'Recommend a roof inspection by professional roofer before closing to get accurate information about roof condition',
    'N/A'
  ];

  plumbingVentsPresentOptions = ['Present', 'Not Present', 'Not visible', 'Other', 'N/A'];
  plumbingVentsTypeOptions = ['ABS', 'Metal'];
  plumbingVentsConditionOptions = ['Acceptable condition', 'Marginal condition', 'Other', 'N/A'];


  constructor(private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private inspectionUpdatesService: InspectionUpdatesService,
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

  private initializeForms(): void {
    this.roofDetails = this.createRoofDetailsFormGroup();
  }


  getUpdatesTrigger() {
    this.inspectionUpdatesService.currentUpdate.subscribe(
      update => {
        this.inspectionUpdate = update;
          if(this.inspectionUpdate.roofInfo && (this.inspectionUpdate._id === this.requestId)) {
            this.getRoofInformation();
          }
      },
      error => {
        console.error('Error fetching inspection update:', error);
      }
    );
  }

  private createRoofDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      roofDescription: this._formBuilder.group({
        style: [''],
        otherStyle: [''],
        pitch: [''],
        otherPitch: [''],
        visibility: [''],
        otherVisibility: [''],
        methodOfInspection: [''],
        otherMethodOfInspection: [''],
        ventilationPresent: [''],
        ventilationType: [''],
        otherVentilationType: ['']
      }),
      conditionOfCoverings: this._formBuilder.group({
        material: [''],
        approximateAgeShingles: [''],
        otherMaterial: [''],
        condition: [''],
        otherCondtion: [''],
        comments: ['']
      }),
      plumbingVents: this._formBuilder.group({
        plumbingOfVents: [''],
        otherPlumbingOfVents: [''],
        type: [''],
        otherType: [''],
        condition: [''],
        otherCondtion: [''],
        comments: ['']
      })
    });
  }


  getRoofInformation() {
    this.featureService.getRoofApi(this.requestId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response: any) => {
        if (response.message === 200 && response.roofDetails) {
          const roofData = response.roofDetails;
          const roofDetailsFormGroup = this.mapRoofDetailsFormGroup(roofData);
          this.roofDetails.patchValue(roofDetailsFormGroup.value);
        }
      });
  }

  private mapRoofDetailsFormGroup(roofData: any): FormGroup {
    return this._formBuilder.group({
      roofDescription: this._formBuilder.group({
        style: this._formBuilder.control({ value: roofData.roofDescription.style, disabled: false }),
        pitch: this._formBuilder.control({ value: roofData.roofDescription.pitch, disabled: false }),
        visibility: this._formBuilder.control({ value: roofData.roofDescription.visibility, disabled: false }),
        methodOfInspection: this._formBuilder.control({ value: roofData.roofDescription.methodOfInspection, disabled: false }),
        otherMethodOfInspection: this._formBuilder.control({ value: roofData.roofDescription.otherMethodOfInspection, disabled: false }),
        ventilationPresent: this._formBuilder.control({ value: roofData.roofDescription.ventilationPresent, disabled: false }),
        ventilationType: this._formBuilder.control({ value: roofData.roofDescription.ventilationType, disabled: false }),
        otherVentilationType: this._formBuilder.control({ value: roofData.roofDescription.otherVentilationType, disabled: false })
      }),
      conditionOfCoverings: this._formBuilder.group({
        material: this._formBuilder.control({ value: roofData.conditionOfCoverings.material, disabled: false }),
        approximateAgeShingles: this._formBuilder.control({ value: roofData.conditionOfCoverings.approximateAgeShingles, disabled: false }),
        otherMaterial: this._formBuilder.control({ value: roofData.conditionOfCoverings.otherMaterial, disabled: false }),
        condition: this._formBuilder.control({ value: roofData.conditionOfCoverings.condition, disabled: false }),
        otherCondtion: this._formBuilder.control({ value: roofData.conditionOfCoverings.otherCondtion, disabled: false }),
        comments: this._formBuilder.control({ value: roofData.conditionOfCoverings.comments, disabled: false })
      }),
      plumbingVents: this._formBuilder.group({
        plumbingOfVents: this._formBuilder.control({ value: roofData.plumbingVents.plumbingOfVents, disabled: false }),
        type: this._formBuilder.control({ value: roofData.plumbingVents.type, disabled: false }),
        otherType: this._formBuilder.control({ value: roofData.plumbingVents.otherType, disabled: false }),
        condition: this._formBuilder.control({ value: roofData.plumbingVents.condition, disabled: false }),
        otherCondtion: this._formBuilder.control({ value: roofData.plumbingVents.otherCondtion, disabled: false }),
        comments: this._formBuilder.control({ value: roofData.plumbingVents.comments, disabled: false })
      })
    });
  }

}

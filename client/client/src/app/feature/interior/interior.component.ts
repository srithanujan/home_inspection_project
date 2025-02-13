import { Component, Input } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
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
  selector: 'app-interior',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    ImageUploaderComponent
  ],
  templateUrl: './interior.component.html',
  styleUrl: './interior.component.scss'
})
export class InteriorComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() interiorDetails: FormGroup = this._formBuilder.group({});

  uploadImageName: string = 'building';

  interiorStairsImage: string = 'interiorStairsImage';
  interiorHandrailsImage: string = 'interiorHandrailsImage';
  interiorSmokeImage: string = 'interiorSmokeImage';
  interiorSkylightImage: string = 'interiorSkylightImage';
  interiorFireplaceImage: string = 'interiorFireplaceImage';
  interiorFloorDrainImage: string = 'interiorFloorDrainImage';
  interiorAtticsImage: string = 'interiorAtticsImage';
  interiorCommentsImage: string = 'interiorCommentsImage';
  interiorSumpPumpImage: string = 'interiorSumpPumpImage';


// STAIRS
interiorStairsMaterialOptions = ['Hardwood', 'Carpet', 'Laminate', 'Other', 'N/A'];
interiorStairsConditionOptions = ['Acceptable condition', 'Marginal condition', 'Squeaky stairs', 'Other', 'N/A'];

// HANDRAILS AND RAILINGS
interiorHandrailsMaterialOptions = ['Wood', 'Metal', 'Wood and Metal', 'Other', 'N/A'];
interiorHandrailsConditionOptions = ['Acceptable condition', 'Marginal condition', 'Shaky handrail or railings – Need fix', 'Low railing height (Between 34 – 38 inches)', 'Other', 'N/A'];

// SMOKE / CO - DETECTORS
interiorSmokeDetectorCommentsOptions = [
  'Installed on every level of the house and Operable',
  'Not installed on every level of the house',
  'Expired smoke and/or carbon monoxide detectors',
  'Present but not working',
  'Other',
  'N/A'
];

// SKY LIGHT
interiorSkylightTypeOptions = ['Fixed skylight', 'Ventilating skylight (roof window)', 'Tubular skylight', 'Other', 'N/A'];
interiorSkylightCommentsOptions = [
  'Acceptable – No sign of water penetration or condensation',
  'Water stain (Discoloration) around the edges and ceiling – possible water leak',
  'Recommend further inspection by specialist',
  'Visible crack',
  'Visible leak',
  'Condensation and fog on glass – ensure proper ventilation in the house',
  'Other',
  'N/A'
];

// FIREPLACE
interiorFireplaceLocationOptions = ['Family room', 'Basement', 'Other', 'N/A'];
interiorFireplaceTypeOptions = ['Natural gas fireplace', 'Wood fireplace', 'Other', 'N/A'];
interiorFireplaceCommentsOptions = [
  'Inspected and working at the time of inspection',
  'Turned off by owner – NOT Inspected',
  'Be sure exhaust cap is clear of vegetation and debris',
  'Recommend a WETT inspection done (Wood Energy Technology Transfer) before using the wood-burning fireplace',
  'Other',
  'N/A'
];

// FLOOR DRAIN
interiorFloorDrainConditionOptions = ['Acceptable', 'Marginal', 'Unknown', 'Other', 'N/A'];
interiorFloorDrainCommentsOptions = [
  'Always keep the floor drain clear of debris',
  'Cannot locate',
  'Covered by flooring materials',
  'Cover missing',
  'Other',
  'N/A'
];

// ATTICS
interiorAtticAccessOptions = ['Scuttle attic hole', 'Loft ladder', 'Other', 'N/A'];
interiorAtticLocationOptions = ['Master bedroom closet', 'Bedroom closet', 'Hallway', 'Other', 'N/A'];
interiorAtticInspectionMethodOptions = [
  'From the attic access, at the scuttle hole',
  'Attic not inspected – No access',
  'Flat roof – No attic',
  'Other',
  'N/A'
];
interiorAtticRoofFramingOptions = ['2x4 and 2x6 Truss' , 'Other', 'N/A'];
interiorAtticSheathingOptions = ['Plywood', 'Wood', 'Other', 'N/A'];
interiorAtticInsulationTypeOptions = [
  'Blown in – Fiberglass',
  'Blown in – Cellulose',
  'Spray foam',
  'Fiberglass batt',
  'Vermiculate insulation',
  'Other',
  'N/A'
];
interiorAtticInsulationDepthOptions = [
  'Adequate insulation present',
  'Inadequate insulation',
  'Insulation need to be topped up',
  'Insulations disturbed and moved – Need fix',
  'Other',
  'N/A'
];
interiorAtticVaporBarrierOptions = ['Plastic', 'Other', 'N/A'];
interiorAtticVentilationOptions = ['Roof and soffit vents', 'Appears adequate', 'Inadequate ventilation', 'Other', 'N/A'];
interiorAtticExhaustFanOptions = [
  'No – Bathroom fan vented outside',
  'Yes – Bathroom fan vented into attic',
  'Exhaust fan must be vented outside',
  'No evidence of condensation or moisture',
  'Evidence of condensation or moisture present',
  'Other',
  'N/A'
];
interiorAtticCommentsOptions = [
  'No signs of leaks found at the time of inspection',
  'Open electrical splices noted',
  'Damaged electrical wires noted (Bitten by animals)',
  'Evidence of moisture noted',
  'Evidence of insect damage noted',
  'Sheeting under the shingles has moisture damage',
  'Sign of birds and/or animals in the attic',
  'Live raccoons found in the attic',
  'Recommend removing old insulation and re-insulate the attic',
  'Other',
  'N/A'
];

// SUMP PUMP
interiorSumpPumpLocationOptions = ['Basement', 'Other', 'N/A'];
interiorSumpPumpConditionOptions = ['Tested and working at the time of inspection', 'Tested and not working – Need fix', 'Other', 'N/A'];


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

// inspectionId: this.requestId

private initializeForms(): void {
  this.interiorDetails = this.createInteriorDetailsFormGroup();
}

private createInteriorDetailsFormGroup(): FormGroup {
  return this._formBuilder.group({
    inspectionId: this.requestId,
    stair: this._formBuilder.array([this.createStairsFormGroup()]),
    handrail: this._formBuilder.array([this.createHandrailsFormGroup()]),
    smokeDetector: this._formBuilder.group({
      interiorSmokeDetectorComments: [''],
      otherInteriorSmokeDetectorComments: ['']
    }),
    skylight: this._formBuilder.group({
      interiorSkylightType: [''],
      otherInteriorSkylightType: [''],
      interiorSkylightComments: [''],
      otherInteriorSkylightComments: ['']
    }),
    fireplace: this._formBuilder.array([this.createFirePlaceFormGroup()]),
    floorDrain: this._formBuilder.group({
    interiorFloorDrainCondition: [''],
    otherInteriorFloorDrainCondition: [''],
    interiorFloorDrainComments: [''],
    otherInteriorFloorDrainComments: ['']
  }),
  attic: this._formBuilder.group({
    interiorAtticAccess: [''],
    otherInteriorAtticAccess: [''],
    interiorAtticLocation: [''],
    otherInteriorAtticLocation: [''],
    interiorAtticInspectionMethod: [''],
    otherInteriorAtticInspectionMethod: [''],
    interiorAtticRoofFraming: [''],
    otherInteriorAtticRoofFraming: [''],
    interiorAtticSheathing: [''],
    otherInteriorAtticSheathing: [''],
    interiorAtticInsulationType: [''],
    otherInteriorAtticInsulationType: [''],
    interiorAtticInsulationDepth: [''],
    otherInteriorAtticInsulationDepth: [''],
    interiorAtticVaporBarrier: [''],
    otherInteriorAtticVaporBarrier: [''],
    interiorAtticVentilation: [''],
    otherInteriorAtticVentilation: [''],
    interiorAtticExhaustFan: [''],
    otherInteriorAtticExhaustFan: [''],
    interiorAtticComments: [''],
    otherInteriorAtticComments: ['']
  }),
  sumpPump: this._formBuilder.group({
    interiorSumpPumpLocation: [''],
    otherInteriorSumpPumpLocation: [''],
    interiorSumpPumpCondition: [''],
    otherInteriorSumpPumpCondition: [''],
    interiorSumpPumpComments: [''],
    otherInteriorSumpPumpComments: ['']
  })
  });
}


  get stairsForm(): FormArray {
    return this.interiorDetails.get('stair') as FormArray;
  }

  get handrailsForm(): FormArray {
    return this.interiorDetails.get('handrail') as FormArray;
  }

  get firePlaceForm(): FormArray {
    return this.interiorDetails.get('fireplace') as FormArray;
  }

  createStairsFormGroup(): FormGroup {
    return this._formBuilder.group({
      interiorStairsMaterial: [''],
      otherInteriorStairsMaterial: [''],
      interiorStairsCondition: [''],
      otherInteriorStairsCondition: [''],
      interiorStairsComments: ['']
    });
  }


  createHandrailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      interiorHandrailsMaterial: [''],
      otherInteriorHandrailsMaterial: [''],
      interiorHandrailsCondition: [''],
      otherInteriorHandrailsCondition: [''],
      interiorHandrailsComments: ['']
    });
  }


  createFirePlaceFormGroup(): FormGroup {
    return this._formBuilder.group({
      interiorFireplaceLocation: [''],
      otherInteriorFireplaceLocation: [''],
      interiorFireplaceType: [''],
      otherInteriorFireplaceType: [''],
      interiorFireplaceCondition: [''],
      otherInteriorFireplaceCondition: [''],
      interiorFireplaceComments: [''],
      otherInteriorFireplaceComments: ['']
    });
  }


  addStairs(): void {
    this.stairsForm.push(this.createStairsFormGroup());
  }

  addHandrails(): void {
    this.handrailsForm.push(this.createHandrailsFormGroup());
  }

  addFireplace(): void {
    this.firePlaceForm.push(this.createFirePlaceFormGroup());
  }

  removeStairs(index: number): void {
    this.stairsForm.removeAt(index);
  }

  removeHandrails(index: number): void {
    this.handrailsForm.removeAt(index);
  }

  removeFireplace(index: number): void {
    this.firePlaceForm.removeAt(index);
  }


}







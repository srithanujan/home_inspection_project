import { Component, Input } from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormArray, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';

@Component({
  selector: 'app-basement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './basement.component.html',
  styleUrl: './basement.component.scss'
})
export class BasementComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() basementDetails: FormGroup = this._formBuilder.group({});

roomWallsImage: string = 'roomWallsImage';

uploadImageName: string = 'building';


basementCeilingOptions = [
  'Acceptable',
  'Wood framing',
  'Drywall and paint',
  'Other',
  'N/A'
];

basementWallsOptions = [
  'Acceptable',
  'Wood framing',
  'Drywall and paint',
  'Other',
  'N/A'
];

basementVaporBarrierOptions = [
  'Plastic barrier',
  'Other',
  'N/A'
];

basementInsulationOptions = [
  'Fiberglass',
  'Other',
  'N/A'
];

basementDoorsOptions = [
  'Hollow wood',
  'Other',
  'N/A'
];

basementWindowsOptions = [
  'Vinyl slider',
  'Metal slider',
  'Wood',
  'Other',
  'N/A'
];

basementElectricalOptions = [
  '110 VAC',
  'Other',
  'N/A'
];

basementFloorMaterialOptions = [
  'Poured concrete',
  'Engineered hardwood – Water damage to the floor',
  'Other',
  'N/A'
];

basementFloorConditionOptions = [
  'Poor condition',
  'Other',
  'N/A'
];

basementFloorCoveredOptions = [
  'Most part of the floor covered by flooring materials (Finished basement)',
  'Other',
  'N/A'
];

basementStairsConditionOptions = [
  'Acceptable condition',
  'Other',
  'N/A'
];

basementStairsHandrailOptions = [
  'Present and acceptable condition',
  'Other',
  'N/A'
];

basementStairsHeadwayOverStairsOptions = [
  'Appear adequate',
  'Other',
  'N/A'
];



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
    this.basementDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      basements: this._formBuilder.array([this.createBasementFormGroup()])
    });
  }

  get basements(): FormArray {
    return this.basementDetails.get('basements') as FormArray;
  }

  createBasementFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      basementLaundryCeiling: [''],
      otherBasementLaundryCeiling: [''],
      basementWalls: [''],
      otherBasementWalls: [''],
      basementVaporBarrier: [''],
      otherBasementBarrier: [''],
      basementInsulation: [''],
      otherBasementInsulation: [''],
      basementDoors: [''],
      otherBasementDoors: [''],
      basementWindows: [''],
      otherBasementWindows: [''],
      basementElectrical: [''],
      otherBasementElectrical: [''],


      basementFloor: this._formBuilder.group({
        basementFloorMaterial: [''],
        otherBasementFloorMaterial: [''],
        basementFloorCondition: [''],
        otherBasementFloorCondition: [''],
        basementFloorCovered: [''],
        otherBasementFloorCovered: [''],
    }),


      basementStairs: this._formBuilder.group({
        basementStairsConditon: [''],
        otherBasementStairsCondition: [''],
        basementStairsHandrail: [''],
        otherBasementStairsHandrail: [''],
        basementStairsHeadway: [''],
        otherBasementStairsHeadway: ['']
    }),


    });
  }



  addBasements(): void {
    this.basements.push(this.createBasementFormGroup());
  }

  removeBasements(index: number): void {
    this.basements.removeAt(index);
  }

}

import { Component, Input } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormArray} from '@angular/forms';
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

import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';

@Component({
  selector: 'app-kitchen',
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
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.scss'
})
export class KitchenComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() kitchenDetails: FormGroup = this._formBuilder.group({});

  uploadImageName: string = 'building';

  kitchenCountertopsImage: string = 'kitchenCountertopsImage';
  kitchenCabinetsImage: string = 'kitchenCabinetsImage';
  kitchenPlumbingImage: string = 'kitchenPlumbingImage';
  kitchenFloorImage: string = 'kitchenFloorImage';
  kitchenWallsImage: string = 'kitchenWallsImage';
  kitchenCeilingsImage: string = 'kitchenCeilingsImage';
  kitchenElectricalOutletsAndLightsImage: string = 'kitchenElectricalOutletsAndLightsImage';

  kitchenAppliancesImage: string = 'kitchenAppliancesImage';
  kitchenDishwasherImage: string = 'kitchenDishwasherImage';
  kitchenRangehoodFanImage: string = 'kitchenRangehoodFanImage';
  kitchenRefrigeratorImage: string = 'kitchenRefrigeratorImage';
  kitchenMicrowaveImage: string = 'kitchenMicrowaveImage';
  kitchenOpenGroundImage: string = 'kitchenOpenGroundImage';



  countertopsConditionOptions = ['Acceptable condition', 'Marginal condition', 'Defective', 'Other', 'N/A'];
  countertopsCommentsOptions = ['No cracks or burn spots', 'Minor cracks or burn spots present', 'Other', 'N/A'];
  cabinetsConditionOptions = ['Acceptable condition', 'Marginal condition', 'Defective', 'Other', 'N/A'];
  cabinetsCommentsOptions = ['Door hinge unstable', 'Handle missing', 'Missing or damaged door', 'Outdated – Need repair', 'Water damage under sink', 'Other', 'N/A'];
  plumbingConditionOptions = ['Acceptable condition – No leaks', 'Minor leak present – Need fix', 'Other', 'N/A'];
  faucetOptions = ['Acceptable condition and operable', 'Unstable or damaged – Need fix', 'Water leak through faucet – Need fix', 'Other', 'N/A'];
  functionalDrainageOptions = ['Satisfactory', 'Clogged drain – Need fix', 'Other', 'N/A'];
  floorMaterialOptions = ['Ceramic tiles', 'Vinyl sheet or tiles', 'Laminate', 'Engineered hardwood', 'Other', 'N/A'];
  floorConditionOptions = ['Acceptable condition', 'Marginal condition', 'Defective', 'Other', 'N/A'];
  floorCommentsOptions = ['Cracked or chipped tiles', 'Water damage present', 'Uneven flooring', 'Other', 'N/A'];
  wallsConditionOptions = ['Acceptable condition', 'Marginal condition', 'Cracked wall', 'Water damage present', 'Other', 'N/A'];
  ceilingsConditionOptions = ['Acceptable condition', 'Marginal condition', 'Cracked ceiling', 'Sign of previous water damage present', 'No current leak detected', 'Other', 'N/A'];
  electricalConditionOptions = ['All plugs and lights are functional at the time of inspection', 'Recommend GFCI outlet close to sink', 'Unstable or unsecure outlets – Need fix', 'Light fixture damaged or not working – Need fix', 'Other', 'N/A'];
  rangeOptions = ['Present', 'Partially operable', 'Unplugged', 'Other', 'N/A'];
  rangeConditionOptions =   ['Inspected and working at the time of inspection' , 'Some coils not working' , 'Some burners not working' , 'Cracked or chipped top plate' , 'Heavy oil residue present - Need cleanup (Fire Hazard)' , 'Other', 'N/A'];
  dishwasherOptions = ['Present' , 'Not Applicable' , 'Present – Not connected' , 'Outdated' , 'Other', 'N/A'];
  dishwasherConditionOptions = ['Inspected and working at the time of inspection' , 'Tested and NOT working – Need repair or replace' , 'Other', 'N/A'];
  microwaveStatusOptions = ['Built in with exhaust fan', 'Tested and working at the time of inspection', 'Other', 'N/A'];
  openGroundReversePolarityOptions = ['Yes', 'No', 'N/A'];

  rangeHoodFanOptons = ['Present' , 'Tested and working at the time of inspection' ,'Fan vented outside' , 'Built in with microwave' ,'Not vented outside' ,'Not applicable' ,'Fan very loud' ,'Grease on filter – Need cleanup' ,'Fan not working – Need fix' ,'Light not working – Need fix' ,'Other']
  refrigeratorOptiions = ['Present'  , 'Not Applicable' , 'Other'];
  refrigeratorConditionOptiions = ['Inspected and working at the time of inspection','Present but not working','Present but not connected','Water dispenser not working','Ice dispenser not working','Minor dent present on housing','Other','N/A'];



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
    this.kitchenDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      kitchens: this._formBuilder.array([this.createKitchenFormGroup()])
    });
  }

  createKitchenFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],

      kitchenCountertops: this._formBuilder.group({
        kitchenCountertopsCondition: [''],
        otherkitchenCountertopsCondition: [''],
        countertopsComments: [''],
        otherCountertopsComments: ['']
      }),

      kitchenCabinets: this._formBuilder.group({
        kitchenCabinetsCondition: [''],
        otherKitchenCabinetsCondition: [''],
        kitchenCabinetsComments: [''],
        otherKitchenCabinetsComments: ['']
      }),

      kitchenPlumbings: this._formBuilder.group({
        kitchenPlumbingsCondition: [''],
        otherKitchenPlumbingsCondition: [''],
        kitchenPlumbingsFaucet: [''],
        otherKitchenPlumbingsFaucet: [''],
        kitchenPlumbingsfunctionalDrainage: [''],
        otherKitchenPlumbingsFunctionalDrainage: ['']
      }),

      kitchenFloors: this._formBuilder.group({
        kitchenFloorMaterial: [''],
        otherkitchenFloorMaterial: [''],
        kitchenFloorCondition: [''],
        otherKitchenFloorCondition: [''],
        kitchenFloorComments: [''],
        otherKitchenFloorComments: ['']
      }),

      kitchenWalls: this._formBuilder.group({
        kitchenWallsCondition: [''],
        otherKitchenWallsCondition: ['']
      }),

      kitchenCeilings: this._formBuilder.group({
        kitchenCeilingsCondition: [''],
        otherKitchenCeilingsCondition: ['']
      }),

      kitchenElectricals: this._formBuilder.group({
        kitchenElectricalsCondition: [''],
        otherKitchenElectricalsCondition: ['']
      }),

      kitchenAppliances: this._formBuilder.group({
        kitchenAppliancesRange: [''],
        otherKitchenAppliancesRange: [''],
        kitchenAppliancesRangeCondition: [''],
        otherKitchenAppliancesCondition: ['']
      }),

      kitchenDishwashers: this._formBuilder.group({
        kitchenDishwasher: [''],
        otherKitchenDishwasher: [''],
        kitchenDishwashersCondition: [''],
        otherkitchenDishwashersCondition: ['']
      }),

      kitchenRangeHoodFans: this._formBuilder.group({
        kitchenRangeHoodFan: [''],
        otherKitchenRangeHoodFan: ['']
      }),

      kitchenRefrigerators: this._formBuilder.group({
        kitchenRefrigerator: [''],
        otherKitchenRefrigerator: [''],
        kitchenRefrigeratorCondition: [''],
        otherKitchenRefrigeratorCondition: ['']
      }),

      kitchenMicrowaves: this._formBuilder.group({
        kitchenMicrowave: [''],
        otherKitchenMicrowave: ['']
      }),
      kitchenOpenGroundReversePolarity: [''],
    });
  }

  // constructor(private _formBuilder: FormBuilder) {
  //   // this.kitchenDetails = this._formBuilder.group({
  //   //   kitchens: this._formBuilder.array([this.createKitchenFormGroup()])
  //   // });
  // }

  get kitchens(): FormArray {
    return this.kitchenDetails.get('kitchens') as FormArray;
  }


  addKitchen(): void {
    this.kitchens.push(this.createKitchenFormGroup());
  }

  removeKitchen(index: number): void {
    this.kitchens.removeAt(index);
  }

}

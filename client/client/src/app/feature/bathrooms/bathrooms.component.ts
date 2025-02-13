import { Component, Input, OnInit } from '@angular/core';
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
  selector: 'app-bathrooms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    ImageUploaderComponent
  ],
  templateUrl: './bathrooms.component.html',
  styleUrls: ['./bathrooms.component.scss']
})
export class BathroomsComponent implements OnInit {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() bathroomsDetails: FormGroup = this._formBuilder.group({});

  bathroomCeilingImage: string = 'bathroomCeilingImage';
  bathroomDoorImage: string = 'bathroomDoorImage';
  bathroomWindowsImage: string = 'bathroomWindowsImage';
  bathroomElectricalImage: string = 'bathroomElectricalImage';
  bathroomCounterCabinetImage: string = 'bathroomCounterCabinetImage';
  bathroomPlumbingImage: string = 'bathroomPlumbingImage';
  bathroomToiletImage: string = 'bathroomToiletImage';
  bathroomStandingShowerImage: string = 'bathroomStandingShowerImage';
  bathroomFaucetsImage: string = 'bathroomFaucetsImage';
  bathroomMoistureStainsPresentImage: string = 'bathroomMoistureStainsPresentImage';
  bathroomVentilationImage: string = 'bathroomVentilationImage';
  bathroomFloorImage: string = 'bathroomFloorImage';
  bathroomWallImage: string = 'bathroomWallImange';

  iiii: string ='iii';
  ffff: string = 'ffff';



  floorImage: string = 'floorImage';
  wallsImage: string = 'wallsImage';
  ceilingImage: string = 'ceilingImage';





floorMaterialOptions = ['Ceramic tiles', 'Laminate flooring', 'Engineered hardwood', 'Other', 'N/A'];
floorConditionOptions = ['Acceptable condition', 'Marginal condition', 'Damaged tiles', 'Water damage on floor', 'Other', 'N/A'];
wallMaterialOptions = ['Drywall and Tiles', 'Other', 'N/A'];
wallConditionOptions = ['Acceptable condition', 'Marginal condition', 'Sign of mold present on walls', 'Minor damage present on wall', 'Other', 'N/A'];

ceilingMaterialOptions = ['Drywall and paint', 'N/A'];
ceilingConditionOptions = ['Acceptable condition', 'Marginal condition', 'Sign of mold present on ceiling', 'Cracked ceiling', 'No current leak detected', 'Sign of previous leak noted, recommend monitor and repair if leaking continues in the future', 'Other', 'N/A'];


doorMaterialOptions = ['Hollow wood', 'Wood', 'Other', 'N/A'];
doorConditionOptions = ['Acceptable condition', 'Marginal condition', 'Damaged door', 'Not closing properly', 'Lock not working', 'Other', 'N/A'];


windowConditionOptions = ['Present and acceptable', 'Sign of mold present on window', 'Other', 'N/A'];


electricalOptions = ['All outlets and lights are functional', 'Some plugs or lights not working', 'GFCI outlet present', 'GFCI outlet not present - Recommended GFCI outlet close to water source', 'Other', 'N/A'];


counterCabinetOptions = ['Acceptable', 'Water damage present on counter', 'Damaged or Broken cabinets', 'Loose door hinges', 'Door handle missing', 'Other', 'N/A'];

sinkBasinOptions = ['Acceptable', 'Cracked sink', 'Other', 'N/A'];


plumbingOptions = ['Acceptable - No current leak detected', 'Sign of previous leak noted, recommend monitor and repair if leaking continues in the future', 'Other', 'N/A'];


toiletOptions = ['Acceptable - No leaks and Operable', 'Marginal condition', 'Flushing mechanism not working', 'Cracked toilet', 'Minor leak present', 'Other', 'N/A'];


bathtubOptions = ['Acceptable - No leaks and Operable', 'Minor rust present', 'Sign of mold present on walls', 'Other', 'N/A'];


standingShowerOptions = ['Acceptable', 'Marginal', 'Sign of previous leak noted, recommend monitor and repair if leaking continues in the future', 'Other', 'N/A'];


faucetOptions = ['Acceptable condition - No leaks', 'Loose handle', 'Damaged or missing handle', 'Sign of previous leak noted, recommend monitor and repair if leaking continues in the future', 'Shower head leak', 'Unstable shower faucet', 'Other', 'N/A'];
waterFlowOptions = ['Acceptable', 'Low water pressure', 'Other', 'N/A'];
moistureStainsOptions = ['No moisture stains present', 'Present throughout the ceilings', 'Other', 'N/A'];
heatSourceOptions = ['Central heating system', 'Baseboard heating system', 'No heat source present', 'Other', 'N/A'];


ventilationOptions = ['Ventilation fan present', 'No ventilation fan', 'Fan very noisy', 'Other', 'N/A'];



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
    this.bathroomsDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      bathrooms: this._formBuilder.array([this.createBathroomFormGroup()])
    });
  }

  get bathrooms(): FormArray {
    return this.bathroomsDetails.get('bathrooms') as FormArray;
  }

  createBathroomFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],


      bathroomFloors: this._formBuilder.group({
        bathroomFloorsMaterial: [''],
        otherBathroomFloorsMaterial: [''],
        bathroomFloorsCondition: [''],
        otherBathroomCondition: ['']
      }),

      bathroomWalls: this._formBuilder.group({
        bathroomsWallsMaterial: [''],
        otherBathromsWallsMaterial: [''],
        bathroomWallsCondition: [''],
        otherBathroomWallsCondition: ['']
      }),

      bathroomCeilings: this._formBuilder.group({
        bathroomCeilingsMaterial: [''],
        otherBathroomCeilingsMaterial: [''],
        bathroomCeilingsCondition: [''],
        otherBathroomCeilingsCondition: ['']
      }),

      bathroomDoors: this._formBuilder.group({
        bathroomDoorsMaterial: [''],
        otherBathroomDoorsMaterial: [''],
        bathroomDoorsCondition: [''],
        otherBathroomDoorsCondition: ['']
      }),

      bathroomWindows: this._formBuilder.group({
        bathroomWindowsMaterial: [''],
        otherBathroomWindowsMaterial: ['']
      }),

      bathroomElectricals: this._formBuilder.group({
        bathroomElectricalsMaterial: [''],
        otherBathroomElectricalsMaterial: ['']
      }),

      bathroomCounterCabinets: this._formBuilder.group({
        bathroomCounterCabinetsMaterial: [''],
        otherBathroomCounterCabinetsMaterial: ['']
      }),

      bathroomSinkBasins: this._formBuilder.group({
        bathroomSinkBasinsMaterial: [''],
        otherBathroomSinkBasinsMaterial: ['']
      }),

      bathroomPlumbings: this._formBuilder.group({
        bathroomPlumbingsMaterial: [''],
        otherBathroomPlumbingsMaterial: ['']
      }),

      bathroomToilets: this._formBuilder.group({
        bathroomToiletsMaterial: [''],
        otherbathroomToiletsMaterial: ['']
      }),

      bathroomBathtubs: this._formBuilder.group({
        bathroomBathtubsMaterial: [''],
        otherBathroomBathtubsMaterial: ['']
      }),

      bathroomStandingShowers: this._formBuilder.group({
        bathroomStandingShowersMaterial: [''],
        otherBathroomStandingShowersMaterial: ['']
      }),

      bathroomFaucets: this._formBuilder.group({
        bathroomFaucetsMaterial: [''],
        otherBathroomFaucetsMaterial: ['']
      }),

      bathroomWaterFlows: this._formBuilder.group({
        bathroomWaterFlowsMaterial: [''],
        otherBathroomWaterFlowsMaterial: ['']
      }),

      bathroomMoistureStains: this._formBuilder.group({
        bathroomMoistureStainsMaterial: [''],
        otherBathroomMoistureStainsMaterial: ['']
      }),

      bathroomHeatSources: this._formBuilder.group({
        bathroomHeatSourcesMaterial: [''],
        otherBathroomHeatSourcesMaterial: ['']
      }),

      bathroomVentilations: this._formBuilder.group({
        bathroomVentilationsMaterial: [''],
        otherbathroomVentilationsMaterial: ['']
      }),
      bathroomComments: ['']
    });
  }

  addBathroom(): void {
    this.bathrooms.push(this.createBathroomFormGroup());
  }

  removeBathroom(index: number): void {
    this.bathrooms.removeAt(index);
  }
}


// getBathroomUri

import { Component, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';
import { ReplaySubject, takeUntil } from 'rxjs';

import { ExteriorWall} from '../../../../src/app/feature/models/feature.model';
import { InspectionUpdatesService } from '../../shared/services/check-updates/services/inspection-updates.service';

import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';


@Component({
  selector: 'app-exterior',
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
  templateUrl: './exterior.component.html',
  styleUrl: './exterior.component.scss'
})
export class ExteriorComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  inspectionUpdate: any;
  @Input() exteriorDetails: FormGroup = this._formBuilder.group({});

  exteriorWallImage: string = 'exteriorWallImage';
  exteriorFoundationImage: string = 'exteriorFoundationImage';
  exteriorInteriorFoundationImage: string = 'exteriorInteriorFoundationImage';
  exteriorCracksImage: string = 'exteriorCracksImage';
  exteriorDoorImage: string = 'exteriorDoorImage';
  exteriorSideDoorImage: string = 'exteriorSideDoorImage';
  exteriorPatioDoorImage: string = 'exteriorPatioDoorImage';
  exteriorPatioScreenDoorImage: string = 'exteriorPatioScreenDoorImage';
  exteriorGuttersRoofsRoofDrainageImage: string = 'exteriorGuttersRoofsRoofDrainageImage';
  exteriorWindowsMaterialImage: string = 'exteriorWindowsMaterialImage';
  exteriorWindowScreensImage: string = 'exteriorWindowScreensImage';
  exteriorBasementWindowsImage: string = 'exteriorBasementWindowsImage';
  exteriorGasMeterImage: string = 'exteriorGasMeterImage';
  exteriorOutletsAndLightsImage: string = 'exteriorOutletsAndLightsImage';
  exteriorHouseBibsImage: string = 'exteriorHouseBibsImage';
  exteriorAirConditioningImage: string = 'exteriorAirConditioningImage';



exteriorWallTypeOptions = ['Brick' , 'Brick and Stones' , 'Brick and Aluminum siding' , 'Brick and Vinyl siding' , 'Aluminum siding' , 'Vinyl siding' , 'Other', 'N/A']
exteriorWallConditionOptions = ['Acceptable' , 'Marginal' , 'Cracked brick wall' , 'Mortar deterioration' , 'Efflorescence (crystal deposit of salts)' , 'Spalling concrete' , 'Bulging bricks' , 'Damaged bricks' , 'Cracking at concrete foundation' , 'Missing and (or) Damaged sidings' , 'Other', 'N/A']
foundationTypeOptions = ['Poured concrete' , 'Concrete blocks' , 'Other', 'N/A']
foundationExteriorConditionOptions = ['Acceptable' , 'Marginal' , 'Other', 'N/A']
foundationExteriorCommentsOptions = ['Multiple hairline cracks noted' , 'No major cracks found' , 'Other', 'N/A']
foundationInteriorConditionOptions = ['Acceptable' , 'Marginal' , 'Other', 'N/A']
foundationInteriorCommentsOptions = ['Multiple hairline cracks noted Unable to inspect the inside of foundation wall – Finished basement' , 'No current leak detected' , 'Sign of previous leak noted, recommend monitor and repair if leaking continues in the future' , 'Other', 'N/A']
cracksVisiblePortionsOnlyOptions = ['The foundation wall fully covered by drywall' , 'No access to physically check the wall for cracks' , 'No signs of moisture found while checking with thermal camera' , 'Other', 'N/A']
coveredFoundationWallsOptions = ['Most foundation walls covered by wall materials (Finished basement)' , 'Other', 'N/A']
exteriorDoorMainEntryDoorOptions = ['Metal with glass' , 'Wood with glass' , 'Fiber glass' , 'Wood' , 'Other', 'N/A']
exteriorDoorMainEntryDoorConditionOptions = ['Acceptable condition' , 'Marginal condition' , 'Damage present on door' , 'Door not closing properly' , 'Lock not working properly' , 'Other', 'N/A']
exteriorDoorMainEntryDoorWeatherStrippingOptions = ['Present and Acceptable condition' , 'Not present', 'Need to install' , 'Damaged, need fix', 'N/A']
exteriorDoorStormDoorOptions = ['Present', 'N/A']
exteriorDoorStormDoorConditionsOptions = ['Acceptable condition' , 'Marginal condition' , 'Auto closing not working' , 'Damage door' , 'Other', 'N/A']
exteriorDoorDoorBellOptions = ['Present and working' , 'Not present' , 'Present notworking' , 'Other', 'N/A']
exteriorDoorDoorBellTypeOptions = ['Hard wired' , 'Wireless' , 'Other', 'N/A']
exteriorDoorSideDoorOptions = ['Metal with glass' , 'Wood with glass' , 'Other', 'N/A']
exteriorDoorSideDoorConditionsOptions = ['Acceptable condition' , 'Marginal condition' , 'Other', 'N/A']
exteriorDoorSideDoorWeatherStrippingOptions = ['Present and Acceptable condition' , 'Damaged', 'Need fix' , 'Not present' , 'Other', 'N/A']
exteriorDoorPatioDoorOptions = ['Vinyl sliding glass doors' , 'Wood framed door' , 'Other', 'N/A']
exteriorDoorPatioDoorConditionOptions = ['Acceptable' , 'Marginal' , 'Other', 'N/A']
exteriorDoorPatioDoorCommentsOptions = ['Slides and lock properly' , 'Not sliding – Need alignment and lubrication' , 'Not locking properly' , 'Other', 'N/A']
exteriorDoorPatioScreenDoorOptions = ['Fiberglass' , 'Aluminum' , 'Other', 'N/A']
exteriorDoorPatioScreenDoorConditionsOptions = ['Acceptable condition' , 'Marginal condition' , 'Other', 'N/A']
exteriorDoorPatioScreenDoorCommentsOptions = ['Slides and lock properly' , 'Not sliding properly– Need fix' , 'Not locking properly' , 'No damage on screens' , 'Damaged or Torn screen' , 'Missing screen door', 'Other', 'N/A' ]
guttersMaterialsOptions = ['Aluminium' , 'Plastic' , 'Other', 'N/A']
guttersMaterialsCondtionOptions = ['Acceptable condition' , 'Marginal condition' , 'Defective, Need repair' , 'Other', 'N/A']
guttersMaterialsLeakingOptions = ['No sign of leaks' , 'Sign of leak present' , 'Other', 'N/A']
guttersMaterialsAttachmentsOptions = ['Not needed' , 'Needed' , 'Other', 'N/A']
guttersMaterialsExtensionNeededOptions = ['No extension needed' , 'Yes' , 'Other', 'N/A']
guttersMaterialsCommentsOptions = ['Discharge-below-grade was satisfying the previous standard when the house was built. However, we need to update it to satisfy current local municipality requirements.  Check with the local authority if the roof water must be drained above ground, 4-6 feet away from building' , 'Other', 'N/A']
guttersWindowsApproximateAgeOptions = ['Unknown' , 'Other', 'N/A']
guttersWindowsMaterialAndTypeOptions = ['Aluminum slider' , 'Aluminum casement' , 'Vinyl slider' , 'Vinyl casement' , 'Wood' , 'Other', 'N/A']
guttersWindowsMaterialAndTypeConditionsOptions = ['Acceptable condition' , 'Marginal Condition' , 'Other', 'N/A']
guttersWindowsMaterialAndTypeCommentsOptions = ['All windows operating properly' , 'Open/Close mechanism damaged' , 'Rubber seal broken' , 'Damaged window or broken glass' , 'Other', 'N/A']
guttersWindowScreensOptions = ['Fiberglass' , 'Aluminum', 'N/A']
guttersWindowScreensConditionOptions = ['Acceptable condition' , 'Marginal condition' , 'Other', 'N/A']
guttersWindowScreensCommentsOptions = ['No damage on screens' , 'Minor damage present on screens' , 'Missing window screens' , 'Torn window screens' , 'Other', 'N/A']
guttersBasementWindowsOptions = []
guttersBasementWindowsApproximateAgeOptions = []
guttersBasementWindowsMaterialOptions = ['Aluminum slider' , 'Vinyl slider' , 'Wood' , 'Other', 'N/A']
guttersBasementWindowsMaterialConditionsOptions = ['Acceptable condition' , 'Marginal Condition' , 'Other', 'N/A']
guttersBasementWindowsMaterialCommentsOptions = ['Slides and lock properly' , 'Not locking properly' , 'Metal frame rusted' , 'Damaged window or broken glass' , 'Other', 'N/A' ]
guttersGasMeterTypeOptions = ['Exterior surface mount',  'Other', 'N/A']
guttersGasMeterTypeConditionOptions = ['Acceptable' , 'Turned off by Owner' , 'Other', 'N/A']

guttersGasMeterTypeCommentsOptions = []

guttersElectricalOptions = ['All outlets and light fixtures are functional at the time of inspection' , '110 VAC GFCI / 110 VAC – recommend GFCI' , 'Unstable or unsecure outlets – Need fix' , 'Light fixture damaged or not working – Need fix' , 'Other', 'N/A']

guttersExteriorHouseBibsTypeOptions = ['Rotary' , 'Quarter turn' , 'Other', 'N/A']

guttersExteriorHouseBibsConditionOptions = ['Acceptable' , 'Marginal' , 'Other', 'N/A']

guttersExteriorHouseBibsCommentsOptions = ['Tested and working' , 'Not present' , 'Damaged' , 'Minor leak noted' , 'Not operable' , 'Worn out washer' , 'Broken handle' , 'Other', 'N/A']

guttersExteriorManufacturerOptions = []
guttersExteriorManufacturerApproximateOptions = []

guttersExteriorManufacturerAreaServedOptions = ['Whole building' , 'Partial building' , 'Individual rooms' , 'Other', 'N/A']

guttersExteriorFuelTypeOptions = ['110 V' , 'Oil' , 'Other', 'N/A']

guttersExteriorManufacturerConditionsOptions = ['Acceptable condition' , 'Marginal condition' , 'Other', 'N/A']

guttersACExteriorManufacturerCondenserFinsOptions = ['Acceptable condition' , 'Marginal condition – Minor damage or rust present' , 'Recommend removing all debris off the fins' , 'Other', 'N/A']

guttersACExteriorManufacturerCabinetHousingOptions = ['Acceptable condition' , 'Marginal condition - Minor damage or rust present' , 'Other', 'N/A']

guttersACExteriorManufacturerRefrigentLineOptions = ['Line fully insulated' , 'Line partially insulated' , 'Insulation damaged – New insulation needed' , 'Other', 'N/A']

guttersACExteriorManufacturerACSystemOperationOptions = ['Tested and working at the time of inspection' ,
  'Not tested due to outside weather conditions' ,
  'Tested and not working at the time of inspection' ,
  'Need repair or replace',
  'N/A'
  ]


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


  private initializeForms(): void {
    this.exteriorDetails = this.createExteriorDetailsFormGroup();

  }

  getUpdatesTrigger() {
    this.inspectionUpdatesService.currentUpdate.subscribe(
      update => {
        this.inspectionUpdate = update;
          if(this.inspectionUpdate.exteriorInfo && (this.inspectionUpdate._id === this.requestId)) {
            this.getExteriorInformation();
          }
      },
      error => {
        console.error('Error fetching inspection update:', error);
      }
    );
  }

  private createExteriorDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      exteriorWall: this._formBuilder.array([this.createExteriorWallsFormGroup()]),
      foundation: this._formBuilder.group({
        foundationType: [['']],
        otherFoundationType: [''],
        exteriorFoundationCondition: [['']],
        otherExteriorFoundationCondition: [''],
        foundationComments: [['']],
        otherFoundationComments: [''],

        interiorFoundationCondition: [['']],
        otherInteriorFoundationCondition: [''],

        interiorFoundationComments: [['']],
        otherInteriorFoundationComments: [''],

        cracks: [['']],
        otherCracks: [['']],
        coveredFoundationWalls: [['']],
        otherCoveredFoundationWalls: [['']],
        coveredFoundationWallsComments: [['']]
      }),

      exteriorExteriorDoor: this._formBuilder.group({
        exteriorDoorMainEntryDoor: [''],
        otherExteriorDoorMainEntryDoor: [''],
        exteriorDoorDoorCondition: [''],
        otherExteriorDoorDoorCondition: [''],
        exteriorDoorWeatherStripping: [''],
        exteriorDoorStormDoor: [''],
        exteriorDoorStormDoorCondition: [''],
        otherExteriorDoorStormDoorCondition: [''],
        exteriorDoorDoorBell: [''],
        otherExteriorDoorDoorBell: [''],
        exteriorDoorDoorBellType: [''],
        otherExteriorDoorDoorBellType: ['']
      }),

      exteriorSideDoor: this._formBuilder.group({
        exteriorSideDoors: [''],
        otherExteriorSideDoors: [''],
        exteriorSideDoorsDoorCondition: [''],
        otherExteriorSideDoorsDoorCondition: [''],
        exteriorSideDoorsWeatherStripping: [''],
        otherExteriorSideDoorsWeatherStripping: ['']
      }),

      exteriorPatioDoor: this._formBuilder.group({
        exteriorPatioDoors: [''],
        otherExteriorPatioDoors: [''],
        exteriorPatioDoorsCondition: [''],
        otherExteriorPatioDoorsCondition: [''],
        exteriorPatioDoorsComments: [''],
        otherExteriorPatioDoorsComments: ['']
      }),

      exteriorPatioScreenDoor: this._formBuilder.group({
        exteriorPatioScreensDoors: [''],
        otherExteriorPatioScreensDoors: [''],
        exteriorPatioDoorScreensCondition: [''],
        otherExteriorPatioDoorScreesCondition: [''],
        exteriorPatioDoorScreensComments: [''],
        otherExteriorPatioDoorScreensComments: ['']
      }),

      exteriorDoorComments: [''],

      gutter: this._formBuilder.group({
        guttersDownspoutsRoofDrainageMaterial: [''],
        otherGuttersDownspoutsRoofDrainageMaterial: [''],
        guttersDownspoutsRoofDrainageCondition: [''],
        otherGuttersDownspoutsRoofDrainageCondition: [''],
        guttersDownspoutsRoofDrainageLeaking: [''],
        otherGuttersDownspoutsRoofDrainageLeaking: [''],
        guttersDownspoutsRoofDrainageAttachment: [''],
        otherGuttersDownspoutsRoofDrainageAttachment: [''],
        guttersDownspoutsRoofDrainageExtensionNeeded: [''],
        otherGuttersDownspoutsRoofDrainageExtensionNeeded: [''],
        guttersDownspoutsRoofDrainageComments: [''],
        otherGuttersDownspoutsRoofDrainageComments: ['']
      }),

      window: this._formBuilder.group({
        windowsApproximateAge: [''],
        otherWindowsApproximateAge: [''],
        windowsMaterialAndType: [''],
        otherWindowsMaterialAndType: [''],
        windowsCondition: [''],
        otherWindowsCondition: [''],
        windowsComments: [''],
        otherWindowsComments: [''],
        windowScreens: [''],
        windowScreensCondition: [''],
        otherWindowScreensCondition: [''],
        windowScreensComments: [''],
        otherWindowScreensComments: [''],
        basementWindows: [''],
        basementWindowsApproximateAge: [''],
        basementWindowsMaterial: [''],
        otherBasementWindowsMaterial: [''],
        basementWindowsCondition: [''],
        otherBasementWindowsCondition: [''],
        basementWindowsComments: [''],
        otherBasementWindowsComments: [''],
      }),
      gasMeter: this._formBuilder.array([this.createGasMeterFormGroup()]),

      electricity: this._formBuilder.group({
        exteriorOutletsAndLights: [''],
        otherExteriorOutletsAndLights: ['']
      }),

      exteriorHouseBibs: this._formBuilder.group({
        exteriorHouseBibsType: [''],
        otherExteriorHouseBibsType: [''],
        exteriorHouseBibsCondition: [''],
        otherExteriorHouseBibsCondition: [''],
        exteriorHouseBibsComments: [''],
        otherExteriorHouseBibsComments: ['']
      }),
      airCondition: this._formBuilder.array([this.createAirConditionFormGroup()]),

    });
  }


  ngOnInit(): void {
    this.getUpdatesTrigger();
  }

  get exteriorWalls(): FormArray {
    return this.exteriorDetails.get('exteriorWall') as FormArray;
  }

  get foundations(): FormArray {
    return this.exteriorDetails.get('foundation') as FormArray;
  }

  get gasMeters(): FormArray {
    return this.exteriorDetails.get('gasMeter') as FormArray;
  }

  get airConditions(): FormArray {
    return this.exteriorDetails.get('airCondition') as FormArray;
  }

  createExteriorWallsFormGroup(): FormGroup {
    return this._formBuilder.group({
      exteriorWallType: [['']],
      otherExteriorWallType: [''],
      exteriorWallCondition: [['']],
      otherExteriorWallCondition: [''],
      exteriorWallComments: [['']]
    });
  }

  createGasMeterFormGroup(): FormGroup {
    return this._formBuilder.group({
      gasMeterType: [''],
      otherGasMeterType: [''],
      gasMeterCondition: [''],
      otherGasMeterCondition: [''],
      gasMeterComments: ['']
    });
  }

  createAirConditionFormGroup(): FormGroup {
    return this._formBuilder.group({
      airConditionsManufacturer: [''],
      airConditionsApproximateAge: [''],
      airConditionsAreaServed: [''],
      otherAirConditionsAreaServed: [''],
      airConditionsFuelType: [''],
      otherAirConditionsFuelType: [''],
      airConditionsCondition: [''],
      otherAirConditionsCondition: [''],
      airConditionsCondenserFins: [''],
      otherAirConditionsCondenserFins: [''],
      airConditionsCabinetHousing: [''],
      otherAirConditionsCabinetHousing: [''],
      airConditionsRefrigerantLineInsulation: [''],
      otherAirConditionsRefrigerantLineInsulation: [''],
      airConditionsACSystemOperation: [''],
      airConditionsComments: ['']
    });
  }


  addExteriorWalls(): void {
    this.exteriorWalls.push(this.createExteriorWallsFormGroup());
  }

  addGasMeters(): void {
    this.gasMeters.push(this.createGasMeterFormGroup());
  }

  addAirConditions(): void {
    this.airConditions.push(this.createAirConditionFormGroup());
  }

  removeExteriorWalls(index: number): void {
    this.exteriorWalls.removeAt(index);
  }

  removeGasMeters(index: number): void {
    this.gasMeters.removeAt(index);
  }

  removeAirConditions(index: number): void {
    this.airConditions.removeAt(index);
  }



  getExteriorInformation() {
    this.featureService.getExteriorApi(this.requestId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response: any) => {
        if (response.message === 200 && response.exteriorDetails) {
          const exteriorData = response.exteriorDetails;
          // console.log('exteriorData', exteriorData);
          const exteriorDetailsFormGroup = this.mapExteriorDetailsFormGroup(exteriorData);
          this.exteriorDetails.patchValue(exteriorDetailsFormGroup.value);
        }
      });
  }

  private mapExteriorDetailsFormGroup(exteriorData: any): FormGroup {
    const exteriorWallArray = this._formBuilder.array(
      exteriorData.exteriorWall.map((wall: ExteriorWall) => this._formBuilder.group({
        exteriorWallType: this._formBuilder.control({ value: wall.exteriorWallType, disabled: false }),
        otherExteriorWallType: this._formBuilder.control({ value: wall.otherExteriorWallType, disabled: false }),
        exteriorWallCondition: this._formBuilder.control({ value: wall.exteriorWallCondition, disabled: false }),
        otherExteriorWallCondition: this._formBuilder.control({ value: wall.otherExteriorWallCondition, disabled: false }),
        exteriorWallComments: this._formBuilder.control({ value: wall.exteriorWallComments, disabled: false })
      }))
    );

    const gasMeterArray = this._formBuilder.array(
      exteriorData.gasMeter.map((meter: any) => this._formBuilder.group({
        gasMeterType: this._formBuilder.control({ value: meter.gasMeterType, disabled: false }),
        otherGasMeterType: this._formBuilder.control({ value: meter.otherGasMeterType, disabled: false }),
        gasMeterCondition: this._formBuilder.control({ value: meter.gasMeterCondition, disabled: false }),
        otherGasMeterCondition: this._formBuilder.control({ value: meter.otherGasMeterCondition, disabled: false }),
        gasMeterComments: this._formBuilder.control({ value: meter.gasMeterComments, disabled: false })
      }))
    );

    const airConditionArray = this._formBuilder.array(
      exteriorData.airCondition.map((ac: any) => this._formBuilder.group({
        airConditionsManufacturer: this._formBuilder.control({ value: ac.airConditionsManufacturer, disabled: false }),
        airConditionsApproximateAge: this._formBuilder.control({ value: ac.airConditionsApproximateAge, disabled: false }),
        airConditionsAreaServed: this._formBuilder.control({ value: ac.airConditionsAreaServed, disabled: false }),
        otherAirConditionsAreaServed: this._formBuilder.control({ value: ac.otherAirConditionsAreaServed, disabled: false }),
        airConditionsFuelType: this._formBuilder.control({ value: ac.airConditionsFuelType, disabled: false }),
        otherAirConditionsFuelType: this._formBuilder.control({ value: ac.otherAirConditionsFuelType, disabled: false }),
        airConditionsCondition: this._formBuilder.control({ value: ac.airConditionsCondition, disabled: false }),
        otherAirConditionsCondition: this._formBuilder.control({ value: ac.otherAirConditionsCondition, disabled: false }),
        airConditionsCondenserFins: this._formBuilder.control({ value: ac.airConditionsCondenserFins, disabled: false }),
        otherAirConditionsCondenserFins: this._formBuilder.control({ value: ac.otherAirConditionsCondenserFins, disabled: false }),
        airConditionsCabinetHousing: this._formBuilder.control({ value: ac.airConditionsCabinetHousing, disabled: false }),
        otherAirConditionsCabinetHousing: this._formBuilder.control({ value: ac.otherAirConditionsCabinetHousing, disabled: false }),
        airConditionsRefrigerantLineInsulation: this._formBuilder.control({ value: ac.airConditionsRefrigerantLineInsulation, disabled: false }),
        otherAirConditionsRefrigerantLineInsulation: this._formBuilder.control({ value: ac.otherAirConditionsRefrigerantLineInsulation, disabled: false }),
        airConditionsACSystemOperation: this._formBuilder.control({ value: ac.airConditionsACSystemOperation, disabled: false }),
        airConditionsComments: this._formBuilder.control({ value: ac.airConditionsComments, disabled: false })
      }))
    );

    return this._formBuilder.group({
      exteriorWall: exteriorWallArray,
      foundation: this._formBuilder.group({
        foundationType: this._formBuilder.control({ value: exteriorData.foundation.foundationType, disabled: false }),
        otherFoundationType: this._formBuilder.control({ value: exteriorData.foundation.otherFoundationType, disabled: false }),
        exteriorFoundationCondition: this._formBuilder.control({ value: exteriorData.foundation.exteriorFoundationCondition, disabled: false }),
        otherExteriorFoundationCondition: this._formBuilder.control({ value: exteriorData.foundation.otherExteriorFoundationCondition, disabled: false }),
        foundationComments: this._formBuilder.control({ value: exteriorData.foundation.foundationComments, disabled: false }),
        otherFoundationComments: this._formBuilder.control({ value: exteriorData.foundation.otherFoundationComments, disabled: false }),
        interiorFoundationCondition: this._formBuilder.control({ value: exteriorData.foundation.interiorFoundationCondition, disabled: false }),
        otherInteriorFoundationCondition: this._formBuilder.control({ value: exteriorData.foundation.otherInteriorFoundationCondition, disabled: false }),
        interiorFoundationComments: this._formBuilder.control({ value: exteriorData.foundation.interiorFoundationComments, disabled: false }),
        otherInteriorFoundationComments: this._formBuilder.control({ value: exteriorData.foundation.otherInteriorFoundationComments, disabled: false }),
        cracks: this._formBuilder.control({ value: exteriorData.foundation.cracks, disabled: false }),
        otherCracks: this._formBuilder.control({ value: exteriorData.foundation.otherCracks, disabled: false }),
        coveredFoundationWalls: this._formBuilder.control({ value: exteriorData.foundation.coveredFoundationWalls, disabled: false }),
        otherCoveredFoundationWalls: this._formBuilder.control({ value: exteriorData.foundation.otherCoveredFoundationWalls, disabled: false }),
        coveredFoundationWallsComments: this._formBuilder.control({ value: exteriorData.foundation.coveredFoundationWallsComments, disabled: false })
      }),
      exteriorExteriorDoor: this._formBuilder.group({
        exteriorDoorMainEntryDoor: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.exteriorDoorMainEntryDoor, disabled: false }),
        otherExteriorDoorMainEntryDoor: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.otherExteriorDoorMainEntryDoor, disabled: false }),
        exteriorDoorDoorCondition: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.exteriorDoorDoorCondition, disabled: false }),
        otherExteriorDoorDoorCondition: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.otherExteriorDoorDoorCondition, disabled: false }),
        exteriorDoorWeatherStripping: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.exteriorDoorWeatherStripping, disabled: false }),
        exteriorDoorStormDoor: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.exteriorDoorStormDoor, disabled: false }),
        exteriorDoorStormDoorCondition: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.exteriorDoorStormDoorCondition, disabled: false }),
        otherExteriorDoorStormDoorCondition: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.otherExteriorDoorStormDoorCondition, disabled: false }),
        exteriorDoorDoorBell: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.exteriorDoorDoorBell, disabled: false }),
        otherExteriorDoorDoorBell: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.otherExteriorDoorDoorBell, disabled: false }),
        exteriorDoorDoorBellType: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.exteriorDoorDoorBellType, disabled: false }),
        otherExteriorDoorDoorBellType: this._formBuilder.control({ value: exteriorData.exteriorExteriorDoor.otherExteriorDoorDoorBellType, disabled: false })
      }),
      exteriorSideDoor: this._formBuilder.group({
        exteriorSideDoors: this._formBuilder.control({ value: exteriorData.exteriorSideDoor.exteriorSideDoors, disabled: false }),
        otherExteriorSideDoors: this._formBuilder.control({ value: exteriorData.exteriorSideDoor.otherExteriorSideDoors, disabled: false }),
        exteriorSideDoorsDoorCondition: this._formBuilder.control({ value: exteriorData.exteriorSideDoor.exteriorSideDoorsDoorCondition, disabled: false }),
        otherExteriorSideDoorsDoorCondition: this._formBuilder.control({ value: exteriorData.exteriorSideDoor.otherExteriorSideDoorsDoorCondition, disabled: false }),
        exteriorSideDoorsWeatherStripping: this._formBuilder.control({ value: exteriorData.exteriorSideDoor.exteriorSideDoorsWeatherStripping, disabled: false }),
        otherExteriorSideDoorsWeatherStripping: this._formBuilder.control({ value: exteriorData.exteriorSideDoor.otherExteriorSideDoorsWeatherStripping, disabled: false })
      }),
      exteriorPatioDoor: this._formBuilder.group({
        exteriorPatioDoors: this._formBuilder.control({ value: exteriorData.exteriorPatioDoor.exteriorPatioDoors, disabled: false }),
        otherExteriorPatioDoors: this._formBuilder.control({ value: exteriorData.exteriorPatioDoor.otherExteriorPatioDoors, disabled: false }),
        exteriorPatioDoorsCondition: this._formBuilder.control({ value: exteriorData.exteriorPatioDoor.exteriorPatioDoorsCondition, disabled: false }),
        otherExteriorPatioDoorsCondition: this._formBuilder.control({ value: exteriorData.exteriorPatioDoor.otherExteriorPatioDoorsCondition, disabled: false }),
        exteriorPatioDoorsComments: this._formBuilder.control({ value: exteriorData.exteriorPatioDoor.exteriorPatioDoorsComments, disabled: false }),
        otherExteriorPatioDoorsComments: this._formBuilder.control({ value: exteriorData.exteriorPatioDoor.otherExteriorPatioDoorsComments, disabled: false })
      }),
      exteriorPatioScreenDoor: this._formBuilder.group({
        exteriorPatioScreensDoors: this._formBuilder.control({ value: exteriorData.exteriorPatioScreenDoor.exteriorPatioScreensDoors, disabled: false }),
        otherExteriorPatioScreensDoors: this._formBuilder.control({ value: exteriorData.exteriorPatioScreenDoor.otherExteriorPatioScreensDoors, disabled: false }),
        exteriorPatioDoorScreensCondition: this._formBuilder.control({ value: exteriorData.exteriorPatioScreenDoor.exteriorPatioDoorScreensCondition, disabled: false }),
        otherExteriorPatioDoorScreesCondition: this._formBuilder.control({ value: exteriorData.exteriorPatioScreenDoor.otherExteriorPatioDoorScreesCondition, disabled: false }),
        exteriorPatioDoorScreensComments: this._formBuilder.control({ value: exteriorData.exteriorPatioScreenDoor.exteriorPatioDoorScreensComments, disabled: false }),
        otherExteriorPatioDoorScreensComments: this._formBuilder.control({ value: exteriorData.exteriorPatioScreenDoor.otherExteriorPatioDoorScreensComments, disabled: false })
      }),
      exteriorDoorComments: this._formBuilder.control({ value: exteriorData.exteriorDoorComments, disabled: false }),
      gutter: this._formBuilder.group({
        guttersDownspoutsRoofDrainageMaterial: this._formBuilder.control({ value: exteriorData.gutter.guttersDownspoutsRoofDrainageMaterial, disabled: false }),
        otherGuttersDownspoutsRoofDrainageMaterial: this._formBuilder.control({ value: exteriorData.gutter.otherGuttersDownspoutsRoofDrainageMaterial, disabled: false }),
        guttersDownspoutsRoofDrainageCondition: this._formBuilder.control({ value: exteriorData.gutter.guttersDownspoutsRoofDrainageCondition, disabled: false }),
        otherGuttersDownspoutsRoofDrainageCondition: this._formBuilder.control({ value: exteriorData.gutter.otherGuttersDownspoutsRoofDrainageCondition, disabled: false }),
        guttersDownspoutsRoofDrainageLeaking: this._formBuilder.control({ value: exteriorData.gutter.guttersDownspoutsRoofDrainageLeaking, disabled: false }),
        otherGuttersDownspoutsRoofDrainageLeaking: this._formBuilder.control({ value: exteriorData.gutter.otherGuttersDownspoutsRoofDrainageLeaking, disabled: false }),
        guttersDownspoutsRoofDrainageAttachment: this._formBuilder.control({ value: exteriorData.gutter.guttersDownspoutsRoofDrainageAttachment, disabled: false }),
        otherGuttersDownspoutsRoofDrainageAttachment: this._formBuilder.control({ value: exteriorData.gutter.otherGuttersDownspoutsRoofDrainageAttachment, disabled: false }),
        guttersDownspoutsRoofDrainageExtensionNeeded: this._formBuilder.control({ value: exteriorData.gutter.guttersDownspoutsRoofDrainageExtensionNeeded, disabled: false }),
        otherGuttersDownspoutsRoofDrainageExtensionNeeded: this._formBuilder.control({ value: exteriorData.gutter.otherGuttersDownspoutsRoofDrainageExtensionNeeded, disabled: false }),
        guttersDownspoutsRoofDrainageComments: this._formBuilder.control({ value: exteriorData.gutter.guttersDownspoutsRoofDrainageComments, disabled: false }),
        otherGuttersDownspoutsRoofDrainageComments: this._formBuilder.control({ value: exteriorData.gutter.otherGuttersDownspoutsRoofDrainageComments, disabled: false })
      }),
      window: this._formBuilder.group({
        windowsApproximateAge: this._formBuilder.control({ value: exteriorData.window.windowsApproximateAge, disabled: false }),
        otherWindowsApproximateAge: this._formBuilder.control({ value: exteriorData.window.otherWindowsApproximateAge, disabled: false }),
        windowsMaterialAndType: this._formBuilder.control({ value: exteriorData.window.windowsMaterialAndType, disabled: false }),
        otherWindowsMaterialAndType: this._formBuilder.control({ value: exteriorData.window.otherWindowsMaterialAndType, disabled: false }),
        windowsCondition: this._formBuilder.control({ value: exteriorData.window.windowsCondition, disabled: false }),
        otherWindowsCondition: this._formBuilder.control({ value: exteriorData.window.otherWindowsCondition, disabled: false }),
        windowsComments: this._formBuilder.control({ value: exteriorData.window.windowsComments, disabled: false }),
        otherWindowsComments: this._formBuilder.control({ value: exteriorData.window.otherWindowsComments, disabled: false }),
        windowScreens: this._formBuilder.control({ value: exteriorData.window.windowScreens, disabled: false }),
        windowScreensCondition: this._formBuilder.control({ value: exteriorData.window.windowScreensCondition, disabled: false }),
        otherWindowScreensCondition: this._formBuilder.control({ value: exteriorData.window.otherWindowScreensCondition, disabled: false }),
        windowScreensComments: this._formBuilder.control({ value: exteriorData.window.windowScreensComments, disabled: false }),
        otherWindowScreensComments: this._formBuilder.control({ value: exteriorData.window.otherWindowScreensComments, disabled: false }),
        basementWindows: this._formBuilder.control({ value: exteriorData.window.basementWindows, disabled: false }),
        basementWindowsApproximateAge: this._formBuilder.control({ value: exteriorData.window.basementWindowsApproximateAge, disabled: false }),
        basementWindowsMaterial: this._formBuilder.control({ value: exteriorData.window.basementWindowsMaterial, disabled: false }),
        otherBasementWindowsMaterial: this._formBuilder.control({ value: exteriorData.window.otherBasementWindowsMaterial, disabled: false }),
        basementWindowsCondition: this._formBuilder.control({ value: exteriorData.window.basementWindowsCondition, disabled: false }),
        otherBasementWindowsCondition: this._formBuilder.control({ value: exteriorData.window.otherBasementWindowsCondition, disabled: false }),
        basementWindowsComments: this._formBuilder.control({ value: exteriorData.window.basementWindowsComments, disabled: false }),
        otherBasementWindowsComments: this._formBuilder.control({ value: exteriorData.window.otherBasementWindowsComments, disabled: false })
      }),
      gasMeter: gasMeterArray,
      electricity: this._formBuilder.group({
        exteriorOutletsAndLights: this._formBuilder.control({ value: exteriorData.electricity.exteriorOutletsAndLights, disabled: false }),
        otherExteriorOutletsAndLights: this._formBuilder.control({ value: exteriorData.electricity.otherExteriorOutletsAndLights, disabled: false })
      }),
      exteriorHouseBibs: this._formBuilder.group({
        exteriorHouseBibsType: this._formBuilder.control({ value: exteriorData.exteriorHouseBibs.exteriorHouseBibsType, disabled: false }),
        otherExteriorHouseBibsType: this._formBuilder.control({ value: exteriorData.exteriorHouseBibs.otherExteriorHouseBibsType, disabled: false }),
        exteriorHouseBibsCondition: this._formBuilder.control({ value: exteriorData.exteriorHouseBibs.exteriorHouseBibsCondition, disabled: false }),
        otherExteriorHouseBibsCondition: this._formBuilder.control({ value: exteriorData.exteriorHouseBibs.otherExteriorHouseBibsCondition, disabled: false }),
        exteriorHouseBibsComments: this._formBuilder.control({ value: exteriorData.exteriorHouseBibs.exteriorHouseBibsComments, disabled: false }),
        otherExteriorHouseBibsComments: this._formBuilder.control({ value: exteriorData.exteriorHouseBibs.otherExteriorHouseBibsComments, disabled: false })
      }),
      airCondition: airConditionArray
    });
  }


}

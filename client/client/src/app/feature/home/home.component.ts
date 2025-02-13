import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { GeneralInformationComponent } from '../general-information/general-information.component';
import { BuildingDataComponent } from '../building-data/building-data.component';
import { LotsAndGroundsComponent } from '../lots-and-grounds/lots-and-grounds.component';
import { RoofComponent } from '../roof/roof.component';
import { ExteriorComponent } from '../exterior/exterior.component';
import { GarageCarportComponent } from '../garage-carport/garage-carport.component';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FeatureService } from '../services/feature.service';
import {
  PostResponse,
  CombinedDetails,
  BuildingDetails,
  LotsGroundsDetails,
  RoofDetails,
  ExteriorDetails,
  GarageCarportDetails,
  KitchenDetails,
  BathroomDetails,
  RoomDetails,
  CommonAreaDetails,
  LaundryDetails,
  PlumbingDetails,
  HeatingSystemDetails,
  ElectricalSystemDetails,
  BasementDetails,
  InteriorDetails,
  InspectionUpdate,
  InspectionUpdateResponse,
} from '../models/feature.model';
import { Router } from '@angular/router';
import { KitchenComponent } from '../kitchen/kitchen.component';
import { BathroomsComponent } from '../bathrooms/bathrooms.component';
import { RoomsComponent } from '../rooms/rooms.component';
import { CommonAreaComponent } from '../common-area/common-area.component';
import { LaundryComponent } from '../laundry/laundry.component';
import { InteriorComponent } from '../interior/interior.component';
import { PlumbingComponent } from '../plumbing/plumbing.component';
import { HeatingSystemComponent } from '../heating-system/heating-system.component';
import { ElectricalSystemComponent } from '../electrical-system/electrical-system.component';
import { BasementComponent } from '../basement/basement.component';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InspectionUpdatesService } from '../../shared/services/check-updates/services/inspection-updates.service';

const delayInMilliseconds = 86400000;

@Component({
  selector: 'app-home',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatTabsModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    GeneralInformationComponent,
    BuildingDataComponent,
    LotsAndGroundsComponent,
    RoofComponent,
    ExteriorComponent,
    GarageCarportComponent,
    KitchenComponent,
    BathroomsComponent,
    RoomsComponent,
    CommonAreaComponent,
    LaundryComponent,
    InteriorComponent,
    PlumbingComponent,
    HeatingSystemComponent,
    ElectricalSystemComponent,
    BasementComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  @ViewChild('stepper') stepper!: MatStepper;
  clientInformation: FormGroup = this._formBuilder.group({});
  inspectionCompany: FormGroup = this._formBuilder.group({});
  combinedDetails: FormGroup = this._formBuilder.group({});
  buildingDetails: FormGroup = this._formBuilder.group({});
  lotsGroundsDetails: FormGroup = this._formBuilder.group({});
  roofDetails: FormGroup = this._formBuilder.group({});
  exteriorDetails: FormGroup = this._formBuilder.group({});
  garageCarportDetails: FormGroup = this._formBuilder.group({});
  kitchenDetails: FormGroup = this._formBuilder.group({});
  bathroomsDetails: FormGroup = this._formBuilder.group({});
  roomsDetails: FormGroup = this._formBuilder.group({});
  commonAreaDetails: FormGroup = this._formBuilder.group({});
  laundryDetails: FormGroup = this._formBuilder.group({});
  interiorDetails: FormGroup = this._formBuilder.group({});
  plumbingDetails: FormGroup = this._formBuilder.group({});
  heatingSystemDetails: FormGroup = this._formBuilder.group({});
  electricalSystemDetails: FormGroup = this._formBuilder.group({});
  basementDetails: FormGroup = this._formBuilder.group({});
  submitted = false;
  canGeneratePdf: Boolean = false;
  imageUrls: string[] = [];
  requestId: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private featureService: FeatureService,
    private inspectionUpdatesService: InspectionUpdatesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.requestId = params.get('id') as string;
    });
  }

  ngOnInit(): void {
    this.initializeForms();
    // this.getGeneralInformation();
    // this.getInspectionUpdtes();
    this.getInspectionUpdtesfunc();

    setTimeout(() => {
      this.redirectToLogout();
    }, delayInMilliseconds);
  }

  redirectToLogout() {
    this.router.navigate(['/login']);
  }

  private initializeForms(): void {
    this.clientInformation = this.createClientInformationFormGroup();
    this.inspectionCompany = this.createInspectionCompanyFormGroup();
    this.combinedDetails = this.createCombinedDetailsFormGroup();
    this.buildingDetails = this.createBuildingDetailsFormGroup();
    this.lotsGroundsDetails = this.createLotsGroundsDetailsFormGroup();
    this.roofDetails = this.createRoofDetailsFormGroup();
    this.garageCarportDetails = this.createGarageCarportDetailsFormGroup();
    this.exteriorDetails = this.createExteriorDetailsFormGroup();
    this.interiorDetails = this.createInteriorDetailsFormGroup();
    this.plumbingDetails = this.createPlumbingDetailsFormGroup();
    this.heatingSystemDetails = this.createHeatingSystemDetailsFormGroup();
    this.electricalSystemDetails =
      this.createElectricalSystemDetailsFormGroup();

    this.bathroomsDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      bathrooms: this._formBuilder.array([this.createBathroomFormGroup()]),
    });

    this.roomsDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      rooms: this._formBuilder.array([this.createRoomFormGroup()]),
    });

    this.kitchenDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      kitchens: this._formBuilder.array([this.createKitchenFormGroup()]),
    });

    this.commonAreaDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      commonAreas: this._formBuilder.array([this.createCommonAreasFormGroup()]),
    });

    this.laundryDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      laundrys: this._formBuilder.array([this.createlaundrysFormGroup()]),
    });

    this.basementDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      basements: this._formBuilder.array([this.createBasementFormGroup()]),
    });
  }

  private createClientInformationFormGroup(): FormGroup {
    return this._formBuilder.group({
      contactName: [''],
      clientAddress: [''],
      phoneNumber: [''],
      email: ['', [Validators.email]],
    });
  }

  private createInspectionCompanyFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectorName: ['Chanda (Chan) Gopal'],
      inspectionAddress: ['Eye-Tech Home inspections Inc'],
      phoneNumber: ['416-953-3677'],
      email: ['eyetechinsp@gmail.com', [Validators.email]],
    });
  }

  private createCombinedDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      clientInformation: this.clientInformation,
      inspectionCompany: this.inspectionCompany,
      inspectionId: this.requestId,
    });
  }

  private createBuildingDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      estimatedAge: [''],
      buildingType: [['Detached house']],
      otherBuildingType: [''],
      occupancyState: [['Occupied and fully furnished']],
      otherOccupancyState: [''],
      garage: [['Attached']],
      otherGarage: [''],
      exterior: [['Brick']],
      otherExterior: [''],
      weatherCondition: [['Sunny']],
      otherWeatherCondition: [''],
      soilCondition: [['Dry']],
      OtherSoilCondition: [''],
      outdoorTemperature: [''],
      inspectionDate: [''],
      startTime: [''],
      endTime: [''],
      recentRain: ['No'],
      electricityOn: [['Yes']],
      otherElectricityOn: [''],
      gasOilOn: [['Yes']],
      otherGasOilOn: [''],
      waterOn: [['Yes']],
      otherWaterOn: [''],
    });
  }

  private createLotsGroundsDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      driveway: this._formBuilder.group({
        material: [['Asphalt']],
        otherMaterial: [''],
        condition: [['Acceptable condition']],
        otherCondtion: [''],
        comments: [['Pitched away from home', 'Settling cracks']],
        otherComments: [''],
      }),
      porch: this._formBuilder.group({
        material: [['Concrete']],
        otherMaterial: [''],
        condition: [['Acceptable condition']],
        otherCondition: [''],
        comments: [''],
      }),
      stepsHandrails: this._formBuilder.group({
        material: [['Concrete']],
        otherMaterial: [''],
        condition: [['Acceptable condition']],
        otherCondition: [''],
        comments: [''],
        otherComments: [''],
      }),
      deckPatio: this._formBuilder.array([this.createDeckPatioFormGroup()]),
      fence: this._formBuilder.group({
        material: [['Treated wood']],
        otherMaterial: [''],
        condition: [['Acceptable condition']],
        otherCondtion: [''],
        comments: [''],
        otherComments: [''],
      }),
      landscaping: this._formBuilder.group({
        recommendations: [['']],
        otherRecommendations: [''],
      }),
    });
  }

  private createRoofDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      roofDescription: this._formBuilder.group({
        style: [['Gable']],
        otherStyle: [''],
        pitch: [['Medium']],
        otherPitch: [''],
        visibility: [['Partially visible']],
        otherVisibility: [''],
        methodOfInspection: [['Ground level']],
        otherMethodOfInspection: [''],
        ventilationPresent: [['Yes']],
        ventilationType: [['Soffit vent']],
        otherVentilationType: [''],
      }),
      conditionOfCoverings: this._formBuilder.group({
        material: [['Asphalt shingle']],
        approximateAgeShingles: [''],
        otherMaterial: [''],
        condition: [['']],
        otherCondtion: [''],
        comments: [''],
      }),
      plumbingVents: this._formBuilder.group({
        plumbingOfVents: [['Present']],
        otherPlumbingOfVents: [''],
        type: [['ABS']],
        otherType: [''],
        condition: [['Acceptable condition']],
        otherCondtion: [''],
        comments: [''],
      }),
    });
  }

  private createGarageCarportDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      garageCarportType: [['Attached']],
      otherGarageCarportType: [''],
      garageCarportGarageDoor: [['Fiber glass']],
      otherGarageCarportGarageDoor: [''],
      garageCarportDoorCondition: [['Acceptable condition']],
      otherGarageCarportDoorCondition: [''],
      garageCarportComments: [''],
      garageCarportAutomaticOpener: [['Installed and Operable']],
      otherGarageCarportAutomaticOpener: [''],
      garageCarportSafetyReverses: [['Installed and Operable']],
      otherGarageCarportSafetyReverses: [''],
      garageCarportRoofing: [['Same as house']],
      garageCarportRoofingCondition: [['Acceptable condition']],
      otherGarageCarportRoofingCondition: [''],
      garageCarportFloorFoundation: [['Poured concrete']],
      otherGarageCarportFloorFoundation: [''],
      garageCarportFloorFoundationCondition: [['Minor settling cracks']],
      otherGarageCarportFloorFoundationCondition: [''],
      garageCarportCeiling: [['Drywall']],
      otherGarageCarportCeiling: [''],
      garageCarportCeilingCondition: [['Acceptable condition']],
      otherGarageCarportCeilingCondition: [''],
      garageCarportExteriorWalls: [['Bricks']],
      otherGarageCarportExteriorWalls: [''],
      garageCarportInteriorWalls: [['Wood frame']],
      otherGarageCarportInteriorWalls: [''],
      serviceDoor: this._formBuilder.array([this.createServiceDoorFormGroup()]),
      garageCarportElectricalReceptaclesLights: [['Present and functional']],
      otherGarageCarportElectricalReceptaclesLights: [''],
      garageCarportFireSeparationwall: [['Unknown - Covered by drywall']],
      otherGarageCarportFireSeparationwall: [''],
      garageCarportElectricalReceptaclesLightsComments: [''],
    });
  }

  private createExteriorDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      exteriorWall: this._formBuilder.array([
        this.createExteriorWallsFormGroup(),
      ]),
      foundation: this._formBuilder.group({
        foundationType: [['Poured concrete']],
        otherFoundationType: [''],
        exteriorFoundationCondition: [['Acceptable']],
        otherExteriorFoundationCondition: [''],
        foundationComments: [['Multiple hairline cracks noted']],
        otherFoundationComments: [''],
        interiorFoundationCondition: [['Acceptable']],
        otherInteriorFoundationCondition: [''],
        interiorFoundationComments: [['']],
        otherInteriorFoundationComments: [''],
        cracks: [['']],
        otherCracks: [''],
        coveredFoundationWalls: [
          [
            'Most foundation walls covered by wall materials (Finished basement)',
          ],
        ],
        otherCoveredFoundationWalls: [''],
        coveredFoundationWallsComments: [['']],
      }),
      exteriorExteriorDoor: this._formBuilder.group({
        exteriorDoorMainEntryDoor: [['Metal with glass']],
        otherExteriorDoorMainEntryDoor: [''],
        exteriorDoorDoorCondition: [['Acceptable condition']],
        otherExteriorDoorDoorCondition: [''],
        exteriorDoorWeatherStripping: [['Present and Acceptable condition']],
        exteriorDoorStormDoor: [['N/A']],
        exteriorDoorStormDoorCondition: [['N/A']],
        otherExteriorDoorStormDoorCondition: [''],
        exteriorDoorDoorBell: [['Present and working']],
        otherExteriorDoorDoorBell: [''],
        exteriorDoorDoorBellType: [['Hard wired']],
        otherExteriorDoorDoorBellType: [''],
      }),
      exteriorSideDoor: this._formBuilder.group({
        exteriorSideDoors: [['Metal with glass']],
        otherExteriorSideDoors: [''],
        exteriorSideDoorsDoorCondition: [['Acceptable condition']],
        otherExteriorSideDoorsDoorCondition: [''],
        exteriorSideDoorsWeatherStripping: [
          ['Present and Acceptable condition'],
        ],
        otherExteriorSideDoorsWeatherStripping: [''],
      }),
      exteriorPatioDoor: this._formBuilder.group({
        exteriorPatioDoors: [['Vinyl sliding glass doors']],
        otherExteriorPatioDoors: [''],
        exteriorPatioDoorsCondition: [['Acceptable']],
        otherExteriorPatioDoorsCondition: [''],
        exteriorPatioDoorsComments: [['Slides and lock properly']],
        otherExteriorPatioDoorsComments: [''],
      }),
      exteriorPatioScreenDoor: this._formBuilder.group({
        exteriorPatioScreensDoors: [['Fiberglass']],
        otherExteriorPatioScreensDoors: [''],
        exteriorPatioDoorScreensCondition: [['Acceptable condition']],
        otherExteriorPatioDoorScreesCondition: [''],
        exteriorPatioDoorScreensComments: [['Slides and lock properly']],
        otherExteriorPatioDoorScreensComments: [''],
      }),
      exteriorDoorComments: [''],
      gutter: this._formBuilder.group({
        guttersDownspoutsRoofDrainageMaterial: [['Aluminium']],
        otherGuttersDownspoutsRoofDrainageMaterial: [''],
        guttersDownspoutsRoofDrainageCondition: [['Acceptable condition']],
        otherGuttersDownspoutsRoofDrainageCondition: [''],
        guttersDownspoutsRoofDrainageLeaking: [['No sign of leaks']],
        otherGuttersDownspoutsRoofDrainageLeaking: [''],
        guttersDownspoutsRoofDrainageAttachment: [['Not needed']],
        otherGuttersDownspoutsRoofDrainageAttachment: [''],
        guttersDownspoutsRoofDrainageExtensionNeeded: [['']],
        otherGuttersDownspoutsRoofDrainageExtensionNeeded: [''],
        guttersDownspoutsRoofDrainageComments: [['No extension needed']],
        otherGuttersDownspoutsRoofDrainageComments: [''],
      }),
      window: this._formBuilder.group({
        windowsApproximateAge: [['Unknown']],
        otherWindowsApproximateAge: [''],
        windowsMaterialAndType: [['Aluminum slider']],
        otherWindowsMaterialAndType: [''],
        windowsCondition: [['Acceptable condition']],
        otherWindowsCondition: [''],
        windowsComments: [['All windows operating properly']],
        otherWindowsComments: [''],
        windowScreens: [['Fiberglass']],
        windowScreensCondition: [['Acceptable condition']],
        otherWindowScreensCondition: [''],
        windowScreensComments: [['No damage on screens']],
        otherWindowScreensComments: [''],
        basementWindows: [''],
        basementWindowsApproximateAge: [''],
        basementWindowsMaterial: [['Aluminum slider']],
        otherBasementWindowsMaterial: [''],
        basementWindowsCondition: [['Acceptable condition']],
        otherBasementWindowsCondition: [''],
        basementWindowsComments: [['Slides and lock properly']],
        otherBasementWindowsComments: [''],
      }),
      gasMeter: this._formBuilder.array([this.createGasMeterFormGroup()]),
      electricity: this._formBuilder.group({
        exteriorOutletsAndLights: [
          [
            'All outlets and light fixtures are functional at the time of inspection',
          ],
        ],
        otherExteriorOutletsAndLights: [''],
      }),
      exteriorHouseBibs: this._formBuilder.group({
        exteriorHouseBibsType: [['Rotary']],
        otherExteriorHouseBibsType: [''],
        exteriorHouseBibsCondition: [['Acceptable']],
        otherExteriorHouseBibsCondition: [''],
        exteriorHouseBibsComments: [['Tested and working']],
        otherExteriorHouseBibsComments: [''],
      }),
      airCondition: this._formBuilder.array([
        this.createAirConditionFormGroup(),
      ]),
    });
  }

  private createInteriorDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      stair: this._formBuilder.array([this.createStairsFormGroup()]),
      handrail: this._formBuilder.array([this.createHandrailsFormGroup()]),
      smokeDetector: this._formBuilder.group({
        interiorSmokeDetectorComments: [
          ['Installed on every level of the house and Operable'],
        ],
        otherInteriorSmokeDetectorComments: [''],
      }),
      skylight: this._formBuilder.group({
        interiorSkylightType: [['Fixed skylight']],
        otherInteriorSkylightType: [''],
        interiorSkylightComments: [
          ['Acceptable – No sign of water penetration or condensation'],
        ],
        otherInteriorSkylightComments: [''],
      }),
      fireplace: this._formBuilder.array([this.createFirePlaceFormGroup()]),
      floorDrain: this._formBuilder.group({
        interiorFloorDrainCondition: [['Acceptable']],
        otherInteriorFloorDrainCondition: [''],
        interiorFloorDrainComments: [
          ['Always keep the floor drain clear of debris'],
        ],
        otherInteriorFloorDrainComments: [''],
      }),
      attic: this._formBuilder.group({
        interiorAtticAccess: [['Scuttle attic hole']],
        otherInteriorAtticAccess: [''],
        interiorAtticLocation: [['Master bedroom closet']],
        otherInteriorAtticLocation: [''],
        interiorAtticInspectionMethod: [
          ['From the attic access, at the scuttle hole'],
        ],
        otherInteriorAtticInspectionMethod: [''],
        interiorAtticRoofFraming: [['2x4 and 2x6 Truss']],
        otherInteriorAtticRoofFraming: [''],
        interiorAtticSheathing: [['Plywood']],
        otherInteriorAtticSheathing: [''],
        interiorAtticInsulationType: [['Blown in – Fiberglass']],
        otherInteriorAtticInsulationType: [''],
        interiorAtticInsulationDepth: [['Adequate insulation present']],
        otherInteriorAtticInsulationDepth: [''],
        interiorAtticVaporBarrier: [['Plastic']],
        otherInteriorAtticVaporBarrier: [''],
        interiorAtticVentilation: [['Roof and soffit vents']],
        otherInteriorAtticVentilation: [''],
        interiorAtticExhaustFan: [['No – Bathroom fan vented outside']],
        otherInteriorAtticExhaustFan: [''],
        interiorAtticComments: [
          ['No signs of leaks found at the time of inspection'],
        ],
        otherInteriorAtticComments: [''],
      }),
      sumpPump: this._formBuilder.group({
        interiorSumpPumpLocation: [['Basement']],
        otherInteriorSumpPumpLocation: [''],
        interiorSumpPumpCondition: [
          ['Tested and working at the time of inspection'],
        ],
        otherInteriorSumpPumpCondition: [''],
        interiorSumpPumpComments: [''],
        otherInteriorSumpPumpComments: [''],
      }),
    });
  }

  private createPlumbingDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      regular: this._formBuilder.group({
        plumbingMainShutoffLocation: [['Basement']],
        otherPlumbingMainShutoffLocation: [''],
        plumbingWaterEntryPiping: [['Copper']],
        otherPlumbingWaterEntryPiping: [''],
        plumbingLeadOtherThanSolderJoist: [['No']],
        otherPlumbingLeadOtherThanSolderJoist: [''],
        plumbingVisibleWaterDistributionPiping: [['Copper']],
        otherPlumbingVisibleWaterDistributionPiping: [''],
        plumbingCondition: [['Acceptable']],
        otherPlumbingCondition: [''],
        plumbingFunctionalFlow: [['Acceptable']],
        otherPlumbingFunctionalFlow: [''],
        plumbingDrainWasteAndVentPipe: [['ABS - Black thin-walled plastic']],
        otherPlumbingDrainWasteAndVentPipe: [''],
        plumbingComments: [''],
      }),
      waterHeater: this._formBuilder.group({
        plumbingWaterHeaterType: [['Storage water heater']],
        otherPlumbingWaterHeaterType: [''],
        waterHeaterApproximateAge: [''],
        waterHeaterEnergySource: [['Natural gas']],
        otherWaterHeaterEnergySource: [''],
        waterHeaterCapacity: [['40 Gallon']],
        otherWaterHeaterCapacity: [''],
        waterHeaterOperation: [['Adequate']],
        otherWaterHeaterOperation: [''],
        waterHeaterCondition: [['Acceptable condition']],
        otherWaterHeaterCondition: [''],
        waterHeaterComments: [''],
      }),
    });
  }

  private createHeatingSystemDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      heatingSystemFurnaceLocation: [['Basement']],
      otherHeatingSystemFurnaceLocation: [''],
      heatingSystemManufacturer: [''],
      heatingSystemApproximateAge: [''],
      heatingSystemEnergySource: [['Natural Gas']],
      otherHeatingSystemEnergySource: [''],
      heatingSystemType: [['Forced air']],
      otherHeatingSystemType: [''],
      heatingSystemAreaServed: [['Whole building']],
      otherHeatingSystemAreaServed: [''],
      heatingSystemThermostats: [['Programmable']],
      otherHeatingSystemThermostats: [''],
      heatingSystemDistribution: [['Metal duct']],
      otherHeatingSystemDistribution: [''],
      heatingSystemInteriorFuelStorage: [['N/A']],
      otherHeatingSystemInteriorFuelStorage: [''],
      heatingSystemGasServiceLines: [['Black Iron']],
      otherHeatingSystemGasServiceLines: [''],
      heatingSystemBlowerFan: [['Direct drive']],
      otherHeatingSystemBlowerFan: [''],
      heatingSystemFilter: [['Disposable air filter']],
      otherHeatingSystemFilter: [''],
      heatingSystemSuspectedAsbestos: [['No']],
      otherHeatingSystemSuspectedAsbestos: [''],
      heatingSystemOperation: [
        ['Tested and working at the time of inspection'],
      ],
      otherHeatingSystemOperation: [''],
      heatingSystemCondition: [['Acceptable']],
      otherHeatingSystemCondition: [''],
      heatingSystemComments: [''],
    });
  }

  private createElectricalSystemDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      mainElectricalPanel: this._formBuilder.group({
        electricalMainElectricalPanelLocation: [['Basement']],
        otherElectricalMainElectricalPanelLocation: [''],
        electricalMainElectricalPanelCondition: [['Acceptable condition']],
        otherElectricalMainElectricalPanelCondition: [''],
        electricalAdequateClearanceToPanel: [['Yes']],
        otherElectricalAdequateClearanceToPanel: [''],
        electricalMainBreakerSize: [['100 Amps']],
        otherElectricalMainBreakerSize: [''],
        electricalServiceSizeAmps: [['100 Amps']],
        otherElectricalServiceSizeAmps: [''],
        electricalVolts: [['120/240 VAC Breakers']],
        otherElectricalVolts: [''],
        electricalAppearsGrounded: [['Yes']],
        otherElectricalAppearsGrounded: [''],
        electricalMainWiring: [['Copper']],
        otherElectricalMainWiring: [''],
        electricalMainElectricalPanelComments: [
          [
            'There is extra breaker space.  This provides extra flexibility for future electrical endeavors',
          ],
        ],
        otherElectricalMainElectricalPanelComments: [''],
      }),
      lightingAndOutlets: this._formBuilder.group({
        electricallightsAndOutletsComments: [''],
      }),
    });
  }

  addGeneralInformation(combinedDetails: CombinedDetails) {
    this.featureService
      .createGeneralInformationApi(combinedDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {
        console.log(response);
        if (response === 200) {
        }
      });
  }

  private mapClientInformationFormGroup(clientInfo: any): FormGroup {
    return this._formBuilder.group({
      contactName: this._formBuilder.control({
        value: clientInfo.contactName,
        disabled: true,
      }),
      clientAddress: this._formBuilder.control({
        value: clientInfo.clientAddress,
        disabled: true,
      }),
      phoneNumber: this._formBuilder.control({
        value: clientInfo.phoneNumber,
        disabled: true,
      }),
      email: this._formBuilder.control({
        value: clientInfo.email,
        disabled: true,
      }),
    });
  }

  private mapInspectionCompanyFormGroup(inspectionCompanyInfo: any): FormGroup {
    return this._formBuilder.group({
      inspectorName: this._formBuilder.control({
        value: inspectionCompanyInfo.inspectorName,
        disabled: true,
      }),
      inspectionAddress: this._formBuilder.control({
        value: inspectionCompanyInfo.inspectionAddress,
        disabled: true,
      }),
      phoneNumber: this._formBuilder.control({
        value: inspectionCompanyInfo.phoneNumber,
        disabled: true,
      }),
      email: this._formBuilder.control({
        value: inspectionCompanyInfo.email,
        disabled: true,
      }),
    });
  }

  getInspectionUpdtesfunc() {
    if (this.requestId) {
      this.getInspectionUpdtes();
    }
  }

  getInspectionUpdtes() {
    this.featureService
      .getInspectionSchemaApi(this.requestId)
      .pipe(takeUntil(this._destroy$))
      .subscribe(
        (response: InspectionUpdateResponse) => {
          if (response.data) {
            this.inspectionUpdatesService.updateInspectionData(response?.data);
          } else {
            console.error('No data found in response');
          }
        },
        (error) => {
          console.error('Error fetching inspection updates:', error);
        }
      );
  }

  addBuildingData(buildingDetails: BuildingDetails) {
    this.featureService
      .createBuildingDataApi(buildingDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  // imageBuildingLoading

  addLotsAndGrounds(lotsGroundsDetails: LotsGroundsDetails) {
    this.featureService
      .createLotsAndGroundsApi(lotsGroundsDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {
        console.log(response);
      });
  }

  addRoofDetails(roofDetails: RoofDetails) {
    this.featureService
      .createRoofApi(roofDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  addExteriorDetails(exteriorDetails: ExteriorDetails) {
    this.featureService
      .createExteriorApi(exteriorDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  addGarageCarportDetails(garageCarportDetails: GarageCarportDetails) {
    this.featureService
      .createGarageCarpotApi(garageCarportDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  addKitchenDetails(kitchenDetails: KitchenDetails) {
    this.featureService
      .createKitchenApi(kitchenDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  addBathroomDetails(bathroomDetails: BathroomDetails) {
    this.featureService
      .createBathroomApi(bathroomDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {
        console.log(response);
      });
  }

  addRoomDetails(roomDetails: RoomDetails) {
    this.featureService
      .createRoomApi(roomDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  addCommonAreaDetails(commonAreaDetails: CommonAreaDetails) {
    this.featureService
      .createCommonAreaApi(commonAreaDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  addLaundryDetails(laundryDetails: LaundryDetails) {
    this.featureService
      .createLaundryApi(laundryDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {});
  }

  addInteriorDetails(interiorDetails: InteriorDetails) {
    this.featureService
      .createInteriorApi(interiorDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {});
  }

  addPlumbingDetails(plumbingDetails: PlumbingDetails) {
    this.featureService
      .createPlumbingApi(plumbingDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  addHeatingSystemDetails(heatingSystemDetails: HeatingSystemDetails) {
    this.featureService
      .createHeatingSystemApi(heatingSystemDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {});
  }

  addElectricalSystemDetails(electricalSystemDetails: ElectricalSystemDetails) {
    this.featureService
      .createElectricalSystemApi(electricalSystemDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res) => {});
  }

  addBasementDetails(basementDetails: BasementDetails) {
    this.featureService
      .createBasementApi(basementDetails)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response) => {});
  }

  getAllImages(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.featureService.getImages().subscribe({
        next: (response: PostResponse) => {
          const imagePaths = response.posts.map(({ fieldName, imageName }) => {
            return `${fieldName}_${imageName}`;
          });
          this.imageUrls = imagePaths;
          resolve(this.imageUrls);
        },
        error: (err) => {
          console.error('Error fetching images:', err);
          reject(err);
        },
      });
    });
  }

  deleteAllFiles(): void {
    this.featureService.deleteAllFiles().subscribe({
      next: (res: any) => {
        if (res.message === 'SUCCESS') {
          console.log('All files have been successfully deleted.');
        }
      },
      error: (e) => console.error(e),
    });
  }

  resetStepper(): void {
    this.stepper.reset();
    this.canGeneratePdf = false;
  }

  newForm() {
    this.router.navigate(['/home']);
  }

  newTutorial(): void {
    this.buildingDetails.reset();
    this.combinedDetails.reset();
    this.clientInformation.reset();
    this.inspectionCompany.reset();
    this.lotsGroundsDetails.reset();
    this.roofDetails.reset();
    this.exteriorDetails.reset();
    this.garageCarportDetails.reset();
    this.kitchenDetails.reset();
    this.bathroomsDetails.reset();
    this.roomsDetails.reset();
  }

  private createBathroomFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],

      bathroomFloors: this._formBuilder.group({
        bathroomFloorsMaterial: [['Ceramic tiles']],
        otherBathroomFloorsMaterial: [''],
        bathroomFloorsCondition: [['Acceptable condition']],
        otherBathroomCondition: [''],
      }),

      bathroomWalls: this._formBuilder.group({
        bathroomsWallsMaterial: [['Drywall and Tiles']],
        otherBathromsWallsMaterial: [''],
        bathroomWallsCondition: [['Acceptable condition']],
        otherBathroomWallsCondition: [''],
      }),

      bathroomCeilings: this._formBuilder.group({
        bathroomCeilingsMaterial: [['Drywall and paint']],
        otherBathroomCeilingsMaterial: [''],
        bathroomCeilingsCondition: [['Acceptable condition']],
        otherBathroomCeilingsCondition: [''],
      }),

      bathroomDoors: this._formBuilder.group({
        bathroomDoorsMaterial: [['Hollow wood']],
        otherBathroomDoorsMaterial: [''],
        bathroomDoorsCondition: [['Acceptable condition']],
        otherBathroomDoorsCondition: [''],
      }),

      bathroomWindows: this._formBuilder.group({
        bathroomWindowsMaterial: [['N/A']],
        otherBathroomWindowsMaterial: [''],
      }),

      bathroomElectricals: this._formBuilder.group({
        bathroomElectricalsMaterial: [
          ['All outlets and lights are functional'],
        ],
        otherBathroomElectricalsMaterial: [''],
      }),

      bathroomCounterCabinets: this._formBuilder.group({
        bathroomCounterCabinetsMaterial: [['Acceptable']],
        otherBathroomCounterCabinetsMaterial: [''],
      }),

      bathroomSinkBasins: this._formBuilder.group({
        bathroomSinkBasinsMaterial: [['Acceptable']],
        otherBathroomSinkBasinsMaterial: [''],
      }),

      bathroomPlumbings: this._formBuilder.group({
        bathroomPlumbingsMaterial: [['Acceptable - No current leak detected']],
        otherBathroomPlumbingsMaterial: [''],
      }),

      bathroomToilets: this._formBuilder.group({
        bathroomToiletsMaterial: [['Acceptable - No leaks and Operable']],
        otherbathroomToiletsMaterial: [''],
      }),

      bathroomBathtubs: this._formBuilder.group({
        bathroomBathtubsMaterial: [['Acceptable - No leaks and Operable']],
        otherBathroomBathtubsMaterial: [''],
      }),

      bathroomStandingShowers: this._formBuilder.group({
        bathroomStandingShowersMaterial: [['Acceptable']],
        otherBathroomStandingShowersMaterial: [''],
      }),

      bathroomFaucets: this._formBuilder.group({
        bathroomFaucetsMaterial: [['Acceptable condition - No leaks']],
        otherBathroomFaucetsMaterial: [''],
      }),

      bathroomWaterFlows: this._formBuilder.group({
        bathroomWaterFlowsMaterial: [['Acceptable']],
        otherBathroomWaterFlowsMaterial: [''],
      }),

      bathroomMoistureStains: this._formBuilder.group({
        bathroomMoistureStainsMaterial: [['No moisture stains present']],
        otherBathroomMoistureStainsMaterial: [''],
      }),

      bathroomHeatSources: this._formBuilder.group({
        bathroomHeatSourcesMaterial: [['Central heating system']],
        otherBathroomHeatSourcesMaterial: [''],
      }),

      bathroomVentilations: this._formBuilder.group({
        bathroomVentilationsMaterial: [['Ventilation fan present']],
        otherbathroomVentilationsMaterial: [''],
      }),
      bathroomComments: [''],
    });
  }

  private createRoomFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      bedroomwall: this._formBuilder.group({
        bedroomsWalls: [['Drywall and paint']],
        otherBedroomsWalls: [''],
        bedroomsWallsCondition: [['Acceptable']],
        otherBedroomsWallsCondition: [''],
      }),
      ceiling: this._formBuilder.group({
        bedroomsCeilings: [['Drywall and paint']],
        otherBedroomsCeilings: [''],
        bedroomsCeilingsCondition: [['Acceptable']],
        otherBedroomsCeilingsCondition: [''],
      }),
      floor: this._formBuilder.group({
        bedroomsFloors: [['Hardwood flooring']],
        otherBedroomsFloors: [''],
        bedroomsFloorsCondition: [['Acceptable']],
        otherBedroomsFloorsCondition: [''],
      }),
      closet: this._formBuilder.group({
        bedroomsClosets: [['Built-in']],
        otherBedroomsClosets: [''],
        bedroomsClosetsCondition: [['Acceptable']],
        otherBedroomsClosetsCondition: [''],
      }),
      door: this._formBuilder.group({
        bedroomsDoors: [['Hollow wood']],
        otherBedroomsDoors: [''],
        bedroomsDoorsCondition: [['Acceptable']],
        otherBedroomsDoorsCondition: [''],
      }),
      window: this._formBuilder.group({
        bedroomsWindows: [['Acceptable']],
        otherBedroomsWindows: [''],
      }),
      electrical: this._formBuilder.group({
        bedroomsElectricals: [['All outlets and lights are functional']],
        otherBedroomsElectricals: [''],
      }),
      heatSource: this._formBuilder.group({
        bedroomsHeatSource: [['Central heating system']],
        otherBedroomsHeatSource: [''],
      }),
      moistureStains: this._formBuilder.group({
        bedroomsMoistureStains: [['']],
        otherBedroomsMoistureStains: [''],
      }),
      bedroomsComments: [''],
    });
  }

  private createKitchenFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],

      kitchenCountertops: this._formBuilder.group({
        kitchenCountertopsCondition: [['Acceptable condition']],
        otherkitchenCountertopsCondition: [''],
        countertopsComments: [['No cracks or burn spots']],
        otherCountertopsComments: [''],
      }),

      kitchenCabinets: this._formBuilder.group({
        kitchenCabinetsCondition: [['Acceptable condition']],
        otherKitchenCabinetsCondition: [''],
        kitchenCabinetsComments: [['']],
        otherKitchenCabinetsComments: [''],
      }),

      kitchenPlumbings: this._formBuilder.group({
        kitchenPlumbingsCondition: [['Acceptable condition – No leaks']],
        otherKitchenPlumbingsCondition: [''],
        kitchenPlumbingsFaucet: [['Acceptable condition and operable']],
        otherKitchenPlumbingsFaucet: [''],
        kitchenPlumbingsfunctionalDrainage: [['']],
        otherKitchenPlumbingsFunctionalDrainage: [''],
      }),

      kitchenFloors: this._formBuilder.group({
        kitchenFloorMaterial: [['Ceramic tiles']],
        otherkitchenFloorMaterial: [''],
        kitchenFloorCondition: [['Acceptable condition']],
        otherKitchenFloorCondition: [''],
        kitchenFloorComments: [['']],
        otherKitchenFloorComments: [''],
      }),

      kitchenWalls: this._formBuilder.group({
        kitchenWallsCondition: [['Acceptable condition']],
        otherKitchenWallsCondition: [''],
      }),

      kitchenCeilings: this._formBuilder.group({
        kitchenCeilingsCondition: [['Acceptable condition']],
        otherKitchenCeilingsCondition: [''],
      }),

      kitchenElectricals: this._formBuilder.group({
        kitchenElectricalsCondition: [
          ['All plugs and lights are functional at the time of inspection'],
        ],
        otherKitchenElectricalsCondition: [''],
      }),

      kitchenAppliances: this._formBuilder.group({
        kitchenAppliancesRange: [['Present']],
        otherKitchenAppliancesRange: [''],
        kitchenAppliancesRangeCondition: [
          ['Inspected and working at the time of inspection'],
        ],
        otherKitchenAppliancesCondition: [''],
      }),

      kitchenDishwashers: this._formBuilder.group({
        kitchenDishwasher: [['Present']],
        otherKitchenDishwasher: [''],
        kitchenDishwashersCondition: [
          ['Inspected and working at the time of inspection'],
        ],
        otherkitchenDishwashersCondition: [''],
      }),

      kitchenRangeHoodFans: this._formBuilder.group({
        kitchenRangeHoodFan: [['Present']],
        otherKitchenRangeHoodFan: [''],
      }),

      kitchenRefrigerators: this._formBuilder.group({
        kitchenRefrigerator: [['Present']],
        otherKitchenRefrigerator: [''],
        kitchenRefrigeratorCondition: [
          ['Inspected and working at the time of inspection'],
        ],
        otherKitchenRefrigeratorCondition: [''],
      }),

      kitchenMicrowaves: this._formBuilder.group({
        kitchenMicrowave: [['N/A']],
        otherKitchenMicrowave: [''],
      }),
      kitchenOpenGroundReversePolarity: [['No']],
    });
  }

  private createDeckPatioFormGroup(): FormGroup {
    return this._formBuilder.group({
      material: [['Treated wood']],
      otherMaterial: [''],
      condition: [['Acceptable condition']],
      otherCondition: [''],
      comments: [''],
    });
  }

  private createExteriorWallsFormGroup(): FormGroup {
    return this._formBuilder.group({
      exteriorWallType: [['Brick']],
      otherExteriorWallType: [''],
      exteriorWallCondition: [['Acceptable']],
      otherExteriorWallCondition: [''],
      exteriorWallComments: [''],
    });
  }

  private createGasMeterFormGroup(): FormGroup {
    return this._formBuilder.group({
      gasMeterType: [['Exterior surface mount']],
      otherGasMeterType: [''],
      gasMeterCondition: [['Acceptable']],
      otherGasMeterCondition: [''],
      gasMeterComments: [''],
    });
  }

  private createAirConditionFormGroup(): FormGroup {
    return this._formBuilder.group({
      airConditionsManufacturer: [''],
      airConditionsApproximateAge: [''],
      airConditionsAreaServed: [['Whole building']],
      otherAirConditionsAreaServed: [''],
      airConditionsFuelType: [['110 V']],
      otherAirConditionsFuelType: [''],
      airConditionsCondition: [['Acceptable condition']],
      otherAirConditionsCondition: [''],
      airConditionsCondenserFins: [['Acceptable condition']],
      otherAirConditionsCondenserFins: [''],
      airConditionsCabinetHousing: [['Acceptable condition']],
      otherAirConditionsCabinetHousing: [''],
      airConditionsRefrigerantLineInsulation: [['Line fully insulated']],
      otherAirConditionsRefrigerantLineInsulation: [''],
      airConditionsACSystemOperation: [
        ['Tested and working at the time of inspection'],
      ],
      airConditionsComments: [''],
    });
  }

  private createServiceDoorFormGroup(): FormGroup {
    return this._formBuilder.group({
      garageCarportServiceDoor: [['Present']],
      garageCarportServiceDoorCondition: [['Acceptable condition']],
      otherGarageCarportServiceDoorCondition: [''],
      garageCarportServiceDoorSelfClose: [['Installed and operable']],
      otherGarageCarportServiceDoorSelfClose: [''],
    });
  }

  private createCommonAreasFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      commonAreaswall: this._formBuilder.group({
        commonAreasWalls: [['Drywall and paint']],
        othercommonAreasWalls: [''],
        commonAreasWallsCondition: [['Acceptable']],
        othercommonAreasWallsCondition: [''],
      }),
      ceiling: this._formBuilder.group({
        commonAreasCeilings: [['Drywall and paint']],
        othercommonAreasCeilings: [''],
        commonAreasCeilingsCondition: [['Acceptable']],
        othercommonAreasCeilingsCondition: [''],
      }),
      floor: this._formBuilder.group({
        commonAreasFloors: [['Hardwood flooring']],
        othercommonAreasFloors: [''],
        commonAreasFloorsCondition: [['Acceptable']],
        othercommonAreasFloorsCondition: [''],
      }),

      window: this._formBuilder.group({
        commonAreasWindows: [['Acceptable']],
        othercommonAreasWindows: [''],
      }),
      electrical: this._formBuilder.group({
        commonAreasElectricals: [['All outlets and lights are functional']],
        othercommonAreasElectricals: [''],
      }),
      heatSource: this._formBuilder.group({
        commonAreasHeatSource: [['Central heating system']],
        othercommonAreasHeatSource: [''],
      }),
      commonAreasComments: [''],
    });
  }

  private createlaundrysFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      laundryCeiling: [['Drywall and paint']],
      otherLaundryCeiling: [''],
      laundryWalls: [['Drywall']],
      otherLaundryWalls: [''],
      laundryFloor: [['Tiles flooring with floor drain']],
      otherLaundryFloor: [''],
      laundryWasher: [['Tested and working at the time of inspection']],
      otherLaundryWasher: [''],
      laundryDryer: [['Tested and working at the time of inspection']],
      otherLaundryDryer: [''],
      laundryPipesLeak: [['No sign of pipe leak']],
      otherLaundryPipesLeak: [''],
      laundryWasherDrain: [['Drain into the laundry drain']],
      otherLaundryWasherDrain: [''],
      laundrySink: [['Present and Acceptable']],
      otherLaundrySink: [''],
      laundryFaucet: [['Acceptable - No sign of leak']],
      otherLaundryFaucet: [''],
      laundryHeatSource: [['Central heating']],
      otherLaundryHeatSource: [''],
      laundryElectrical: [['All outlets and lights working']],
      otherLaundryElectrical: [''],
      laundryRoomVented: [['Yes']],
      otherLaundryRoomVented: [''],
      laundryDryerVent: [['Dryer vented outside']],
      otherLaundryDryerVent: [''],
      laundryComments: [''],
    });
  }

  private createStairsFormGroup(): FormGroup {
    return this._formBuilder.group({
      interiorStairsMaterial: [['Hardwood']],
      otherInteriorStairsMaterial: [''],
      interiorStairsCondition: [['Acceptable condition']],
      otherInteriorStairsCondition: [''],
      interiorStairsComments: [''],
    });
  }

  private createHandrailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      interiorHandrailsMaterial: [['Wood']],
      otherInteriorHandrailsMaterial: [''],
      interiorHandrailsCondition: [['Acceptable condition']],
      otherInteriorHandrailsCondition: [''],
      interiorHandrailsComments: [''],
    });
  }

  private createFirePlaceFormGroup(): FormGroup {
    return this._formBuilder.group({
      interiorFireplaceLocation: [['Family room']],
      otherInteriorFireplaceLocation: [''],
      interiorFireplaceType: [['Natural gas fireplace']],
      otherInteriorFireplaceType: [''],
      interiorFireplaceCondition: [['']],
      otherInteriorFireplaceCondition: [''],
      interiorFireplaceComments: [
        ['Inspected and working at the time of inspection'],
      ],
      otherInteriorFireplaceComments: [''],
    });
  }

  private createBasementFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      basementLaundryCeiling: [['']],
      otherBasementLaundryCeiling: [''],
      basementWalls: [['']],
      otherBasementWalls: [''],
      basementVaporBarrier: [['']],
      otherBasementBarrier: [''],
      basementInsulation: [['']],
      otherBasementInsulation: [''],
      basementDoors: [['']],
      otherBasementDoors: [''],
      basementWindows: [['']],
      otherBasementWindows: [''],
      basementElectrical: [['']],
      otherBasementElectrical: [''],

      basementFloor: this._formBuilder.group({
        basementFloorMaterial: [['']],
        otherBasementFloorMaterial: [''],
        basementFloorCondition: [['']],
        otherBasementFloorCondition: [''],
        basementFloorCovered: [['']],
        otherBasementFloorCovered: [''],
      }),

      basementStairs: this._formBuilder.group({
        basementStairsConditon: [['']],
        otherBasementStairsCondition: [''],
        basementStairsHandrail: [['']],
        otherBasementStairsHandrail: [''],
        basementStairsHeadway: [['']],
        otherBasementStairsHeadway: [''],
      }),
    });
  }

  onSubmit() {
    // Perform submission logic
    console.log('Form submitted!');

    // Change state to show "Generate PDF"
    this.canGeneratePdf = true;
  }
  generatePDF(inspectionId: string): void {
    const snackBarRef = this.snackBar.open('Downloading PDF...', 'Close', {
      //duration: null, // Set to null for an indefinite duration
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    this.featureService.generatePDF(inspectionId).subscribe(
      (blob: Blob) => {
        snackBarRef.dismiss(); // Dismiss the snackbar on success
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Inspection.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        // this.deleteAllFiles();
      },
      (error) => {
        snackBarRef.dismiss(); // Dismiss the snackbar on error
        this.snackBar.open('Failed to download PDF.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        console.error('PDF generation failed', error);
      }
    );
  }
  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }
}

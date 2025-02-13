import { Component, Input } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';
import { InspectionUpdatesService } from '../../shared/services/check-updates/services/inspection-updates.service';
import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';

@Component({
  selector: 'app-building-data',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    ImageUploaderComponent,
    MatSelectModule],
  templateUrl: './building-data.component.html',
  styleUrl: './building-data.component.scss'
})

export class BuildingDataComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  buildingImage: string = 'building';
  imageBuildingLoading: boolean = false;
  inspectionUpdate: any;
  @Input() buildingDetails: FormGroup = this._formBuilder.group({});


  waterOnImage: string = 'waterOnImage';
  gasOilOnImage: string = 'gasOilOnImage';
  electricityOnImage: string = 'electricityOnImage';
  recentRainImage: string = 'recentRainImage';

  homeProfilePicture: string = 'homeprofilePicture';

  buildingTypes = ['Detached house' , 'Semi – Detached House' , 'Town house end unit' , 'Row house' , 'Split level house' , 'Other'];
  occupancyStates = ['Occupied and fully furnished' , 'Unoccupied and furnished' , 'Vacant' , 'Other'];
  garages = ['Attached' , 'Detached' , 'Carport' , 'Not applicable' , 'Other'];
  exteriors = ['Brick', 'Brick and stones', 'Brick and vinyl siding', 'Brick and aluminum siding', 'Vinyl siding', 'Aluminum siding', 'Brick and shingles', 'Other'];
  weatherConditions = ['Sunny', 'Snow', 'Rain', 'Cloudy', 'Other'];
  soilConditions = ['Dry' , 'Wet' , 'Damp' , 'Snow covered' , 'Other'];
  electricity = [''];
  electricityGasOilWaterOnDrop = ['Yes', 'No', 'Turned off by owner', 'Other'];
  recentRain = ['Yes', 'No'];


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
    this.buildingDetails = this.createBuildingDetailsFormGroup();
  }

  getUpdatesTrigger() {
    this.inspectionUpdatesService.currentUpdate.subscribe(
      update => {
        this.inspectionUpdate = update;
          if(this.inspectionUpdate.buildingInfo && (this.inspectionUpdate._id === this.requestId)) {
            this.getBuildingInformation();
          }
      },
      error => {
        console.error('Error fetching inspection update:', error);
      }
    );
  }

  private createBuildingDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      estimatedAge: [''],
      buildingType: [''],
      otherBuildingType: [''],
      occupancyState: [''],
      otherOccupancyState: [''],
      garage: [''],
      otherGarage: [''],
      exterior: [''],
      otherExterior: [''],
      weatherCondition: [''],
      otherWeatherCondition: [''],
      soilCondition: [''],
      OtherSoilCondition: [''],
      outdoorTemperature: [''],
      inspectionDate: [''],
      startTime: [''],
      endTime: [''],
      recentRain: [''],
      electricityOn: [''],
      otherElectricityOn: [''],
      gasOilOn: [''],
      otherGasOilOn: [''],
      waterOn: [''],
      otherWaterOn: ['']
    });
  }


  getBuildingInformation() {
    this.featureService.getBuildingDataApi(this.requestId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((response: any) => {
        if (response.message === 200 && response.buildingDetails) {
          const buildingData = response.buildingDetails;
          const buildingDetailsFormGroup = this.mapBuildingDetailsFormGroup(buildingData);
          this.buildingDetails.patchValue(buildingDetailsFormGroup.value);
          this.imageBuildingLoading = true;
        }
      });
  }

  private mapBuildingDetailsFormGroup(buildingData: any): FormGroup {
    return this._formBuilder.group({
      estimatedAge: this._formBuilder.control({ value: buildingData.estimatedAge, disabled: false }),
      buildingType: this._formBuilder.control({ value: buildingData.buildingType, disabled: false }),
      otherBuildingType: this._formBuilder.control({ value: buildingData.otherBuildingType, disabled: false }),
      occupancyState: this._formBuilder.control({ value: buildingData.occupancyState, disabled: false }),
      otherOccupancyState: this._formBuilder.control({ value: buildingData.otherOccupancyState, disabled: false }),
      garage: this._formBuilder.control({ value: buildingData.garage, disabled: false }),
      otherGarage: this._formBuilder.control({ value: buildingData.otherGarage, disabled: false }),
      exterior: this._formBuilder.control({ value: buildingData.exterior, disabled: false }),
      otherExterior: this._formBuilder.control({ value: buildingData.otherExterior, disabled: false }),
      weatherCondition: this._formBuilder.control({ value: buildingData.weatherCondition, disabled: false }),
      otherWeatherCondition: this._formBuilder.control({ value: buildingData.otherWeatherCondition, disabled: false }),
      soilCondition: this._formBuilder.control({ value: buildingData.soilCondition, disabled: false }),
      OtherSoilCondition: this._formBuilder.control({ value: buildingData.otherSoilCondition, disabled: false }),
      outdoorTemperature: this._formBuilder.control({ value: buildingData.outdoorTemperature, disabled: false }),
      inspectionDate: this._formBuilder.control({ value: buildingData.inspectionDate, disabled: false }),
      startTime: this._formBuilder.control({ value: buildingData.startTime, disabled: false }),
      endTime: this._formBuilder.control({ value: buildingData.endTime, disabled: false }),
      recentRain: this._formBuilder.control({ value: buildingData.recentRain, disabled: false }),
      electricityOn: this._formBuilder.control({ value: buildingData.electricityOn, disabled: false }),
      otherElectricityOn: this._formBuilder.control({ value: buildingData.otherElectricityOn, disabled: false }),
      gasOilOn: this._formBuilder.control({ value: buildingData.gasOilOn, disabled: false }),
      otherGasOilOn: this._formBuilder.control({ value: buildingData.otherGasOilOn, disabled: false }),
      waterOn: this._formBuilder.control({ value: buildingData.waterOn, disabled: false }),
      otherWaterOn: this._formBuilder.control({ value: buildingData.otherWaterOn, disabled: false })
    });
  }

}

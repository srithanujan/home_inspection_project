import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    ImageUploaderComponent

  ],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() roomsDetails: FormGroup = this._formBuilder.group({});


  roomsWallsImage: string = 'roomsWallsImage';
  roomsCeilingImage: string = 'roomsCeilingImage';
  roomsFloorsImage: string = 'roomsFloorsImage';
  roomsClosetImage: string = 'roomsClosetImage';
  roomsDoorImage: string = 'roomsDoorImage';
  roomsWindowsImage: string = 'roomsWindowsImage';
  roomsElectricalImage: string = 'roomsElectricalImage';
  roomsHeatSourceImage: string = 'roomsHeatSourceImage';



  bedroomWallsOptions = ['Drywall and paint' , 'Wood panel' , 'Other', 'N/A']
  bedroomWallsConditionsOptions = ['Acceptable', 'Marginal', 'Minor crack or damage present', 'Sign of water damage present', 'Sign of mold present – Need *****', 'Small holes are present because of previous shelving installation', 'Other', 'N/A']
  bedroomCeilingsOptions = ['Drywall and paint' , 'Wood panel' , 'Other', 'N/A']
  bedroomCeilingsConditionsOptions =   ['Acceptable' , 'Cracked ceiling' , 'No current leak detected', 'Sign of previous leak noted', 'Recommend monitor and repair if leaking continues in the future' , 'Sagging or Bulging noted – Need repair' , 'Sign of water damage present' , 'Sign of mold present' , 'Other', 'N/A']
  bedroomFloorsOptions = ['Hardwood flooring' , 'Laminate flooring' , 'Carpet flooring' , 'Engineered Hardwood' , 'Parquet flooring' , 'Other', 'N/A']
  bedroomFloorsConditionsOptions = ['Acceptable' , 'Marginal' , 'Minor scratch or chip present' , 'Water damage present' , 'Other', 'N/A']
  bedroomClosetsOptions = ['Built-in' , 'Walk-in' , 'N/A' , 'Other']
  bedroomClosetsConditionsOptions = ['Acceptable' , 'Marginal' , 'Minor scratch or chip present' , 'Water damage present' , 'Other', 'N/A']
  bedroomDoorsOptions = ['Hollow wood' , 'Wood' , 'Other', 'N/A']
  bedroomDoorsConditionsOptions = ['Acceptable' , 'Marginal condition' , 'Damaged door' , 'Not closing properly' , 'Lock not working' , 'Damaged or missing handle' , 'Other', 'N/A']
  bedroomWindowsOptions  = ['Acceptable' , 'Marginal' , 'Not closing properly' , 'Not locking properly' , 'Cracked glass' , 'Damaged window frame' , 'Missing screen' , 'Damaged screen' , 'Mold present' , 'Moisture stains present' , 'Other', 'N/A']
  bedroomElectricalsOptions = ['All outlets and lights are functional' , 'Some plugs or lights not working' , 'Other', 'N/A']
  bedroomHeatSourcesOptions = ['Central heating system' , 'Baseboard heating system' , 'No heat source present' , 'Other', 'N/A']
  bedroomMoistureStainsOptions = ['No sign of moisture' , 'Moisture stains present on windows' , 'Other', 'N/A']



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
    this.roomsDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      rooms: this._formBuilder.array([this.createRoomFormGroup()])
    });
  }

  get rooms(): FormArray {
    return this.roomsDetails.get('rooms') as FormArray;
  }


  createRoomFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      bedroomwall: this._formBuilder.group({
        bedroomsWalls: [''],
        otherBedroomsWalls: [''],
        bedroomsWallsCondition: [''],
        otherBedroomsWallsCondition: ['']
      }),
      ceiling: this._formBuilder.group({
        bedroomsCeilings: [''],
        otherBedroomsCeilings: [''],
        bedroomsCeilingsCondition: [''],
        otherBedroomsCeilingsCondition: ['']
      }),
      floor: this._formBuilder.group({
        bedroomsFloors: [''],
        otherBedroomsFloors: [''],
        bedroomsFloorsCondition: [''],
        otherBedroomsFloorsCondition: ['']
      }),
      closet: this._formBuilder.group({
        bedroomsClosets: [''],
        otherBedroomsClosets: [''],
        bedroomsClosetsCondition: [''],
        otherBedroomsClosetsCondition: ['']
      }),
      door: this._formBuilder.group({
        bedroomsDoors: [''],
        otherBedroomsDoors: [''],
        bedroomsDoorsCondition: [''],
        otherBedroomsDoorsCondition: ['']
      }),
      window: this._formBuilder.group({
        bedroomsWindows: [''],
        otherBedroomsWindows: ['']
      }),
      electrical: this._formBuilder.group({
        bedroomsElectricals: [''],
        otherBedroomsElectricals: ['']
      }),
      heatSource: this._formBuilder.group({
        bedroomsHeatSource: [''],
        otherBedroomsHeatSource: ['']
      }),
      moistureStains: this._formBuilder.group({
        bedroomsMoistureStains: [''],
        otherBedroomsMoistureStains: ['']
      }),
      bedroomsComments: ['']
    });
  }



  addRooms(): void {
    this.rooms.push(this.createRoomFormGroup());
  }

  removeRooms(index: number): void {
    this.rooms.removeAt(index);
  }

}

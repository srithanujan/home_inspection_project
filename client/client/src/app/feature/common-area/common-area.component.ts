import { Component, Input } from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormArray, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';

@Component({
  selector: 'app-common-area',
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
    MatButtonModule,
    ImageUploaderComponent
  ],
  templateUrl: './common-area.component.html',
  styleUrl: './common-area.component.scss'
})
export class CommonAreaComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() commonAreaDetails: FormGroup = this._formBuilder.group({});

  commonAreasWallsImage: string = 'commonAreasWallsImage';
  commonAreasCeilingImage: string = 'commonAreasCeilingImage';
  commonAreasFloorsImage: string = 'commonAreasFloorsImage';
  commonAreasWindowsImage: string = 'commonAreasWindowsImage';
  commonAreasElectricalImage: string = 'commonAreasElectricalImage';
  commonAreasHeatSourceImage: string = 'commonAreasHeatSourceImage';



  commonAreasWallsOptions = ['Drywall and paint' , 'Wood panel' , 'Other', 'N/A']
  commonAreasWallsConditionsOptions = ['Acceptable', 'Marginal', 'Minor crack or damage present', 'Sign of water damage present', 'Sign of mold present – Need *****', 'Small holes are present because of previous shelving installation', 'Other', 'N/A']
  commonAreasCeilingsOptions = ['Drywall and paint' , 'Wood panel' , 'Other', 'N/A']
  commonAreasCeilingsConditionsOptions =   ['Acceptable' , 'Cracked ceiling' , 'No current leak detected', 'Sign of previous leak noted', 'Recommend monitor and repair if leaking continues in the future' , 'Sagging or Bulging noted – Need repair' , 'Sign of water damage present' , 'Sign of mold present' , 'Other', 'N/A']
  commonAreasFloorsOptions = ['Hardwood flooring' , 'Laminate flooring' , 'Carpet flooring' , 'Engineered Hardwood' , 'Parquet flooring' , 'Other', 'N/A']
  commonAreasFloorsConditionsOptions = ['Acceptable' , 'Marginal' , 'Minor scratch or chip present' , 'Water damage present' , 'Crack tiles – Hollow under tiles', 'Other']
  commonAreasWindowsOptions  = ['Acceptable' , 'Marginal' , 'Not closing properly' , 'Not locking properly' , 'Cracked glass' , 'Damaged window frame' , 'Missing screen' , 'Damaged screen' , 'Mold present' , 'Moisture stains present' , 'Other', 'N/A']
  commonAreasElectricalsOptions = ['All outlets and lights are functional' , 'Some plugs or lights not working' , 'Other', 'N/A']
  commonAreasHeatSourcesOptions = ['Central heating system' , 'Baseboard heating system' , 'No heat source present' , 'Other', 'N/A']


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
    this.commonAreaDetails = this._formBuilder.group({
      inspectionId: this.requestId,
      commonAreas: this._formBuilder.array([this.createCommonAreasFormGroup()])
    });
  }

  get commonAreas(): FormArray {
    return this.commonAreaDetails.get('commonAreas') as FormArray;
  }

  createCommonAreasFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      commonAreaswall: this._formBuilder.group({
        commonAreasWalls: [''],
        othercommonAreasWalls: [''],
        commonAreasWallsCondition: [''],
        othercommonAreasWallsCondition: ['']
      }),
      ceiling: this._formBuilder.group({
        commonAreasCeilings: [''],
        othercommonAreasCeilings: [''],
        commonAreasCeilingsCondition: [''],
        othercommonAreasCeilingsCondition: ['']
      }),
      floor: this._formBuilder.group({
        commonAreasFloors: [''],
        othercommonAreasFloors: [''],
        commonAreasFloorsCondition: [''],
        othercommonAreasFloorsCondition: ['']
      }),

      window: this._formBuilder.group({
        commonAreasWindows: [''],
        othercommonAreasWindows: ['']
      }),
      electrical: this._formBuilder.group({
        commonAreasElectricals: [''],
        othercommonAreasElectricals: ['']
      }),
      heatSource: this._formBuilder.group({
        commonAreasHeatSource: [''],
        othercommonAreasHeatSource: ['']
      }),
      commonAreasComments: ['']
    });
  }



  addCommonAreas(): void {
    this.commonAreas.push(this.createCommonAreasFormGroup());
  }

  removeCommonAreas(index: number): void {
    this.commonAreas.removeAt(index);
  }

}

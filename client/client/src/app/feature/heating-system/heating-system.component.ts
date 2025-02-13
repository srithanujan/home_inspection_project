import { Component, Input } from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';


@Component({
  selector: 'app-heating-system',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    ImageUploaderComponent],
  templateUrl: './heating-system.component.html',
  styleUrl: './heating-system.component.scss'
})
export class HeatingSystemComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() heatingSystemDetails: FormGroup = this._formBuilder.group({});


  heatingSystemFilterImage: string = 'heatingSystemFilterImage';
  heatingSystemOperationImage: string = 'heatingSystemOperationImage';

  heatingSystemFurnaceLocationOptions = ['Basement', 'Closet', 'Attic', 'Other', 'N/A'];
  heatingSystemEnergySourceOptions = ['Natural Gas', 'Electricity', 'Oil', 'Other', 'N/A'];
  heatingSystemTypeOptions = ['Forced air', 'Baseboard', 'Other', 'N/A'];
  heatingSystemAreaServedOptions = ['Whole building', 'Partial building', 'Individual rooms', 'Other', 'N/A'];
  heatingSystemThermostatsOptions = ['Programmable', 'Manual', 'Other', 'N/A'];
  heatingSystemDistributionOptions = ['Metal duct', 'Aluminum hose', 'Other', 'N/A'];
  heatingSystemInteriorFuelStorageOptions = ['Other', 'N/A'];
  heatingSystemGasServiceLinesOptions = ['Black Iron', 'Copper', 'CSST – Corrugated Stainless-Steel Tubing', 'Galvanized steel', 'Other', 'N/A'];
  heatingSystemBlowerFanOptions = ['Direct drive', 'Other', 'N/A'];
  heatingSystemFilterOptions = ['Disposable air filter', 'Electrostatic air filter', 'Other', 'N/A'];
  heatingSystemSuspectedAsbestosOptions = ['No', 'Yes', 'N/A'];
  heatingSystemOperationOptions = ['Tested and working at the time of inspection', 'Tested and not working', 'Not Inspected – Gas turned off', 'Other', 'N/A'];
  heatingSystemConditionOptions = ['Acceptable', 'Blower fan very loud', 'Sign of water leak present – Need fix', 'Sign of previous water leak present – No current leak detected', 'Minor rust present', 'Outdated system', 'Other', 'N/A'];


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
    this.heatingSystemDetails = this.createHeatingSystemDetailsFormGroup();
  }

  private createHeatingSystemDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      heatingSystemFurnaceLocation: [''],
      otherHeatingSystemFurnaceLocation: [''],
      heatingSystemManufacturer: [''],
      heatingSystemApproximateAge: [''],
      heatingSystemEnergySource: [''],
      otherHeatingSystemEnergySource: [''],
      heatingSystemType: [''],
      otherHeatingSystemType: [''],
      heatingSystemAreaServed: [''],
      otherHeatingSystemAreaServed: [''],
      heatingSystemThermostats: [''],
      otherHeatingSystemThermostats: [''],
      heatingSystemDistribution: [''],
      otherHeatingSystemDistribution: [''],
      heatingSystemInteriorFuelStorage: [''],
      otherHeatingSystemInteriorFuelStorage: [''],
      heatingSystemGasServiceLines: [''],
      otherHeatingSystemGasServiceLines: [''],
      heatingSystemBlowerFan: [''],
      otherHeatingSystemBlowerFan: [''],
      heatingSystemFilter: [''],
      otherHeatingSystemFilter: [''],
      heatingSystemSuspectedAsbestos: [''],
      otherHeatingSystemSuspectedAsbestos: [''],
      heatingSystemOperation: [''],
      otherHeatingSystemOperation: [''],
      heatingSystemCondition: [''],
      otherHeatingSystemCondition: [''],
      heatingSystemComments: ['']
    });
  }


}

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

import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';

@Component({
  selector: 'app-laundry',
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
    ImageUploaderComponent,
  ],
  templateUrl: './laundry.component.html',
  styleUrl: './laundry.component.scss'
})
export class LaundryComponent {
  @Input() laundryDetails: FormGroup;


  laundryImage: string = 'laundryImage';





  laundryCeilingOptions = ['Drywall and paint', 'Exposed wood framing', 'Other', 'N/A'];
  laundryWallsOptions = ['Drywall', 'Drywall and tiles', 'Poured concrete with exposed wood framing', 'Other', 'N/A'];
  laundryFloorsOptions = ['Tiles flooring with floor drain', 'Poured concrete', 'No floor drains present', 'Other', 'N/A'];
  laundryWasherOptions = ['Tested and working at the time of inspection', 'Tested not working – Need repair or replace', 'Not inspected - unplugged by seller', 'Working but outdated washer', 'Other', 'N/A'];
  laundryDryerOptions = ['Tested and working at the time of inspection', 'Tested not working – Need repair or replace', 'Not inspected - unplugged by seller', 'Working but outdated dryer', 'Other', 'N/A'];
  laundryPipesLeakOptions = ['No sign of pipe leak', 'Sign of previous pipe leak present', 'Water damage to the whole flooring', 'Other', 'N/A'];
  laundryWasherDrainOptions = ['Drain into the laundry drain', 'Unsecure – Need fix', 'Minor leak present – Need fix', 'Sign of previous leak present', 'Other', 'N/A'];
  laundrySinkOptions = ['Present and Acceptable', 'Damaged sink – Need replace', 'Plumbing leak present – Need repair', 'Other', 'N/A'];
  laundryFaucetOptions = ['Acceptable - No sign of leak', 'Minor leak present – Need repair', 'Missing handle – Need repair', 'Unsecure – Need fix', 'Other', 'N/A'];
  laundryHeatSourceOptions = ['Central heating', 'Baseboard heating', 'Other', 'N/A'];
  laundryElectricalOptions = ['All outlets and lights working', 'Some outlets and or lights not working', 'Other', 'N/A'];
  laundryRoomVentedOptions = ['Yes', 'No', 'N/A'];
  laundryDryerVentOptions = ['Dryer vented outside', 'Damaged or crushed vent line – Need repair', 'Not connected properly – Need fix', 'Vent line is too long and spiral', 'Vent exhaust cover full of lint – Need cleanup', 'Other', 'N/A'];



  constructor(private _formBuilder: FormBuilder) {
    this.laundryDetails = this._formBuilder.group({
      laundrys: this._formBuilder.array([this.createlaundrysFormGroup()])
    });
  }

  ngOnInit(): void {
  }

  get laundrys(): FormArray {
    return this.laundryDetails.get('laundrys') as FormArray;
  }

  createlaundrysFormGroup(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      laundryCeiling: [''],
      otherLaundryCeiling: [''],
      laundryWalls: [''],
      otherLaundryWalls: [''],
      laundryFloor: [''],
      otherLaundryFloor: [''],
      laundryWasher: [''],
      otherLaundryWasher: [''],
      laundryDryer: [''],
      otherLaundryDryer: [''],
      laundryPipesLeak: [''],
      otherLaundryPipesLeak: [''],
      laundryWasherDrain: [''],
      otherLaundryWasherDrain: [''],
      laundrySink: [''],
      otherLaundrySink: [''],
      laundryFaucet: [''],
      otherLaundryFaucet: [''],
      laundryHeatSource: [''],
      otherLaundryHeatSource: [''],
      laundryElectrical: [''],
      otherLaundryElectrical: [''],
      laundryRoomVented: [''],
      otherLaundryRoomVented: [''],
      laundryDryerVent: [''],
      otherLaundryDryerVent: [''],
      laundryComments: [''],
    });
  }



  addlaundrys(): void {
    this.laundrys.push(this.createlaundrysFormGroup());
  }

  removelaundrys(index: number): void {
    this.laundrys.removeAt(index);
  }

}

import { Component, Input } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReplaySubject } from 'rxjs';
import { FeatureService } from '../services/feature.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';

@Component({
  selector: 'app-garage-carport',
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
    ImageUploaderComponent],
  templateUrl: './garage-carport.component.html',
  styleUrl: './garage-carport.component.scss'
})
export class GarageCarportComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() garageCarportDetails: FormGroup = this._formBuilder.group({});

  uploadImageName: string = 'building';

  garageCarpotImage: string = 'garageCarpotImage';



  garageCarportImage: string = "garageCarportImage";
  typeOptions = ["Attached", "Detached", "Other","N/A"];
  garageDoorOptions = ["Fiber glass", "Wood", "Metal", "Other", "N/A"];
  garageDoorConditionOptions = ["Acceptable condition" , "Marginal condition" , "Other", "N/A"];
  automaticOpenerOptions = ["Installed and Operable", "Not installed – manual door", "Installed not operable", "Other", "N/A"];
  safetyReversesOptions = ["Installed and Operable", "Installed not operable – Need fix", "Not Installed", "Other", "N/A"];
  roofingOptions = ["Same as house", "Flat roof", "Other", "N/A"];
  floorFoundationOptions = ["Poured concrete", "Gravel", "Other", "N/A"];
  floorFoundationConditionOptions = ["Minor settling cracks", "Salt damage", "Moisture damage", "Other", "N/A"];
  ceilingOptions = ["Drywall", "Wood", "Other", "N/A"];
  ceilingConditionOptions = ["Acceptable condition", "Marginal condition", "No current leak detected", "Sign of previous leak noted, Recommend monitor and repair if leaking continues in the future", "Other", "N/A"];
  exteriorWallsOptions = ["Bricks", "Concrete blocks", "Aluminum siding", "Vinyl siding", "Other", "N/A"];
  interiorWallsOptions = ["Wood frame", "Wood frame with drywall", "Other", "N/A"];
  serviceDoorOptions = ["Present", "N/A"];
  serviceDoorConditionOptions = ["Acceptable condition", "Marginal condition", "Other", "N/A"];
  serviceDoorSelfCloseOptions = ["Installed and operable", "Installed not operable – Need fix", "Not installed – Recommended to install self-closing door", "Other", "N/A"];
  electricalOptions = ["Present and functional", "Present and partially functional", "No receptacle present", "Unknown – No or very limited access – full of storage", "Other", "N/A"];
  fireSeparationWallOptions = ["Unknown - Covered by drywall", "Present", "Not present", "Other", "N/A"];
  commentsOptions = ['Other'];
  garageRoofingConditionOptions = ["Acceptable condition" , "Other", "N/A"];


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

  ngOnInit(): void { }

  private initializeForms(): void {
    this.garageCarportDetails = this.createGarageCarportDetailsFormGroup();
  }

  private createGarageCarportDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      garageCarportType: [''],
      otherGarageCarportType: [''],
      garageCarportGarageDoor: [''],
      otherGarageCarportGarageDoor: [''],
      garageCarportDoorCondition: [''],
      otherGarageCarportDoorCondition: [''],
      garageCarportComments: [''],
      garageCarportAutomaticOpener: [''],
      otherGarageCarportAutomaticOpener: [''],
      garageCarportSafetyReverses: [''],
      otherGarageCarportSafetyReverses: [''],
      garageCarportRoofing: [''],
      garageCarportRoofingCondition: [''],
      otherGarageCarportRoofingCondition: [''],
      garageCarportFloorFoundation: [''],
      otherGarageCarportFloorFoundation: [''],
      garageCarportFloorFoundationCondition: [''],
      otherGarageCarportFloorFoundationCondition: [''],
      garageCarportCeiling: [''],
      otherGarageCarportCeiling: [''],
      garageCarportCeilingCondition: [''],
      otherGarageCarportCeilingCondition: [''],
      garageCarportExteriorWalls: [''],
      otherGarageCarportExteriorWalls: [''],
      garageCarportInteriorWalls: [''],
      otherGarageCarportInteriorWalls: [''],
      serviceDoor: this._formBuilder.array([this.createServiceDoorFormGroup()]),
      garageCarportElectricalReceptaclesLights: [''],
      otherGarageCarportElectricalReceptaclesLights: [''],
      garageCarportFireSeparationwall: [''],
      otherGarageCarportFireSeparationwall: [''],
      garageCarportElectricalReceptaclesLightsComments: ['']
    });
  }

  get serviceDoorForm(): FormArray {
    return this.garageCarportDetails.get('serviceDoor') as FormArray;
  }

  createServiceDoorFormGroup(): FormGroup {
    return this._formBuilder.group({
      garageCarportServiceDoor: [''],
      garageCarportServiceDoorCondition: [''],
      otherGarageCarportServiceDoorCondition: [''],
      garageCarportServiceDoorSelfClose: [''],
      otherGarageCarportServiceDoorSelfClose: ['']
    });
  }

  addServiceDoor(): void {
    this.serviceDoorForm.push(this.createServiceDoorFormGroup());
  }

  removeServiceDoor(index: number): void {
    this.serviceDoorForm.removeAt(index);
  }


}







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
  selector: 'app-electrical-system',
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
    ImageUploaderComponent
  ],
  templateUrl: './electrical-system.component.html',
  styleUrl: './electrical-system.component.scss'
})
export class ElectricalSystemComponent {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  @Input() electricalSystemDetails: FormGroup = this._formBuilder.group({});

  electricalSystemMainElectricalPanelImage: string = 'electricalSystemMainElectricalPanelImage';
  electricalSystemLightAndOutletsImage: string = 'electricalSystemLightAndOutletsImage';



  electricalMainElectricalPanelLocationOptions = ['Basement', 'Garage', 'Closet', 'Other', 'N/A'];
  electricalMainElectricalPanelConditionOptions = ['Acceptable condition', 'Marginal condition', 'Other', 'N/A'];
  electricalAdequateClearanceToPanelOptions = ['Yes', 'No', 'Other', 'N/A'];
  electricalMainBreakerSizeOptions = ['100 Amps', '125 Amps', '200 Amps', '60 Amps', 'Other', 'N/A'];
  electricalServiceSizeAmpsOptions = ['100 Amps', '125 Amps', '200 Amps', '60 Amps', 'Other', 'N/A'];
  electricalVoltsOptions = ['120/240 VAC Breakers', '120/240 Fuse', 'Other', 'N/A'];
  electricalAppearsGroundedOptions = ['Yes', 'No', 'Other', 'N/A'];
  electricalMainWiringOptions = ['Copper', 'Copper and Aluminum', 'Aluminum', 'Other', 'N/A'];
  electricalMainElectricalPanelCommentsOptions = ['There is extra breaker space.  This provides extra flexibility for future electrical endeavors'  , 'Other', 'N/A'];


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
    this.electricalSystemDetails = this.createElectricalSystemDetailsFormGroup();
  }

  private createElectricalSystemDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      mainElectricalPanel: this._formBuilder.group({
        electricalMainElectricalPanelLocation: [''],
        otherElectricalMainElectricalPanelLocation: [''],
        electricalMainElectricalPanelCondition: [''],
        otherElectricalMainElectricalPanelCondition: [''],
        electricalAdequateClearanceToPanel: [''],
        otherElectricalAdequateClearanceToPanel: [''],
        electricalMainBreakerSize: [''],
        otherElectricalMainBreakerSize: [''],
        electricalServiceSizeAmps: [''],
        otherElectricalServiceSizeAmps: [''],
        electricalVolts: [''],
        otherElectricalVolts: [''],
        electricalAppearsGrounded: [''],
        otherElectricalAppearsGrounded: [''],
        electricalMainWiring: [''],
        otherElectricalMainWiring: [''],
        electricalMainElectricalPanelComments: [''],
        otherElectricalMainElectricalPanelComments: ['']
      }),
      lightingAndOutlets: this._formBuilder.group({
        electricallightsAndOutletsComments: [''],
      })
    });
  }


}

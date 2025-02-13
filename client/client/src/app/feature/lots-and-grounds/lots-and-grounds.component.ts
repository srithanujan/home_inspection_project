import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FeatureService } from '../services/feature.service';
import { InspectionUpdatesService } from '../../shared/services/check-updates/services/inspection-updates.service';

import { ImageUploaderComponent } from '../../shared/image-upload/image-uploader/image-uploader.component';

@Component({
  selector: 'app-lots-and-grounds',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    ImageUploaderComponent
  ],
  templateUrl: './lots-and-grounds.component.html',
  styleUrls: ['./lots-and-grounds.component.scss']
})
export class LotsAndGroundsComponent implements OnInit {
  private _destroy$: ReplaySubject<any> = new ReplaySubject(1);
  requestId: string = '';
  inspectionUpdate: any;
  @Input() lotsGroundsDetails: FormGroup = this._formBuilder.group({});

  lotsAndGroundsDrivewayImage: string = 'lotsAndGroundsDrivewayImage';
  lotsAndGroundsPorchImage: string = 'lotsAndGroundsPorchImage';
  lotsAndGroundsStepsAndHandrailsImage: string = 'lotsAndGroundsStepsAndHandrailsImage';
  lotsAndGroundsDeckPatioBalconyImage: string = 'lotsAndGroundsDeckPatioBalconyImage';
  lotsAndGroundsFenceImage: string = 'lotsAndGroundsFenceImage';
  lotsAndGroundsLandscapingAffectingImage: string = 'lotsAndGroundsLandscapingAffectingImage';



  drivayParkingImage: string = 'drivayParking';
  porchImage: string = 'porchImage';
  handrailsImage: string = 'handrailsImage';
  balconyImage: string = 'balconyImage';
  fenceImage: string = 'fenceImage';
  landscapingImage: string = 'landscapingImage';
  drivewayMaterialOptions = ['N/A', 'Asphalt', 'Interlock', 'Concrete', 'Other'];
  drivewayConditionOptions = ['N/A', 'Acceptable condition', 'Marginal condition', 'Other'];
  drivewayCommentsOptions = ['Pitched away from home' , 'Settling cracks' , 'Pitched towards the house' , 'Floor drain installed (Recommend to keep the floor drain clear of debris and blockage)' , 'Pavers are correctly placed and supported' , 'Other' , 'N/A'];
  porchMaterialOptions = ['N/A', 'Concrete', 'Interlock stones', 'Concrete slabs', 'Treated wood', 'Other'];
  porchConditionOptions = ['Acceptable condition' , 'Marginal condition' , 'No railings installed' , 'Unstable railings' , 'Damaged or cracked flooring' , 'Deteriorated or rotten wood' , 'Other' , 'N/A'];
  stepsHandrailsMaterialOptions = ['N/A', 'Concrete', 'Stones', 'Handrail present', 'No handrails', 'Other'];
  stepsHandrailsConditionOptions = [ 'Acceptable condition' , 'Marginal condition' , 'Deteriorated or rotten wood – Repair or replacing of wood should be anticipated in the future' , 'Unstable steps – Need repair' , 'Unstable railings and handrails – Need repair' , 'Other' , 'N/A' ];
  deckPatioMaterialOptions = ['N/A', 'Treated wood', 'Fiberglass', 'Interlock stones', 'Concrete slabs', 'Concrete', 'Other'];
  deckPatioConditionOptions = ['Acceptable condition' , 'Marginal condition' , 'Deteriorated or rotten wood – Repair or replacing of wood should be anticipated in the future' , 'Unstable steps – Need repair' , 'Unstable railings and handrails – Need repair' , 'Other' , 'N/A'];
  fenceMaterialOptions = ['N/A', 'Treated wood', 'Metal mesh (W chain link fencing)', 'Fiberglass', 'Metal frame with wood', 'Other'];
  fenceConditionOptions = ['N/A', 'Acceptable condition', 'Marginal condition', 'Leaning or unstable fence', 'Broken or missing slat', 'Sagging due to deteriorating posts', 'Damaged metal mesh'];
  landscapingRecommendations = [
    'N/A',
    'Recommend removing all vegetation around the foundation wall',
    'Recommend window wells covers for basement windows',
    'Recommend landscaping the house accordingly so the rainwater runs away from the house',
    'Other'
  ];
  fenceComments = ['Since we have a wood fence system, wood will deteriorate overtime, and a regular maintenance and repair are expected']

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
    this.lotsGroundsDetails = this.createLotsGroundsDetailsFormGroup();
  }

  getUpdatesTrigger() {
    this.inspectionUpdatesService.currentUpdate.subscribe(
      update => {
        this.inspectionUpdate = update;
          if(this.inspectionUpdate.groundsInfo && (this.inspectionUpdate._id === this.requestId)) {
            this.getLotsAndGroundInformation();
          }
      },
      error => {
        console.error('Error fetching inspection update:', error);
      }
    );
  }

  private createLotsGroundsDetailsFormGroup(): FormGroup {
    return this._formBuilder.group({
      inspectionId: this.requestId,
      driveway: this._formBuilder.group({
        material: [''],
        otherMaterial: [''],
        condition: [''],
        otherCondtion: [''],
        comments: [''],
        otherComments: ['']
      }),
      porch: this._formBuilder.group({
        material: [''],
        otherMaterial: [''],
        condition: [''],
        otherCondition: [''],
        comments: ['']
      }),
      stepsHandrails: this._formBuilder.group({
        material: [''],
        otherMaterial: [''],
        condition: [''],
        otherCondition: [''],
        comments: [''],
        otherComments: ['']
      }),
      deckPatio: this._formBuilder.array([this.createDeckPatioFormGroup()]),
      fence: this._formBuilder.group({
        material: [''],
        otherMaterial: [''],
        condition: [''],
        otherCondtion: [''],
        comments: [''],
        otherComments: ['']
      }),
      landscaping: this._formBuilder.group({
        recommendations: [''],
        otherRecommendations: ['']
      })
    });
  }


  get deckPatioForm(): FormArray {
    return this.lotsGroundsDetails.get('deckPatio') as FormArray;
  }

  createDeckPatioFormGroup(): FormGroup {
    return this._formBuilder.group({
      material: [''],
      otherMaterial: [''],
      condition: [''],
      otherCondition: [''],
      comments: ['']
    });
  }

  addDeckPatio(): void {
    this.deckPatioForm.push(this.createDeckPatioFormGroup());
  }

  removeDeckPatio(index: number): void {
    this.deckPatioForm.removeAt(index);
  }


getLotsAndGroundInformation() {
  this.featureService.getLotsAndGroundsApi(this.requestId)
    .pipe(takeUntil(this._destroy$))
    .subscribe((response: any) => {
      if (response.message === 200 && response.groundsDetails) {
        const groundsData = response.groundsDetails;
        const lotsGroundsFormGroup = this.mapLotsGroundsDetailsFormGroup(groundsData);
        this.lotsGroundsDetails.patchValue(lotsGroundsFormGroup.value);
      }
    });
}

private mapLotsGroundsDetailsFormGroup(groundsData: any): FormGroup {
  const deckPatioArray = this._formBuilder.array(
    groundsData.deckPatio.map((deck: any) => this._formBuilder.group({
      material: this._formBuilder.control({ value: deck.material, disabled: false }),
      otherMaterial: this._formBuilder.control({ value: deck.otherMaterial, disabled: false }),
      condition: this._formBuilder.control({ value: deck.condition, disabled: false }),
      otherCondition: this._formBuilder.control({ value: deck.otherCondition, disabled: false }),
      comments: this._formBuilder.control({ value: deck.comments, disabled: false })
    }))
  );

  return this._formBuilder.group({
    driveway: this._formBuilder.group({
      material: this._formBuilder.control({ value: groundsData.driveway.material, disabled: false }),
      otherMaterial: this._formBuilder.control({ value: groundsData.driveway.otherMaterial, disabled: false }),
      condition: this._formBuilder.control({ value: groundsData.driveway.condition, disabled: false }),
      otherCondtion: this._formBuilder.control({ value: groundsData.driveway.otherCondtion, disabled: false }),
      comments: this._formBuilder.control({ value: groundsData.driveway.comments, disabled: false }),
      otherComments: this._formBuilder.control({ value: groundsData.driveway.otherComments, disabled: false })
    }),
    porch: this._formBuilder.group({
      material: this._formBuilder.control({ value: groundsData.porch.material, disabled: false }),
      otherMaterial: this._formBuilder.control({ value: groundsData.porch.otherMaterial, disabled: false }),
      condition: this._formBuilder.control({ value: groundsData.porch.condition, disabled: false }),
      otherCondition: this._formBuilder.control({ value: groundsData.porch.otherCondition, disabled: false }),
      comments: this._formBuilder.control({ value: groundsData.porch.comments, disabled: false })
    }),
    stepsHandrails: this._formBuilder.group({
      material: this._formBuilder.control({ value: groundsData.stepsHandrails.material, disabled: false }),
      otherMaterial: this._formBuilder.control({ value: groundsData.stepsHandrails.otherMaterial, disabled: false }),
      condition: this._formBuilder.control({ value: groundsData.stepsHandrails.condition, disabled: false }),
      otherCondition: this._formBuilder.control({ value: groundsData.stepsHandrails.otherCondition, disabled: false }),
      comments: this._formBuilder.control({ value: groundsData.stepsHandrails.comments, disabled: false }),
      otherComments: this._formBuilder.control({ value: groundsData.stepsHandrails.otherComments, disabled: false })
    }),
    deckPatio: deckPatioArray,
    fence: this._formBuilder.group({
      material: this._formBuilder.control({ value: groundsData.fence.material, disabled: false }),
      otherMaterial: this._formBuilder.control({ value: groundsData.fence.otherMaterial, disabled: false }),
      condition: this._formBuilder.control({ value: groundsData.fence.condition, disabled: false }),
      otherCondtion: this._formBuilder.control({ value: groundsData.fence.otherCondtion, disabled: false }),
      comments: this._formBuilder.control({ value: groundsData.fence.comments, disabled: false }),
      otherComments: this._formBuilder.control({ value: groundsData.fence.otherComments, disabled: false })
    }),
    landscaping: this._formBuilder.group({
      recommendations: this._formBuilder.control({ value: groundsData.landscaping.recommendations, disabled: false }),
      otherRecommendations: this._formBuilder.control({ value: groundsData.landscaping.otherRecommendations, disabled: false })
    })
  });
}

}

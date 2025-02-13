import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InspectionUpdate } from '../../../../feature/models/feature.model';

@Injectable({
  providedIn: 'root'
})
export class InspectionUpdatesService {
  private  imageUpdate = new BehaviorSubject<any>("");
  private  imageDelete = new BehaviorSubject<any>("");
  private update = new BehaviorSubject<InspectionUpdate>({
    _id: '',
    inspections: '',
    generalInfo: '',
    buildingInfo: '',
    groundsInfo: '',
    roofInfo: '',
    exteriorInfo: '',
    garageCarportInfo: '',
    kitchenInfo: '',
    bathroomInfo: '',
    roomInfo: '',
    commonAreasInfo: '',
    laundryInfo: '',
    plumbingInfo: '',
    interiorInfo: '',
    heatingSystemInfo: '',
    electricalSystemInfo: '',
    basementInfo: ''
  });

  currentUpdate = this.update.asObservable();
  currentImageUpdate = this.imageUpdate.asObservable();
  currentImageDelete = this.imageDelete.asObservable();

  updateInspectionData(newUpdate: InspectionUpdate) {
    this.update.next(newUpdate);
  }

  updateImageData(newUpdate: any) {
    this.imageUpdate.next(newUpdate);
  }

  deleteImageData(newDelete: any) {
    this.imageDelete.next(newDelete);
  }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Feature,
  Inspection,
  PostResponse,
  CombinedDetails,
  BuildingDetails,
  LotsGroundsDetails,
  RoofDetails,
  ExteriorDetails,
  KitchenDetails,
  GarageCarportDetails,
  RoomDetails,
  BathroomDetails,
  CommonAreaDetails,
  LaundryDetails,
  PlumbingDetails,
  HeatingSystemDetails,
  ElectricalSystemDetails,
  BasementDetails,
  Result,
  InteriorDetails,
} from '../models/feature.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private baseUrl = `${environment.apiUrl}/inspection`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${this.baseUrl}/fetchInspectors`);
  }
  create(feature: Feature): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, feature);
  }

  createGeneralInformationApi(combinedDetails: CombinedDetails) {
    return this.http.post(
      `${this.baseUrl}/createGeneralInfoUri`,
      combinedDetails
    );
  }

  getInspectionTableApi() {
    return this.http.get(`${this.baseUrl}/getInspectionTableUri`);
  }

  deleteInspectionApi(id: string) {
    return this.http.delete(`${this.baseUrl}/deleteInspectionUri/${id}`);
  }

  getInspectionSchemaApi(id: string) {
    return this.http.get(`${this.baseUrl}/getInspectionSchemaUri/${id}`);
  }

  getGeneralInformationApi(id: string) {
    return this.http.get(`${this.baseUrl}/getGeneralInfoUri/${id}`);
  }

  createBuildingDataApi(buildingDetails: BuildingDetails) {
    return this.http.post(
      `${this.baseUrl}/createBuildingDataUri`,
      buildingDetails
    );
  }

  getBuildingDataApi(id: string) {
    return this.http.get(`${this.baseUrl}/getBuildingDataUri/${id}`);
  }

  createLotsAndGroundsApi(lotsGroundsDetails: LotsGroundsDetails) {
    return this.http.post(
      `${this.baseUrl}/createLotsAndGroundsUri`,
      lotsGroundsDetails
    );
  }

  getLotsAndGroundsApi(id: string) {
    return this.http.get(`${this.baseUrl}/getLotsAndGroundsUri/${id}`);
  }

  createRoofApi(roofDetails: RoofDetails) {
    return this.http.post(`${this.baseUrl}/createRoofUri`, roofDetails);
  }

  getRoofApi(id: string) {
    return this.http.get(`${this.baseUrl}/getRoofUri/${id}`);
  }

  createExteriorApi(exteriorDetails: ExteriorDetails) {
    return this.http.post(`${this.baseUrl}/createExteriorUri`, exteriorDetails);
  }

  getExteriorApi(id: string) {
    return this.http.get(`${this.baseUrl}/getExteriorUri/${id}`);
  }

  createGarageCarpotApi(garageCarportDetails: GarageCarportDetails) {
    return this.http.post(
      `${this.baseUrl}/createGarageCarpotUri`,
      garageCarportDetails
    );
  }

  createKitchenApi(kitchenDetails: KitchenDetails) {
    return this.http.post(`${this.baseUrl}/createKitchenUri`, kitchenDetails);
  }

  createBathroomApi(bathroomDetails: BathroomDetails) {
    return this.http.post(`${this.baseUrl}/createBathroomUri`, bathroomDetails);
  }

  createRoomApi(roomDetails: RoomDetails) {
    return this.http.post(`${this.baseUrl}/createRoomUri`, roomDetails);
  }

  createCommonAreaApi(commonAreaDetails: CommonAreaDetails) {
    return this.http.post(
      `${this.baseUrl}/createCommonAreaUri`,
      commonAreaDetails
    );
  }

  createLaundryApi(laundryDetails: LaundryDetails) {
    return this.http.post(`${this.baseUrl}/createLaundryUri`, laundryDetails);
  }

  createInteriorApi(interiorDetails: InteriorDetails) {
    return this.http.post(`${this.baseUrl}/createInteriorUri`, interiorDetails);
  }

  createPlumbingApi(plumbingDetails: PlumbingDetails) {
    return this.http.post(`${this.baseUrl}/createPlumbingUri`, plumbingDetails);
  }

  createHeatingSystemApi(heatingSystemDetails: HeatingSystemDetails) {
    return this.http.post(
      `${this.baseUrl}/createHeatingSystemUri`,
      heatingSystemDetails
    );
  }

  createElectricalSystemApi(electricalSystemDetails: ElectricalSystemDetails) {
    return this.http.post(
      `${this.baseUrl}/createElectricalSystemUri`,
      electricalSystemDetails
    );
  }

  createBasementApi(basementDetails: BasementDetails) {
    return this.http.post(`${this.baseUrl}/createBasementUri`, basementDetails);
  }

  createFullInspectionApi(inspection: Inspection): Observable<Result> {
    return this.http.post<Result>(
      `${this.baseUrl}/createInspectionUri`,
      inspection
    );
  }

  // generatePDF(): Observable<Blob> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   return this.http.get(`${this.baseUrl}/generatePDF`, { headers, responseType: 'blob' });
  // }
  generatePDF(inspectionId: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(`${this.baseUrl}/generatePDF/${inspectionId}`, {
      headers,
      responseType: 'blob',
    });
  }
  getAllPosts(fieldName?: string): Observable<any> {
    const url = fieldName
      ? `${this.baseUrl}/getPost?fieldName=${fieldName}`
      : `${this.baseUrl}/getPost`;
    return this.http.get<any>(url);
  }

  deleteAllFiles(): Observable<any> {
    const url = `${this.baseUrl}/api/deleteAllFiles`;
    return this.http.post<any>(url, {});
  }

  getImages(): Observable<PostResponse> {
    const url = `${this.baseUrl}/getPost`;
    return this.http.get<PostResponse>(url);
  }
}

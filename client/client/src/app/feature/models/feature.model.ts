// feature.model.ts

export interface ClientInformation {
  contactName: string;
  clientAddress: string;
  phoneNumber: string;
  email: string;
}

export interface InspectionCompany {
  inspectorName: string;
  inspectionAddress: string;
  phoneNumber: string;
  email: string;
}

export interface CombinedDetails {
  clientInformation: ClientInformation;
  inspectionCompany: InspectionCompany;
  inspectionId: string;
}


export interface BuildingDetails {
  estimatedAge: string;
  buildingType: string;
  otherBuildingType: string;
  occupancyState: string;
  otherOccupancyState: string;
  garage: string;
  otherGarage: string;
  exterior: string;
  otherExterior: string;
  weatherCondition: string;
  otherWeatherCondition: string;
  soilCondition: string;
  otherSoilCondition: string;
  outdoorTemperature: string;
  inspectionDate: string;
  startTime: string;
  endTime: string;
  recentRain: string;
  electricityOn: string;
  otherElectricityOn: string;
  gasOilOn: string;
  otherGasOilOn: string;
  waterOn: string;
  otherWaterOn: string;
}

export interface Driveway {
  material: string;
  otherMaterial: string;
  condition: string;
  otherCondition: string;
  comments: string;
  otherComments: string;
}

export interface Porch {
  material: string;
  otherMaterial: string;
  condition: string;
  otherCondition: string;
  comments: string;
}

export interface StepsHandrails {
  material: string;
  otherMaterial: string;
  condition: string;
  otherCondition: string;
  comments: string;
  otherComments: string;
}

export interface DeckPatio {
  material: string;
  otherMaterial: string;
  condition: string;
  otherCondition: string;
  comments: string;
}

export interface Fence {
  material: string;
  otherMaterial: string;
  condition: string;
  otherCondition: string;
  comments: string;
  otherComments: string;
}

export interface Landscaping {
  recommendations: string;
  otherRecommendations: string;
}

export interface LotsGroundsDetails {
  driveway: Driveway;
  porch: Porch;
  stepsHandrails: StepsHandrails;
  deckPatio: DeckPatio[];
  fence: Fence;
  landscaping: Landscaping;
}

export interface RoofDescription {
  style: string;
  otherStyle: string;
  pitch: string;
  otherPitch: string;
  visibility: string;
  otherVisibility: string;
  methodOfInspection: string;
  otherMethodOfInspection: string;
  ventilationPresent: string;
  ventilationType: string;
  otherVentilationType: string;
}

export interface ConditionOfCoverings {
  material: string;
  approximateAgeShingles: string;
  otherMaterial: string;
  condition: string;
  otherCondtion: string;
  comments: string;
}

export interface PlumbingVents {
  plumbingOfVents: string;
  otherPlumbingOfVents: string;
  type: string;
  otherType: string;
  condition: string;
  otherCondition: string;
  comments: string;
}

export interface RoofDetails {
  roofDescription: RoofDescription;
  conditionOfCoverings: ConditionOfCoverings;
  plumbingVents: PlumbingVents;
}

/////////

export interface ExteriorWall {
  exteriorWallType: string;
  otherExteriorWallType: string;
  exteriorWallCondition: string;
  otherExteriorWallCondition: string;
  exteriorWallComments: string;
}

export interface Foundation {
  foundationType: string;
  otherFoundationType: string;
  exteriorFoundationCondition: string;
  otherExteriorFoundationCondition: string;
  foundationComments: string;
  otherFoundationComments: string;
  interiorFoundationCondition: string;
  otherInteriorFoundationCondition: string;
  interiorFoundationComments: string;
  otherInteriorFoundationComments: string;
  cracks: string;
  otherCracks: string;
  coveredFoundationWalls: string;
  otherCoveredFoundationWalls: string;
  coveredFoundationWallsComments: string;
}

export interface ExteriorDoor {
  exteriorDoorMainEntryDoor: string;
  otherExteriorDoorMainEntryDoor: string;
  exteriorDoorDoorCondition: string;
  otherExteriorDoorDoorCondition: string;
  exteriorDoorWeatherStripping: string;
  exteriorDoorStormDoor: string;
  exteriorDoorStormDoorCondition: string;
  otherExteriorDoorStormDoorCondition: string;
  exteriorDoorDoorBell: string;
  otherExteriorDoorDoorBell: string;
  exteriorDoorDoorBellType: string;
  otherExteriorDoorDoorBellType: string;
}

export interface ExteriorSideDoor {
  exteriorSideDoors: string;
  otherExteriorSideDoors: string;
  exteriorSideDoorsDoorCondition: string;
  otherExteriorSideDoorsDoorCondition: string;
  exteriorSideDoorsWeatherStripping: string;
  otherExteriorSideDoorsWeatherStripping: string;
}

export interface ExteriorPatioDoor {
  exteriorPatioDoors: string;
  otherExteriorPatioDoors: string;
  exteriorPatioDoorsCondition: string;
  otherExteriorPatioDoorsCondition: string;
  exteriorPatioDoorsComments: string;
  otherExteriorPatioDoorsComments: string;
}

export interface ExteriorPatioScreenDoor {
  exteriorPatioScreensDoors: string;
  otherExteriorPatioScreensDoors: string;
  exteriorPatioDoorScreensCondition: string;
  otherExteriorPatioDoorScreesCondition: string;
  exteriorPatioDoorScreensComments: string;
  otherExteriorPatioDoorScreensComments: string;
}

export interface Gutter {
  guttersDownspoutsRoofDrainageMaterial: string;
  otherGuttersDownspoutsRoofDrainageMaterial: string;
  guttersDownspoutsRoofDrainageCondition: string;
  otherGuttersDownspoutsRoofDrainageCondition: string;
  guttersDownspoutsRoofDrainageLeaking: string;
  otherGuttersDownspoutsRoofDrainageLeaking: string;
  guttersDownspoutsRoofDrainageAttachment: string;
  otherGuttersDownspoutsRoofDrainageAttachment: string;
  guttersDownspoutsRoofDrainageExtensionNeeded: string;
  otherGuttersDownspoutsRoofDrainageExtensionNeeded: string;
  guttersDownspoutsRoofDrainageComments: string;
  otherGuttersDownspoutsRoofDrainageComments: string;
}

export interface Window {
  windowsApproximateAge: string;
  otherWindowsApproximateAge: string;
  windowsMaterialAndType: string;
  otherWindowsMaterialAndType: string;
  windowsCondition: string;
  otherWindowsCondition: string;
  windowsComments: string;
  otherWindowsComments: string;
  windowScreens: string;
  windowScreensCondition: string;
  otherWindowScreensCondition: string;
  windowScreensComments: string;
  otherWindowScreensComments: string;
  basementWindows: string;
  basementWindowsApproximateAge: string;
  basementWindowsMaterial: string;
  otherBasementWindowsMaterial: string;
  basementWindowsCondition: string;
  otherBasementWindowsCondition: string;
  basementWindowsComments: string;
  otherBasementWindowsComments: string;
}

export interface GasMeter {
  gasMeterType: string;
  otherGasMeterType: string;
  gasMeterCondition: string;
  otherGasMeterCondition: string;
  gasMeterComments: string;
}

export interface Electricity {
  exteriorOutletsAndLights: string;
  otherExteriorOutletsAndLights: string;
}

export interface ExteriorHouseBibs {
  exteriorHouseBibsType: string;
  otherExteriorHouseBibsType: string;
  exteriorHouseBibsCondition: string;
  otherExteriorHouseBibsCondition: string;
  exteriorHouseBibsComments: string;
  otherExteriorHouseBibsComments: string;
}

export interface AirCondition {
  airConditionsManufacturer: string;
  airConditionsApproximateAge: string;
  airConditionsAreaServed: string;
  otherAirConditionsAreaServed: string;
  airConditionsFuelType: string;
  otherAirConditionsFuelType: string;
  airConditionsCondition: string;
  otherAirConditionsCondition: string;
  airConditionsCondenserFins: string;
  otherAirConditionsCondenserFins: string;
  airConditionsCabinetHousing: string;
  otherAirConditionsCabinetHousing: string;
  airConditionsRefrigerantLineInsulation: string;
  otherAirConditionsRefrigerantLineInsulation: string;
  airConditionsACSystemOperation: string;
  airConditionsComments: string;
}

export interface ExteriorDetails {
  exteriorWall: ExteriorWall[];
  foundation: Foundation;
  exteriorExteriorDoor: ExteriorDoor;
  exteriorSideDoor: ExteriorSideDoor;
  exteriorPatioDoor: ExteriorPatioDoor;
  exteriorPatioScreenDoor: ExteriorPatioScreenDoor;
  exteriorDoorComments: string;
  gutter: Gutter;
  window: Window;
  gasMeter: GasMeter[];
  electricity: Electricity;
  exteriorHouseBibs: ExteriorHouseBibs;
  airCondition: AirCondition[];
}


export interface GarageCarportDetails {
  garageCarportType: string;
  otherGarageCarportType: string;
  garageCarportGarageDoor: string;
  otherGarageCarportGarageDoor: string;
  garageCarportDoorCondition: string;
  otherGarageCarportDoorCondition: string;
  garageCarportComments: string;
  garageCarportAutomaticOpener: string;
  otherGarageCarportAutomaticOpener: string;
  garageCarportSafetyReverses: string;
  otherGarageCarportSafetyReverses: string;
  garageCarportRoofing: RoofCondition;
  garageCarportFloorFoundation: FloorFoundationCondition;
  garageCarportCeiling: CeilingCondition;
  garageCarportExteriorWalls: string;
  otherGarageCarportExteriorWalls: string;
  garageCarportInteriorWalls: string;
  otherGarageCarportInteriorWalls: string;
  serviceDoor: ServiceDoor[];
  garageCarportElectricalReceptaclesLights: string;
  otherGarageCarportElectricalReceptaclesLights: string;
  garageCarportFireSeparationwall: string;
  otherGarageCarportFireSeparationwall: string;
  garageCarportElectricalReceptaclesLightsComments: string;
}

export interface RoofCondition {
  material: string;
  otherMaterial: string;
  condition: string;
  otherCondition: string;
}

export interface FloorFoundationCondition {
  material: string;
  otherMaterial: string;
  condition: string;
  otherCondition: string;
}

export interface CeilingCondition {
  material: string;
  otherMaterial: string;
  condition: string;
  otherCondition: string;
}

export interface ServiceDoor {
  garageCarportServiceDoor: string;
  garageCarportServiceDoorCondition: string;
  otherGarageCarportServiceDoorCondition: string;
  garageCarportServiceDoorSelfClose: string;
  otherGarageCarportServiceDoorSelfClose: string;
}

export interface KitchenDetails {
  kitchens: Kitchen[];
}

export interface Kitchen {
  name: string;
  kitchenCountertops: KitchenCountertops;
  kitchenCabinets: KitchenCabinets;
  kitchenPlumbings: KitchenPlumbings;
  kitchenFloors: KitchenFloors;
  kitchenWalls: KitchenWalls;
  kitchenCeilings: KitchenCeilings;
  kitchenElectricals: KitchenElectricals;
  kitchenAppliances: KitchenAppliances;
  kitchenDishwashers: KitchenDishwashers;
  kitchenRangeHoodFans: KitchenRangeHoodFans;
  kitchenRefrigerators: KitchenRefrigerators;
  kitchenMicrowaves: KitchenMicrowaves;
  kitchenOpenGroundReversePolarity: string;
}

export interface KitchenCountertops {
  kitchenCountertopsCondition: string;
  otherkitchenCountertopsCondition: string;
  countertopsComments: string;
  otherCountertopsComments: string;
}

export interface KitchenCabinets {
  kitchenCabinetsCondition: string;
  otherKitchenCabinetsCondition: string;
  kitchenCabinetsComments: string;
  otherKitchenCabinetsComments: string;
}

export interface KitchenPlumbings {
  kitchenPlumbingsCondition: string;
  otherKitchenPlumbingsCondition: string;
  kitchenPlumbingsFaucet: string;
  otherKitchenPlumbingsFaucet: string;
  kitchenPlumbingsfunctionalDrainage: string;
  otherKitchenPlumbingsFunctionalDrainage: string;
}

export interface KitchenFloors {
  kitchenFloorMaterial: string;
  otherkitchenFloorMaterial: string;
  kitchenFloorCondition: string;
  otherKitchenFloorCondition: string;
  kitchenFloorComments: string;
  otherKitchenFloorComments: string;
}

export interface KitchenWalls {
  kitchenWallsCondition: string;
  otherKitchenWallsCondition: string;
}

export interface KitchenCeilings {
  kitchenCeilingsCondition: string;
  otherKitchenCeilingsCondition: string;
}

export interface KitchenElectricals {
  kitchenElectricalsCondition: string;
  otherKitchenElectricalsCondition: string;
}

export interface KitchenAppliances {
  kitchenAppliancesRange: string;
  otherKitchenAppliancesRange: string;
  kitchenAppliancesRangeCondition: string;
  otherKitchenAppliancesCondition: string;
}

export interface KitchenDishwashers {
  kitchenDishwasher: string;
  otherKitchenDishwasher: string;
  kitchenDishwashersCondition: string;
  otherkitchenDishwashersCondition: string;
}

export interface KitchenRangeHoodFans {
  kitchenRangeHoodFan: string;
  otherKitchenRangeHoodFan: string;
}

export interface KitchenRefrigerators {
  kitchenRefrigerator: string;
  otherKitchenRefrigerator: string;
  kitchenRefrigeratorCondition: string;
  otherKitchenRefrigeratorCondition: string;
}

export interface KitchenMicrowaves {
  kitchenMicrowave: string;
  otherKitchenMicrowave: string;
}


/////2

export interface InteriorDetails {
  stairs: Stair[];
  handrails: Handrail[];
  fireplaces: Fireplace[];
  smokeDetector: SmokeDetector;
  skylight: Skylight;
  floorDrain: FloorDrain;
  attic: Attic;
  sumpPump: SumpPump;
}

export interface Stair {
  interiorStairsMaterial: string;
  otherInteriorStairsMaterial: string;
  interiorStairsCondition: string;
  otherInteriorStairsCondition: string;
  interiorStairsComments: string;
}

export interface Handrail {
  interiorHandrailsMaterial: string;
  otherInteriorHandrailsMaterial: string;
  interiorHandrailsCondition: string;
  otherInteriorHandrailsCondition: string;
  interiorHandrailsComments: string;
}

export interface Fireplace {
  interiorFireplaceLocation: string;
  otherInteriorFireplaceLocation: string;
  interiorFireplaceType: string;
  otherInteriorFireplaceType: string;
  interiorFireplaceCondition: string;
  otherInteriorFireplaceCondition: string;
  interiorFireplaceComments: string;
  otherInteriorFireplaceComments: string;
}

export interface SmokeDetector {
  interiorSmokeDetectorComments: string;
  otherInteriorSmokeDetectorComments: string;
}

export interface Skylight {
  interiorSkylightType: string;
  otherInteriorSkylightType: string;
  interiorSkylightComments: string;
  otherInteriorSkylightComments: string;
}

export interface FloorDrain {
  interiorFloorDrainCondition: string;
  otherInteriorFloorDrainCondition: string;
  interiorFloorDrainComments: string;
  otherInteriorFloorDrainComments: string;
}

export interface Attic {
  interiorAtticAccess: string;
  otherInteriorAtticAccess: string;
  interiorAtticLocation: string;
  otherInteriorAtticLocation: string;
  interiorAtticInspectionMethod: string;
  otherInteriorAtticInspectionMethod: string;
  interiorAtticRoofFraming: string;
  otherInteriorAtticRoofFraming: string;
  interiorAtticSheathing: string;
  otherInteriorAtticSheathing: string;
  interiorAtticInsulationType: string;
  otherInteriorAtticInsulationType: string;
  interiorAtticInsulationDepth: string;
  otherInteriorAtticInsulationDepth: string;
  interiorAtticVaporBarrier: string;
  otherInteriorAtticVaporBarrier: string;
  interiorAtticVentilation: string;
  otherInteriorAtticVentilation: string;
  interiorAtticExhaustFan: string;
  otherInteriorAtticExhaustFan: string;
  interiorAtticComments: string;
  otherInteriorAtticComments: string;
}

export interface SumpPump {
  interiorSumpPumpLocation: string;
  otherInteriorSumpPumpLocation: string;
  interiorSumpPumpCondition: string;
  otherInteriorSumpPumpCondition: string;
  interiorSumpPumpComments: string;
  otherInteriorSumpPumpComments: string;
}



export interface BathroomDetails {
  bathrooms: Bathroom[];
}

export interface Bathroom {
  name: string;
  bathroomFloors: BathroomFloors;
  bathroomWalls: BathroomWalls;
  bathroomCeilings: BathroomCeilings;
  bathroomDoors: BathroomDoors;
  bathroomWindows: BathroomWindows;
  bathroomElectricals: BathroomElectricals;
  bathroomCounterCabinets: BathroomCounterCabinets;
  bathroomSinkBasins: BathroomSinkBasins;
  bathroomPlumbings: BathroomPlumbings;
  bathroomToilets: BathroomToilets;
  bathroomBathtubs: BathroomBathtubs;
  bathroomStandingShowers: BathroomStandingShowers;
  bathroomFaucets: BathroomFaucets;
  bathroomWaterFlows: BathroomWaterFlows;
  bathroomMoistureStains: BathroomMoistureStains;
  bathroomHeatSources: BathroomHeatSources;
  bathroomVentilations: BathroomVentilations;
  bathroomComments: string;
}

export interface BathroomFloors {
  bathroomFloorsMaterial: string;
  otherBathroomFloorsMaterial: string;
  bathroomFloorsCondition: string;
  otherBathroomCondition: string;
}

export interface BathroomWalls {
  bathroomsWallsMaterial: string;
  otherBathromsWallsMaterial: string;
  bathroomWallsCondition: string;
  otherBathroomWallsCondition: string;
}

export interface BathroomCeilings {
  bathroomCeilingsMaterial: string;
  otherBathroomCeilingsMaterial: string;
  bathroomCeilingsCondition: string;
  otherBathroomCeilingsCondition: string;
}

export interface BathroomDoors {
  bathroomDoorsMaterial: string;
  otherBathroomDoorsMaterial: string;
  bathroomDoorsCondition: string;
  otherBathroomDoorsCondition: string;
}

export interface BathroomWindows {
  bathroomWindowsMaterial: string;
  otherBathroomWindowsMaterial: string;
}

export interface BathroomElectricals {
  bathroomElectricalsMaterial: string;
  otherBathroomElectricalsMaterial: string;
}

export interface BathroomCounterCabinets {
  bathroomCounterCabinetsMaterial: string;
  otherBathroomCounterCabinetsMaterial: string;
}

export interface BathroomSinkBasins {
  bathroomSinkBasinsMaterial: string;
  otherBathroomSinkBasinsMaterial: string;
}

export interface BathroomPlumbings {
  bathroomPlumbingsMaterial: string;
  otherBathroomPlumbingsMaterial: string;
}

export interface BathroomToilets {
  bathroomToiletsMaterial: string;
  otherbathroomToiletsMaterial: string;
}

export interface BathroomBathtubs {
  bathroomBathtubsMaterial: string;
  otherBathroomBathtubsMaterial: string;
}

export interface BathroomStandingShowers {
  bathroomStandingShowersMaterial: string;
  otherBathroomStandingShowersMaterial: string;
}

export interface BathroomFaucets {
  bathroomFaucetsMaterial: string;
  otherBathroomFaucetsMaterial: string;
}

export interface BathroomWaterFlows {
  bathroomWaterFlowsMaterial: string;
  otherBathroomWaterFlowsMaterial: string;
}

export interface BathroomMoistureStains {
  bathroomMoistureStainsMaterial: string;
  otherBathroomMoistureStainsMaterial: string;
}

export interface BathroomHeatSources {
  bathroomHeatSourcesMaterial: string;
  otherBathroomHeatSourcesMaterial: string;
}

export interface BathroomVentilations {
  bathroomVentilationsMaterial: string;
  otherbathroomVentilationsMaterial: string;
}



export interface RoomDetails {
  rooms: Room[];
}

export interface Room {
  name: string;
  bedroomWall: BedroomWall;
  ceiling: Ceiling;
  floor: Floor;
  closet: Closet;
  door: Door;
  window: Window;
  electrical: Electrical;
  heatSource: HeatSource;
  moistureStains: MoistureStains;
  bedroomsComments: string;
}

export interface BedroomWall {
  bedroomsWalls: string;
  otherBedroomsWalls: string;
  bedroomsWallsCondition: string;
  otherBedroomsWallsCondition: string;
}

export interface Ceiling {
  bedroomsCeilings: string;
  otherBedroomsCeilings: string;
  bedroomsCeilingsCondition: string;
  otherBedroomsCeilingsCondition: string;
}

export interface Floor {
  bedroomsFloors: string;
  otherBedroomsFloors: string;
  bedroomsFloorsCondition: string;
  otherBedroomsFloorsCondition: string;
}

export interface Closet {
  bedroomsClosets: string;
  otherBedroomsClosets: string;
  bedroomsClosetsCondition: string;
  otherBedroomsClosetsCondition: string;
}

export interface Door {
  bedroomsDoors: string;
  otherBedroomsDoors: string;
  bedroomsDoorsCondition: string;
  otherBedroomsDoorsCondition: string;
}

export interface Window {
  bedroomsWindows: string;
  otherBedroomsWindows: string;
}

export interface Electrical {
  bedroomsElectricals: string;
  otherBedroomsElectricals: string;
}

export interface HeatSource {
  bedroomsHeatSource: string;
  otherBedroomsHeatSource: string;
}

export interface MoistureStains {
  bedroomsMoistureStains: string;
  otherBedroomsMoistureStains: string;
}

export interface CommonAreaDetails {
  commonAreas: CommonArea[];
}

export interface CommonArea {
  name: string;
  commonAreaswall: CommonAreasWall;
  ceiling: Ceiling;
  floor: Floor;
  window: Window;
  electrical: Electrical;
  heatSource: HeatSource;
  commonAreasComments: string;
}

export interface CommonAreasWall {
  commonAreasWalls: string;
  othercommonAreasWalls: string;
  commonAreasWallsCondition: string;
  othercommonAreasWallsCondition: string;
}

export interface Ceiling {
  commonAreasCeilings: string;
  othercommonAreasCeilings: string;
  commonAreasCeilingsCondition: string;
  othercommonAreasCeilingsCondition: string;
}

export interface Floor {
  commonAreasFloors: string;
  othercommonAreasFloors: string;
  commonAreasFloorsCondition: string;
  othercommonAreasFloorsCondition: string;
}

export interface Window {
  commonAreasWindows: string;
  othercommonAreasWindows: string;
}

export interface Electrical {
  commonAreasElectricals: string;
  othercommonAreasElectricals: string;
}

export interface HeatSource {
  commonAreasHeatSource: string;
  othercommonAreasHeatSource: string;
}

export interface LaundryDetails {
  laundries: Laundry[];
}

export interface Laundry {
  name: string;
  laundryCeiling: string;
  otherLaundryCeiling: string;
  laundryWalls: string;
  otherLaundryWalls: string;
  laundryFloor: string;
  otherLaundryFloor: string;
  laundryWasher: string;
  otherLaundryWasher: string;
  laundryDryer: string;
  otherLaundryDryer: string;
  laundryPipesLeak: string;
  otherLaundryPipesLeak: string;
  laundryWasherDrain: string;
  otherLaundryWasherDrain: string;
  laundrySink: string;
  otherLaundrySink: string;
  laundryFaucet: string;
  otherLaundryFaucet: string;
  laundryHeatSource: string;
  otherLaundryHeatSource: string;
  laundryElectrical: string;
  otherLaundryElectrical: string;
  laundryRoomVented: string;
  otherLaundryRoomVented: string;
  laundryDryerVent: string;
  otherLaundryDryerVent: string;
  laundryComments: string;
}

export interface PlumbingDetails {
  regular: RegularPlumbing;
  waterHeater: WaterHeater;
}

export interface RegularPlumbing {
  plumbingMainShutoffLocation: string;
  otherPlumbingMainShutoffLocation: string;
  plumbingWaterEntryPiping: string;
  otherPlumbingWaterEntryPiping: string;
  plumbingLeadOtherThanSolderJoist: string;
  otherPlumbingLeadOtherThanSolderJoist: string;
  plumbingVisibleWaterDistributionPiping: string;
  otherPlumbingVisibleWaterDistributionPiping: string;
  plumbingCondition: string;
  otherPlumbingCondition: string;
  plumbingFunctionalFlow: string;
  otherPlumbingFunctionalFlow: string;
  plumbingDrainWasteAndVentPipe: string;
  otherPlumbingDrainWasteAndVentPipe: string;
  plumbingComments: string;
}

export interface WaterHeater {
  plumbingWaterHeaterType: string;
  otherPlumbingWaterHeaterType: string;
  waterHeaterApproximateAge: string;
  waterHeaterEnergySource: string;
  otherWaterHeaterEnergySource: string;
  waterHeaterCapacity: string;
  otherWaterHeaterCapacity: string;
  waterHeaterOperation: string;
  otherWaterHeaterOperation: string;
  waterHeaterCondition: string;
  otherWaterHeaterCondition: string;
  waterHeaterComments: string;
}

export interface HeatingSystemDetails {
  heatingSystemFurnaceLocation: string;
  otherHeatingSystemFurnaceLocation: string;
  heatingSystemManufacturer: string;
  heatingSystemApproximateAge: string;
  heatingSystemEnergySource: string;
  otherHeatingSystemEnergySource: string;
  heatingSystemType: string;
  otherHeatingSystemType: string;
  heatingSystemAreaServed: string;
  otherHeatingSystemAreaServed: string;
  heatingSystemThermostats: string;
  otherHeatingSystemThermostats: string;
  heatingSystemDistribution: string;
  otherHeatingSystemDistribution: string;
  heatingSystemInteriorFuelStorage: string;
  otherHeatingSystemInteriorFuelStorage: string;
  heatingSystemGasServiceLines: string;
  otherHeatingSystemGasServiceLines: string;
  heatingSystemBlowerFan: string;
  otherHeatingSystemBlowerFan: string;
  heatingSystemFilter: string;
  otherHeatingSystemFilter: string;
  heatingSystemSuspectedAsbestos: string;
  otherHeatingSystemSuspectedAsbestos: string;
  heatingSystemOperation: string;
  otherHeatingSystemOperation: string;
  heatingSystemCondition: string;
  otherHeatingSystemCondition: string;
  heatingSystemComments: string;
}

export interface ElectricalSystemDetails {
  mainElectricalPanel: MainElectricalPanel;
  lightingAndOutlets: LightingAndOutlets;
}

export interface MainElectricalPanel {
  electricalMainElectricalPanelLocation: string;
  otherElectricalMainElectricalPanelLocation: string;
  electricalMainElectricalPanelCondition: string;
  otherElectricalMainElectricalPanelCondition: string;
  electricalAdequateClearanceToPanel: string;
  otherElectricalAdequateClearanceToPanel: string;
  electricalMainBreakerSize: string;
  otherElectricalMainBreakerSize: string;
  electricalServiceSizeAmps: string;
  otherElectricalServiceSizeAmps: string;
  electricalVolts: string;
  otherElectricalVolts: string;
  electricalAppearsGrounded: string;
  otherElectricalAppearsGrounded: string;
  electricalMainWiring: string;
  otherElectricalMainWiring: string;
  electricalMainElectricalPanelComments: string;
  otherElectricalMainElectricalPanelComments: string;
}

export interface LightingAndOutlets {
  electricallightsAndOutletsComments: string;
}

export interface BasementDetails {
  basements: Basement[];
}

export interface Basement {
  name: string;
  basementLaundryCeiling: string;
  otherBasementLaundryCeiling: string;
  basementWalls: string;
  otherBasementWalls: string;
  basementVaporBarrier: string;
  otherBasementBarrier: string;
  basementInsulation: string;
  otherBasementInsulation: string;
  basementDoors: string;
  otherBasementDoors: string;
  basementWindows: string;
  otherBasementWindows: string;
  basementElectrical: string;
  otherBasementElectrical: string;
  basementFloor: BasementFloor;
  basementStairs: BasementStairs;
}

export interface BasementFloor {
  basementFloorMaterial: string;
  otherBasementFloorMaterial: string;
  basementFloorCondition: string;
  otherBasementFloorCondition: string;
  basementFloorCovered: string;
  otherBasementFloorCovered: string;
}

export interface BasementStairs {
  basementStairsConditon: string;
  otherBasementStairsCondition: string;
  basementStairsHandrail: string;
  otherBasementStairsHandrail: string;
  basementStairsHeadway: string;
  otherBasementStairsHeadway: string;
}

export interface Inspection {
  id?: string;
  inspections: string;
}

export interface InspectionTable {
  _id: string;
  inspections: string;
}

export interface InspectionUpdateResponse{
  code?: string;
  data?: InspectionUpdate;
}

export interface InspectionUpdate {
  _id?: string;
  inspections?: string;
  generalInfo?: string;
  buildingInfo?: string;
  groundsInfo?: string;
  roofInfo?: string;
  exteriorInfo?: string;
  garageCarportInfo?: string;
  kitchenInfo?: string;
  bathroomInfo?: string;
  roomInfo?: string;
  commonAreasInfo?: string;
  laundryInfo?: string;
  plumbingInfo?: string;
  interiorInfo?: string;
  heatingSystemInfo?: string;
  electricalSystemInfo?: string;
  basementInfo?: string;
}

export interface Result {
  id?: string;
  message?: number;
}

export interface Feature {
  clientInformation: ClientInformation;
  inspectionCompany: InspectionCompany;
  buildingDetails: BuildingDetails;
  lotsGroundsDetails: LotsGroundsDetails;
  roofDetails: RoofDetails;
  exteriorDetails: ExteriorDetails;
  garageCarportDetails: GarageCarportDetails;
  kitchenDetails: KitchenDetails;
  bathroomsDetails: BathroomDetails;
  roomsDetails: RoomDetails;
  ImageUploadFiles: string[];
}

export interface PostResponse {
  status: string;
  message: string;
  posts: Array<{ fieldName: string; imageName: string }>;
}




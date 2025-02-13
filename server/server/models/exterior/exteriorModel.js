const mongoose = require('mongoose');

const exteriorWallSchema = new mongoose.Schema({
    exteriorWallType: { type: [String] },
    otherExteriorWallType: { type: String },
    exteriorWallCondition: { type: [String] },
    otherExteriorWallCondition: { type: String },
    exteriorWallComments: { type: String }
});

const foundationSchema = new mongoose.Schema({
    foundationType: { type: [String] },
    otherFoundationType: { type: String },
    exteriorFoundationCondition: { type: [String] },
    otherExteriorFoundationCondition: { type: String },
    foundationComments: { type: [String] },
    otherFoundationComments: { type: String },
    interiorFoundationCondition: { type: [String] },
    otherInteriorFoundationCondition: { type: String },
    interiorFoundationComments: { type: [String] },
    otherInteriorFoundationComments: { type: String },
    cracks: { type: [String] },
    otherCracks: { type: String },
    coveredFoundationWalls: { type: [String] },
    otherCoveredFoundationWalls: { type: String },
    coveredFoundationWallsComments: { type: [String] }
});

const exteriorDoorSchema = new mongoose.Schema({
    exteriorDoorMainEntryDoor: { type: [String] },
    otherExteriorDoorMainEntryDoor: { type: String },
    exteriorDoorDoorCondition: { type: [String] },
    otherExteriorDoorDoorCondition: { type: String },
    exteriorDoorWeatherStripping: { type: [String] },
    exteriorDoorStormDoor: { type: [String] },
    exteriorDoorStormDoorCondition: { type: [String] },
    otherExteriorDoorStormDoorCondition: { type: String },
    exteriorDoorDoorBell: { type: [String] },
    otherExteriorDoorDoorBell: { type: String },
    exteriorDoorDoorBellType: { type: [String] },
    otherExteriorDoorDoorBellType: { type: String }
});

const exteriorSideDoorSchema = new mongoose.Schema({
    exteriorSideDoors: { type: [String] },
    otherExteriorSideDoors: { type: String },
    exteriorSideDoorsDoorCondition: { type: [String] },
    otherExteriorSideDoorsDoorCondition: { type: String },
    exteriorSideDoorsWeatherStripping: { type: [String] },
    otherExteriorSideDoorsWeatherStripping: { type: String }
});

const exteriorPatioDoorSchema = new mongoose.Schema({
    exteriorPatioDoors: { type: [String] },
    otherExteriorPatioDoors: { type: String },
    exteriorPatioDoorsCondition: { type: [String] },
    otherExteriorPatioDoorsCondition: { type: String },
    exteriorPatioDoorsComments: { type: [String] },
    otherExteriorPatioDoorsComments: { type: String }
});

const exteriorPatioScreenDoorSchema = new mongoose.Schema({
    exteriorPatioScreensDoors: { type: [String] },
    otherExteriorPatioScreensDoors: { type: String },
    exteriorPatioDoorScreensCondition: { type: [String] },
    otherExteriorPatioDoorScreensCondition: { type: String },
    exteriorPatioDoorScreensComments: { type: [String] },
    otherExteriorPatioDoorScreensComments: { type: String }
});

const gutterSchema = new mongoose.Schema({
    guttersDownspoutsRoofDrainageMaterial: { type: [String] },
    otherGuttersDownspoutsRoofDrainageMaterial: { type: String },
    guttersDownspoutsRoofDrainageCondition: { type: [String] },
    otherGuttersDownspoutsRoofDrainageCondition: { type: String },
    guttersDownspoutsRoofDrainageLeaking: { type: [String] },
    otherGuttersDownspoutsRoofDrainageLeaking: { type: String },
    guttersDownspoutsRoofDrainageAttachment: { type: [String] },
    otherGuttersDownspoutsRoofDrainageAttachment: { type: String },
    guttersDownspoutsRoofDrainageExtensionNeeded: { type: [String] },
    otherGuttersDownspoutsRoofDrainageExtensionNeeded: { type: String },
    guttersDownspoutsRoofDrainageComments: { type: [String] },
    otherGuttersDownspoutsRoofDrainageComments: { type: String }
});

const windowSchema = new mongoose.Schema({
    windowsApproximateAge: { type: [String] },
    otherWindowsApproximateAge: { type: String },
    windowsMaterialAndType: { type: [String] },
    otherWindowsMaterialAndType: { type: String },
    windowsCondition: { type: [String] },
    otherWindowsCondition: { type: String },
    windowsComments: { type: [String] },
    otherWindowsComments: { type: String },
    windowScreens: { type: [String] },
    windowScreensCondition: { type: [String] },
    otherWindowScreensCondition: { type: String },
    windowScreensComments: { type: [String] },
    otherWindowScreensComments: { type: String },
    basementWindows: { type: String },
    basementWindowsApproximateAge: { type: String },
    basementWindowsMaterial: { type: [String] },
    otherBasementWindowsMaterial: { type: String },
    basementWindowsCondition: { type: [String] },
    otherBasementWindowsCondition: { type: String },
    basementWindowsComments: { type: [String] },
    otherBasementWindowsComments: { type: String }
});

const gasMeterSchema = new mongoose.Schema({
    gasMeterType: { type: [String] },
    otherGasMeterType: { type: String },
    gasMeterCondition: { type: [String] },
    otherGasMeterCondition: { type: String },
    gasMeterComments: { type: String }
});

const electricitySchema = new mongoose.Schema({
    exteriorOutletsAndLights: { type: [String] },
    otherExteriorOutletsAndLights: { type: String }
});

const exteriorHouseBibsSchema = new mongoose.Schema({
    exteriorHouseBibsType: { type: [String] },
    otherExteriorHouseBibsType: { type: String },
    exteriorHouseBibsCondition: { type: [String] },
    otherExteriorHouseBibsCondition: { type: String },
    exteriorHouseBibsComments: { type: [String] },
    otherExteriorHouseBibsComments: { type: String }
});

const airConditionSchema = new mongoose.Schema({
    airConditionsManufacturer: { type: String },
    airConditionsApproximateAge: { type: String },
    airConditionsAreaServed: { type: [String] },
    otherAirConditionsAreaServed: { type: String },
    airConditionsFuelType: { type: [String] },
    otherAirConditionsFuelType: { type: String },
    airConditionsCondition: { type: [String] },
    otherAirConditionsCondition: { type: String },
    airConditionsCondenserFins: { type: [String] },
    otherAirConditionsCondenserFins: { type: String },
    airConditionsCabinetHousing: { type: [String] },
    otherAirConditionsCabinetHousing: { type: String },
    airConditionsRefrigerantLineInsulation: { type: [String] },
    otherAirConditionsRefrigerantLineInsulation: { type: String },
    airConditionsACSystemOperation: { type: [String] },
    airConditionsComments: { type: String }
});

const exteriorDetailsSchema = new mongoose.Schema({
    exteriorWall: [exteriorWallSchema],
    foundation: foundationSchema,
    exteriorExteriorDoor: exteriorDoorSchema,
    exteriorSideDoor: exteriorSideDoorSchema,
    exteriorPatioDoor: exteriorPatioDoorSchema,
    exteriorPatioScreenDoor: exteriorPatioScreenDoorSchema,
    exteriorDoorComments: { type: String },
    gutter: gutterSchema,
    window: windowSchema,
    gasMeter: [gasMeterSchema],
    electricity: electricitySchema,
    exteriorHouseBibs: exteriorHouseBibsSchema,
    airCondition: [airConditionSchema]
});

const ExteriorDetails = mongoose.model('exterior', exteriorDetailsSchema);
module.exports = ExteriorDetails;
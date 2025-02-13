const mongoose = require('mongoose');

const serviceDoorSchema = new mongoose.Schema({
    garageCarportServiceDoor: { type: [String] },
    garageCarportServiceDoorCondition: { type: [String] },
    otherGarageCarportServiceDoorCondition: { type: String },
    garageCarportServiceDoorSelfClose: { type: [String] },
    otherGarageCarportServiceDoorSelfClose: { type: String }
});

const garageCarportSchema = new mongoose.Schema({
    garageCarportType: { type: [String] },
    otherGarageCarportType: { type: String },
    garageCarportGarageDoor: { type: [String] },
    otherGarageCarportGarageDoor: { type: String },
    garageCarportDoorCondition: { type: [String] },
    otherGarageCarportDoorCondition: { type: String },
    garageCarportComments: { type: String },
    garageCarportAutomaticOpener: { type: [String] },
    otherGarageCarportAutomaticOpener: { type: String },
    garageCarportSafetyReverses: { type: [String] },
    otherGarageCarportSafetyReverses: { type: String },
    garageCarportRoofing: { type: [String] },
    garageCarportRoofingCondition: { type: [String] },
    otherGarageCarportRoofingCondition: { type: String },
    garageCarportFloorFoundation: { type: [String] },
    otherGarageCarportFloorFoundation: { type: String },
    garageCarportFloorFoundationCondition: { type: [String] },
    otherGarageCarportFloorFoundationCondition: { type: String },
    garageCarportCeiling: { type: [String] },
    otherGarageCarportCeiling: { type: String },
    garageCarportCeilingCondition: { type: [String] },
    otherGarageCarportCeilingCondition: { type: String },
    garageCarportExteriorWalls: { type: [String] },
    otherGarageCarportExteriorWalls: { type: String },
    garageCarportInteriorWalls: { type: [String] },
    otherGarageCarportInteriorWalls: { type: String },
    serviceDoor: [serviceDoorSchema],
    garageCarportElectricalReceptaclesLights: { type: [String] },
    otherGarageCarportElectricalReceptaclesLights: { type: String },
    garageCarportFireSeparationwall: { type: [String] },
    otherGarageCarportFireSeparationwall: { type: String },
    garageCarportElectricalReceptaclesLightsComments: { type: String }
});

const GarageCarportData = mongoose.model('garageCarport', garageCarportSchema);
module.exports = GarageCarportData;
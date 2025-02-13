const mongoose = require('mongoose');

const bathroomFloorsSchema = new mongoose.Schema({
    bathroomFloorsMaterial: { type: [String] },
    otherBathroomFloorsMaterial: { type: String },
    bathroomFloorsCondition: { type: [String] },
    otherBathroomCondition: { type: String }
});

const bathroomWallsSchema = new mongoose.Schema({
    bathroomsWallsMaterial: { type: [String] },
    otherBathromsWallsMaterial: { type: String },
    bathroomWallsCondition: { type: [String] },
    otherBathroomWallsCondition: { type: String }
});

const bathroomCeilingsSchema = new mongoose.Schema({
    bathroomCeilingsMaterial: { type: [String] },
    otherBathroomCeilingsMaterial: { type: String },
    bathroomCeilingsCondition: { type: [String] },
    otherBathroomCeilingsCondition: { type: String }
});

const bathroomDoorsSchema = new mongoose.Schema({
    bathroomDoorsMaterial: { type: [String] },
    otherBathroomDoorsMaterial: { type: String },
    bathroomDoorsCondition: { type: [String] },
    otherBathroomDoorsCondition: { type: String }
});

const bathroomWindowsSchema = new mongoose.Schema({
    bathroomWindowsMaterial: { type: [String] },
    otherBathroomWindowsMaterial: { type: String }
});

const bathroomElectricalsSchema = new mongoose.Schema({
    bathroomElectricalsMaterial: { type: [String] },
    otherBathroomElectricalsMaterial: { type: String }
});

const bathroomCounterCabinetsSchema = new mongoose.Schema({
    bathroomCounterCabinetsMaterial: { type: [String] },
    otherBathroomCounterCabinetsMaterial: { type: String }
});

const bathroomSinkBasinsSchema = new mongoose.Schema({
    bathroomSinkBasinsMaterial: { type: [String] },
    otherBathroomSinkBasinsMaterial: { type: String }
});

const bathroomPlumbingsSchema = new mongoose.Schema({
    bathroomPlumbingsMaterial: { type: [String] },
    otherBathroomPlumbingsMaterial: { type: String }
});

const bathroomToiletsSchema = new mongoose.Schema({
    bathroomToiletsMaterial: { type: [String] },
    otherbathroomToiletsMaterial: { type: String }
});

const bathroomBathtubsSchema = new mongoose.Schema({
    bathroomBathtubsMaterial: { type: [String] },
    otherBathroomBathtubsMaterial: { type: String }
});

const bathroomStandingShowersSchema = new mongoose.Schema({
    bathroomStandingShowersMaterial: { type: [String] },
    otherBathroomStandingShowersMaterial: { type: String }
});

const bathroomFaucetsSchema = new mongoose.Schema({
    bathroomFaucetsMaterial: { type: [String] },
    otherBathroomFaucetsMaterial: { type: String }
});

const bathroomWaterFlowsSchema = new mongoose.Schema({
    bathroomWaterFlowsMaterial: { type: [String] },
    otherBathroomWaterFlowsMaterial: { type: String }
});

const bathroomMoistureStainsSchema = new mongoose.Schema({
    bathroomMoistureStainsMaterial: { type: [String] },
    otherBathroomMoistureStainsMaterial: { type: String }
});

const bathroomHeatSourcesSchema = new mongoose.Schema({
    bathroomHeatSourcesMaterial: { type: [String] },
    otherBathroomHeatSourcesMaterial: { type: String }
});

const bathroomVentilationsSchema = new mongoose.Schema({
    bathroomVentilationsMaterial: { type: [String] },
    otherbathroomVentilationsMaterial: { type: String }
});

const bathroomSchema = new mongoose.Schema({
    name: { type: String },
    bathroomFloors: bathroomFloorsSchema,
    bathroomWalls: bathroomWallsSchema,
    bathroomCeilings: bathroomCeilingsSchema,
    bathroomDoors: bathroomDoorsSchema,
    bathroomWindows: bathroomWindowsSchema,
    bathroomElectricals: bathroomElectricalsSchema,
    bathroomCounterCabinets: bathroomCounterCabinetsSchema,
    bathroomSinkBasins: bathroomSinkBasinsSchema,
    bathroomPlumbings: bathroomPlumbingsSchema,
    bathroomToilets: bathroomToiletsSchema,
    bathroomBathtubs: bathroomBathtubsSchema,
    bathroomStandingShowers: bathroomStandingShowersSchema,
    bathroomFaucets: bathroomFaucetsSchema,
    bathroomWaterFlows: bathroomWaterFlowsSchema,
    bathroomMoistureStains: bathroomMoistureStainsSchema,
    bathroomHeatSources: bathroomHeatSourcesSchema,
    bathroomVentilations: bathroomVentilationsSchema,
    bathroomComments: { type: String }
});

const bathroomDataSchema = new mongoose.Schema({
    bathrooms: [bathroomSchema]
});

const BathroomData = mongoose.model('bathroom', bathroomDataSchema);
module.exports = BathroomData;
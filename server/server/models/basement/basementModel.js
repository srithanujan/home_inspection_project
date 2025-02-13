const mongoose = require('mongoose');

const basementFloorSchema = new mongoose.Schema({
    basementFloorMaterial: { type: [String] },
    otherBasementFloorMaterial: { type: String },
    basementFloorCondition: { type: [String] },
    otherBasementFloorCondition: { type: String },
    basementFloorCovered: { type: [String] },
    otherBasementFloorCovered: { type: String }
});

const basementStairsSchema = new mongoose.Schema({
    basementStairsConditon: { type: [String] },
    otherBasementStairsCondition: { type: String },
    basementStairsHandrail: { type: [String] },
    otherBasementStairsHandrail: { type: String },
    basementStairsHeadway: { type: [String] },
    otherBasementStairsHeadway: { type: String }
});

const basementSchema = new mongoose.Schema({
    name: { type: String },
    basementLaundryCeiling: { type: [String] },
    otherBasementLaundryCeiling: { type: String },
    basementWalls: { type: [String] },
    otherBasementWalls: { type: String },
    basementVaporBarrier: { type: [String] },
    otherBasementBarrier: { type: String },
    basementInsulation: { type: [String] },
    otherBasementInsulation: { type: String },
    basementDoors: { type: [String] },
    otherBasementDoors: { type: String },
    basementWindows: { type: [String] },
    otherBasementWindows: { type: String },
    basementElectrical: { type: [String] },
    otherBasementElectrical: { type: String },
    basementFloor: basementFloorSchema,
    basementStairs: basementStairsSchema
});

const basementDataSchema = new mongoose.Schema({
    basements: [basementSchema]
});

const BasementData = mongoose.model('basement', basementDataSchema);
module.exports = BasementData;
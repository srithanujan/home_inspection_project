const mongoose = require('mongoose');

const commonAreasWallSchema = new mongoose.Schema({
    commonAreasWalls: { type: [String] },
    othercommonAreasWalls: { type: String },
    commonAreasWallsCondition: { type: [String] },
    othercommonAreasWallsCondition: { type: String }
});

const ceilingSchema = new mongoose.Schema({
    commonAreasCeilings: { type: [String] },
    othercommonAreasCeilings: { type: String },
    commonAreasCeilingsCondition: { type: [String] },
    othercommonAreasCeilingsCondition: { type: String }
});

const floorSchema = new mongoose.Schema({
    commonAreasFloors: { type: [String] },
    othercommonAreasFloors: { type: String },
    commonAreasFloorsCondition: { type: [String] },
    othercommonAreasFloorsCondition: { type: String }
});

const windowSchema = new mongoose.Schema({
    commonAreasWindows: { type: [String] },
    othercommonAreasWindows: { type: String }
});

const electricalSchema = new mongoose.Schema({
    commonAreasElectricals: { type: [String] },
    othercommonAreasElectricals: { type: String }
});

const heatSourceSchema = new mongoose.Schema({
    commonAreasHeatSource: { type: [String] },
    othercommonAreasHeatSource: { type: String }
});

const commonAreaSchema = new mongoose.Schema({
    name: { type: String },
    commonAreaswall: commonAreasWallSchema,
    ceiling: ceilingSchema,
    floor: floorSchema,
    window: windowSchema,
    electrical: electricalSchema,
    heatSource: heatSourceSchema,
    commonAreasComments: { type: String }
});

const commonAreasDataSchema = new mongoose.Schema({
    commonAreas: [commonAreaSchema]
});

const CommonAreasData = mongoose.model('commonArea', commonAreasDataSchema);
module.exports = CommonAreasData;
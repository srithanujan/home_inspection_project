const mongoose = require('mongoose');

const bedroomWallSchema = new mongoose.Schema({
    bedroomsWalls: { type: [String] },
    otherBedroomsWalls: { type: String },
    bedroomsWallsCondition: { type: [String] },
    otherBedroomsWallsCondition: { type: String }
});

const ceilingSchema = new mongoose.Schema({
    bedroomsCeilings: { type: [String] },
    otherBedroomsCeilings: { type: String },
    bedroomsCeilingsCondition: { type: [String] },
    otherBedroomsCeilingsCondition: { type: String }
});

const floorSchema = new mongoose.Schema({
    bedroomsFloors: { type: [String] },
    otherBedroomsFloors: { type: String },
    bedroomsFloorsCondition: { type: [String] },
    otherBedroomsFloorsCondition: { type: String }
});

const closetSchema = new mongoose.Schema({
    bedroomsClosets: { type: [String] },
    otherBedroomsClosets: { type: String },
    bedroomsClosetsCondition: { type: [String] },
    otherBedroomsClosetsCondition: { type: String }
});

const doorSchema = new mongoose.Schema({
    bedroomsDoors: { type: [String] },
    otherBedroomsDoors: { type: String },
    bedroomsDoorsCondition: { type: [String] },
    otherBedroomsDoorsCondition: { type: String }
});

const windowSchema = new mongoose.Schema({
    bedroomsWindows: { type: [String] },
    otherBedroomsWindows: { type: String }
});

const electricalSchema = new mongoose.Schema({
    bedroomsElectricals: { type: [String] },
    otherBedroomsElectricals: { type: String }
});

const heatSourceSchema = new mongoose.Schema({
    bedroomsHeatSource: { type: [String] },
    otherBedroomsHeatSource: { type: String }
});

const moistureStainsSchema = new mongoose.Schema({
    bedroomsMoistureStains: { type: [String] },
    otherBedroomsMoistureStains: { type: String }
});

const roomSchema = new mongoose.Schema({
    name: { type: String },
    bedroomwall: bedroomWallSchema,
    ceiling: ceilingSchema,
    floor: floorSchema,
    closet: closetSchema,
    door: doorSchema,
    window: windowSchema,
    electrical: electricalSchema,
    heatSource: heatSourceSchema,
    moistureStains: moistureStainsSchema,
    bedroomsComments: { type: String }
});

const roomDataSchema = new mongoose.Schema({
    rooms: [roomSchema]
});


const RoomData = mongoose.model('room', roomDataSchema);
module.exports = RoomData;
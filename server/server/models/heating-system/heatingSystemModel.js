const mongoose = require('mongoose');

const heatingSystemSchema = new mongoose.Schema({
    heatingSystemFurnaceLocation: { type: [String] },
    otherHeatingSystemFurnaceLocation: { type: String },
    heatingSystemManufacturer: { type: String },
    heatingSystemApproximateAge: { type: String },
    heatingSystemEnergySource: { type: [String] },
    otherHeatingSystemEnergySource: { type: String },
    heatingSystemType: { type: [String] },
    otherHeatingSystemType: { type: String },
    heatingSystemAreaServed: { type: [String] },
    otherHeatingSystemAreaServed: { type: String },
    heatingSystemThermostats: { type: [String] },
    otherHeatingSystemThermostats: { type: String },
    heatingSystemDistribution: { type: [String] },
    otherHeatingSystemDistribution: { type: String },
    heatingSystemInteriorFuelStorage: { type: [String] },
    otherHeatingSystemInteriorFuelStorage: { type: String },
    heatingSystemGasServiceLines: { type: [String] },
    otherHeatingSystemGasServiceLines: { type: String },
    heatingSystemBlowerFan: { type: [String] },
    otherHeatingSystemBlowerFan: { type: String },
    heatingSystemFilter: { type: [String] },
    otherHeatingSystemFilter: { type: String },
    heatingSystemSuspectedAsbestos: { type: [String] },
    otherHeatingSystemSuspectedAsbestos: { type: String },
    heatingSystemOperation: { type: [String] },
    otherHeatingSystemOperation: { type: String },
    heatingSystemCondition: { type: [String] },
    otherHeatingSystemCondition: { type: String },
    heatingSystemComments: { type: String }
});

const HeatingSystemData = mongoose.model('heatingSystem', heatingSystemSchema);
module.exports = HeatingSystemData; 
const mongoose = require('mongoose');
const buildingDataSchema = new mongoose.Schema({
    estimatedAge: { type: String },
    buildingType: { type: [String] },
    otherBuildingType: { type: String },
    occupancyState: { type: [String] },
    otherOccupancyState: { type: String },
    garage: { type: [String] },
    otherGarage: { type: String },
    exterior: { type: [String] },
    otherExterior: { type: String },
    weatherCondition: { type: [String] },
    otherWeatherCondition: { type: String },
    soilCondition: { type: [String] },
    otherSoilCondition: { type: String },
    outdoorTemperature: { type: String },
    inspectionDate: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    recentRain: { type: [String] },
    electricityOn: { type: [String] },
    otherElectricityOn: { type: String },
    gasOilOn: { type: [String] },
    otherGasOilOn: { type: String },
    waterOn: { type: [String] },
    otherWaterOn: { type: String }
  });
  

const BuildingData = mongoose.model('building', buildingDataSchema);
module.exports = BuildingData;
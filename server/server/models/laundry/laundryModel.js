const mongoose = require("mongoose");

const laundrySchema = new mongoose.Schema({
  name: { type: [String] },
  laundryCeiling: { type: [String] },
  otherLaundryCeiling: { type: String },
  laundryWalls: { type: [String] },
  otherLaundryWalls: { type: String },
  laundryFloor: { type: [String] },
  otherLaundryFloor: { type: String },
  laundryWasher: { type: [String] },
  otherLaundryWasher: { type: String },
  laundryDryer: { type: [String] },
  otherLaundryDryer: { type: String },
  laundryPipesLeak: { type: [String] },
  otherLaundryPipesLeak: { type: String },
  laundryWasherDrain: { type: [String] },
  otherLaundryWasherDrain: { type: String },
  laundrySink: { type: [String] },
  otherLaundrySink: { type: String },
  laundryFaucet: { type: [String] },
  otherLaundryFaucet: { type: String },
  laundryHeatSource: { type: [String] },
  otherLaundryHeatSource: { type: String },
  laundryElectrical: { type: [String] },
  otherLaundryElectrical: { type: String },
  laundryRoomVented: { type: [String] },
  otherLaundryRoomVented: { type: String },
  laundryDryerVent: { type: [String] },
  otherLaundryDryerVent: { type: String },
  laundryComments: { type: [String] },
});

const laundryDataSchema = new mongoose.Schema({
  laundrys: [laundrySchema],
});

const LaundryData = mongoose.model("laundry", laundryDataSchema);
module.exports = LaundryData;

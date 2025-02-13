const mongoose = require('mongoose');

const roofDescriptionSchema = new mongoose.Schema({
  style: { type: [String] },
  otherStyle: { type: String },
  pitch: { type: [String] },
  otherPitch: { type: String },
  visibility: { type: [String] },
  otherVisibility: { type: String },
  methodOfInspection: { type: [String] },
  otherMethodOfInspection: { type: String },
  ventilationPresent: { type: [String] },
  ventilationType: { type: [String] },
  otherVentilationType: { type: String },
});

const conditionOfCoveringsSchema = new mongoose.Schema({
    material: { type: [String] },
    approximateAgeShingles: { type: String },
    otherMaterial: { type: String },
    condition: { type: [String] },
    otherCondition: { type: String },
    comments: { type: String }
});

const plumbingVentsSchema = new mongoose.Schema({
  plumbingOfVents: { type: [String] },
  otherPlumbingOfVents: { type: String },
  type: { type: [String] },
  otherType: { type: String },
  condition: { type: [String] },
  otherCondition: { type: String },
  comments: { type: String },
});

const roofSchema = new mongoose.Schema({
    roofDescription: roofDescriptionSchema,
    conditionOfCoverings: conditionOfCoveringsSchema,
    plumbingVents: plumbingVentsSchema
});

const RoofData = mongoose.model('roof', roofSchema);
module.exports = RoofData;
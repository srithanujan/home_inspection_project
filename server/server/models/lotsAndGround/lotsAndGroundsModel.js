const mongoose = require("mongoose");

const drivewaySchema = new mongoose.Schema({
  material: { type: [String] },
  otherMaterial: { type: String },
  condition: { type: [String] },
  otherCondition: { type: String },
  comments: { type: [String] },
  otherComments: { type: String },
});

const porchSchema = new mongoose.Schema({
  material: { type: [String] },
  otherMaterial: { type: String },
  condition: { type: [String] },
  otherCondition: { type: String },
  comments: { type: String },
});

const stepsHandrailsSchema = new mongoose.Schema({
  material: { type: [String] },
  otherMaterial: { type: String },
  condition: { type: [String] },
  otherCondition: { type: String },
  comments: { type: String },
  otherComments: { type: String },
});

const deckPatioSchema = new mongoose.Schema({
  material: { type: [String] },
  otherMaterial: { type: String },
  condition: { type: [String] },
  otherCondition: { type: String },
  comments: { type: String },
});

const fenceSchema = new mongoose.Schema({
  material: { type: [String] },
  otherMaterial: { type: String },
  condition: { type: [String] },
  otherCondition: { type: String },
  comments: { type: String },
  otherComments: { type: String },
});

const landscapingSchema = new mongoose.Schema({
  recommendations: { type: [String] },
  otherRecommendations: { type: String },
});

const groundsSchema = new mongoose.Schema({
  driveway: drivewaySchema,
  porch: porchSchema,
  stepsHandrails: stepsHandrailsSchema,
  deckPatio: [deckPatioSchema],
  fence: fenceSchema,
  landscaping: landscapingSchema,
});

const GroundsData = mongoose.model("ground", groundsSchema);
module.exports = GroundsData;

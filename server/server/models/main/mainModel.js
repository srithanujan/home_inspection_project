// const mongoose = require('mongoose');

// const InspectionSchema = new mongoose.Schema({
//   inspections: {
//     type: String,
//     required: true
//   }
// });

// const Inspection = mongoose.model('fullInspection', InspectionSchema);

// module.exports = Inspection;


const mongoose = require('mongoose');

const InspectionSchema = new mongoose.Schema({
  inspections: {
    type: String,
    required: true
  },
  generalInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'general'
  },
  buildingInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'building'
  },
  groundsInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ground'
  },
  roofInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roof'
  },
  exteriorInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'exterior'
  },
  garageCarportInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'garageCarport'
  },
  kitchenInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'kitchen'
  },
  bathroomInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bathroom'
  },
  roomInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'room'
  },
  commonAreasInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'commonArea'
  },
  laundryInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'laundry'
  },
  interiorInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'interior'
  },
  plumbingInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'plumbing'
  },
  heatingSystemInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'heatingSystem'
  },
  electricalSystemInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'electricalSystem'
  },
  basementInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'basement'
  }
});

const Inspection = mongoose.model('fullInspection', InspectionSchema);

module.exports = Inspection;
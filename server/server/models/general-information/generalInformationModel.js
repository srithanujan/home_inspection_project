const mongoose = require('mongoose');
const generalSchema = new mongoose.Schema({
  clientInformation: {
    contactName: { type: String },
    clientAddress: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
  },
  inspectionCompany: {
    inspectorName: { type: String },
    inspectionAddress: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
  }

});

const General = mongoose.model('general', generalSchema);
module.exports = General;

// contactName
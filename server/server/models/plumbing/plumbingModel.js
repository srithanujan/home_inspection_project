const mongoose = require('mongoose');

const regularPlumbingSchema = new mongoose.Schema({
    plumbingMainShutoffLocation: { type: [String] },
    otherPlumbingMainShutoffLocation: { type: String },
    plumbingWaterEntryPiping: { type: [String] },
    otherPlumbingWaterEntryPiping: { type: String },
    plumbingLeadOtherThanSolderJoist: { type: [String] },
    otherPlumbingLeadOtherThanSolderJoist: { type: String },
    plumbingVisibleWaterDistributionPiping: { type: [String] },
    otherPlumbingVisibleWaterDistributionPiping: { type: String },
    plumbingCondition: { type: [String] },
    otherPlumbingCondition: { type: String },
    plumbingFunctionalFlow: { type: [String] },
    otherPlumbingFunctionalFlow: { type: String },
    plumbingDrainWasteAndVentPipe: { type: [String] },
    otherPlumbingDrainWasteAndVentPipe: { type: String },
    plumbingComments: { type: String }
});

const waterHeaterSchema = new mongoose.Schema({
    plumbingWaterHeaterType: { type: [String] },
    otherPlumbingWaterHeaterType: { type: String },
    waterHeaterApproximateAge: { type: String },
    waterHeaterEnergySource: { type: [String] },
    otherWaterHeaterEnergySource: { type: String },
    waterHeaterCapacity: { type: [String] },
    otherWaterHeaterCapacity: { type: String },
    waterHeaterOperation: { type: [String] },
    otherWaterHeaterOperation: { type: String },
    waterHeaterCondition: { type: [String] },
    otherWaterHeaterCondition: { type: String },
    waterHeaterComments: { type: String }
});

const plumbingSchema = new mongoose.Schema({
    regular: regularPlumbingSchema,
    waterHeater: waterHeaterSchema
});

const PlumbingData = mongoose.model('plumbing', plumbingSchema);
module.exports = PlumbingData;
const mongoose = require('mongoose');

const mainElectricalPanelSchema = new mongoose.Schema({
    electricalMainElectricalPanelLocation: { type: [String] },
    otherElectricalMainElectricalPanelLocation: { type: String },
    electricalMainElectricalPanelCondition: { type: [String] },
    otherElectricalMainElectricalPanelCondition: { type: String },
    electricalAdequateClearanceToPanel: { type: [String] },
    otherElectricalAdequateClearanceToPanel: { type: String },
    electricalMainBreakerSize: { type: [String] },
    otherElectricalMainBreakerSize: { type: String },
    electricalServiceSizeAmps: { type: [String] },
    otherElectricalServiceSizeAmps: { type: String },
    electricalVolts: { type: [String] },
    otherElectricalVolts: { type: String },
    electricalAppearsGrounded: { type: [String] },
    otherElectricalAppearsGrounded: { type: String },
    electricalMainWiring: { type: [String] },
    otherElectricalMainWiring: { type: String },
    electricalMainElectricalPanelComments: { type: [String] },
    otherElectricalMainElectricalPanelComments: { type: String }
});

const lightingAndOutletsSchema = new mongoose.Schema({
    electricallightsAndOutletsComments: { type: String }
});

const electricalSystemSchema = new mongoose.Schema({
    mainElectricalPanel: mainElectricalPanelSchema,
    lightingAndOutlets: lightingAndOutletsSchema
});

const ElectricalSystemData = mongoose.model('electricalSystem', electricalSystemSchema);
module.exports = ElectricalSystemData;
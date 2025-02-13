// const GarageCarportData = require('../../models/garage-carport/garageCarportModel');

// exports.addGarageCarportData = async (req, res) => {
//     try {
//         const garageCarportDetails = new GarageCarportData(req.body);

//         await garageCarportDetails.save();
//         res.status(201).send({ message: 'Garage/Carport data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };


const GarageCarportData = require('../../models/garage-carport/garageCarportModel');
const Inspection = require('../../models/main/mainModel');

exports.addGarageCarportDataToInspection = async (req, res) => {
  try {

    const serviceDoor = Array.isArray(req.body.serviceDoor)
      ? req.body.serviceDoor
      : [req.body.serviceDoor];
      
    const garageCarport = new GarageCarportData({
      garageCarportType: req.body.garageCarportType,
      otherGarageCarportType: req.body.otherGarageCarportType,
      garageCarportGarageDoor: req.body.garageCarportGarageDoor,
      otherGarageCarportGarageDoor: req.body.otherGarageCarportGarageDoor,
      garageCarportDoorCondition: req.body.garageCarportDoorCondition,
      otherGarageCarportDoorCondition: req.body.otherGarageCarportDoorCondition,
      garageCarportComments: req.body.garageCarportComments,
      garageCarportAutomaticOpener: req.body.garageCarportAutomaticOpener,
      otherGarageCarportAutomaticOpener:
        req.body.otherGarageCarportAutomaticOpener,
      garageCarportSafetyReverses: req.body.garageCarportSafetyReverses,
      otherGarageCarportSafetyReverses:
        req.body.otherGarageCarportSafetyReverses,
      garageCarportRoofing: req.body.garageCarportRoofing,
      garageCarportRoofingCondition: req.body.garageCarportRoofingCondition,
      otherGarageCarportRoofingCondition:
        req.body.otherGarageCarportRoofingCondition,
      garageCarportFloorFoundation: req.body.garageCarportFloorFoundation,
      otherGarageCarportFloorFoundation:
        req.body.otherGarageCarportFloorFoundation,
      garageCarportFloorFoundationCondition:
        req.body.garageCarportFloorFoundationCondition,
      otherGarageCarportFloorFoundationCondition:
        req.body.otherGarageCarportFloorFoundationCondition,
      garageCarportCeiling: req.body.garageCarportCeiling,
      otherGarageCarportCeiling: req.body.otherGarageCarportCeiling,
      garageCarportCeilingCondition: req.body.garageCarportCeilingCondition,
      otherGarageCarportCeilingCondition:
        req.body.otherGarageCarportCeilingCondition,
      garageCarportExteriorWalls: req.body.garageCarportExteriorWalls,
      otherGarageCarportExteriorWalls: req.body.otherGarageCarportExteriorWalls,
      garageCarportInteriorWalls: req.body.garageCarportInteriorWalls,
      otherGarageCarportInteriorWalls: req.body.otherGarageCarportInteriorWalls,
      serviceDoor: serviceDoor,
      garageCarportElectricalReceptaclesLights:
        req.body.garageCarportElectricalReceptaclesLights,
      otherGarageCarportElectricalReceptaclesLights:
        req.body.otherGarageCarportElectricalReceptaclesLights,
      garageCarportFireSeparationwall: req.body.garageCarportFireSeparationwall,
      otherGarageCarportFireSeparationwall:
        req.body.otherGarageCarportFireSeparationwall,
      garageCarportElectricalReceptaclesLightsComments:
        req.body.garageCarportElectricalReceptaclesLightsComments,
    });

    const savedGarageCarportDetails = await garageCarport.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.garageCarportInfo = savedGarageCarportDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getGarageCarportDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const garageCarportDetails = await GarageCarportData.findById(inspection.garageCarportInfo);
    if (!garageCarportDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      garageCarportDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
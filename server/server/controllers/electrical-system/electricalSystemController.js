// const ElectricalSystemData = require('../../models/electrical-system/electricalSystemModel');

// exports.addElectricalSystemData = async (req, res) => {
//     try {
//         const electricalSystemDetails = new ElectricalSystemData(req.body);

//         await electricalSystemDetails.save();
//         res.status(201).send({ message: 'Electrical system data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };

const ElectricalSystemData = require("../../models/electrical-system/electricalSystemModel");
const Inspection = require("../../models/main/mainModel");

exports.addElectricalSystemDataToInspection = async (req, res) => {
  try {
    // Destructure data from request body
    const { mainElectricalPanel, lightingAndOutlets, inspectionId } = req.body;

    // Create a new ElectricalSystemData object based on the model
    const electricalSystem = new ElectricalSystemData({
      mainElectricalPanel,
      lightingAndOutlets,
    });

    // Save the electrical system data to the database
    const savedElectricalSystemDetails = await electricalSystem.save();

    // Find the inspection document by its ID
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    // Associate the saved electrical system data with the inspection document
    inspection.electricalSystemInfo = savedElectricalSystemDetails._id;
    await inspection.save();

    // Respond with a success message and updated inspection details
    res.status(200).json({
      message: "Electrical system data added successfully",
      inspection,
    });
  } catch (error) {
    console.error("Error adding electrical system data:", error.message);
    res.status(400).json({
      message: "Failed to add electrical system data",
      error: error.message,
    });
  }
};

exports.getElectricalSystemDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const electricalSystemDetails = await ElectricalSystemData.findById(
      inspection.electricalSystemInfo
    );
    if (!electricalSystemDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      electricalSystemDetails,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

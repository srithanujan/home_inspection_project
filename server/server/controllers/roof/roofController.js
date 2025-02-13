// const RoofData = require('../../models/roof/roofModel');

// exports.addRoofData = async (req, res) => {
//     try {
//         const roofDetails = new RoofData({
//             roofDescription: req.body.roofDescription,
//             conditionOfCoverings: req.body.conditionOfCoverings,
//             plumbingVents: req.body.plumbingVents
//         });

//         await roofDetails.save();
//         res.status(201).send({ message: 'Roof data added successfully' });
//     } catch (error) {
//         console.log(error.message);
//         res.status(400).send(error.message);
//     }
// };


const RoofData = require('../../models/roof/roofModel');
const Inspection = require('../../models/main/mainModel');

exports.addRoofDataToInspection = async (req, res) => {
  try {
    const roof = new RoofData({
      roofDescription: req.body.roofDescription,
      conditionOfCoverings: req.body.conditionOfCoverings,
      plumbingVents: req.body.plumbingVents
    });

    const savedRoofDetails = await roof.save();

    const inspectionId = req.body.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    inspection.roofInfo = savedRoofDetails._id;
    await inspection.save();

    res.status(200).json({ message: 200, inspection });

  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

exports.getRoofDataAndInspection = async (req, res) => {
  try {
    const inspectionId = req.params.inspectionId;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: 404 });
    }

    const roofDetails = await RoofData.findById(inspection.roofInfo);
    if (!roofDetails) {
      return res.status(404).json({ message: 404 });
    }

    res.status(200).json({
      message: 200,
      inspection,
      roofDetails
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};